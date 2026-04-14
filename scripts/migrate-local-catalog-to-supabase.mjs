import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_SIZES = ["S", "M", "L", "XL", "2XL"];
const DEFAULT_COLORS = [
  { name: "Negro eclipse", hex: "#111827" },
  { name: "Blanco polar", hex: "#F5F7FA" },
  { name: "Azul midnight", hex: "#13213B" },
];
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

const currentFilePath = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(currentFilePath), "..");

function loadEnvFile(filePath) {
  return fs.readFile(filePath, "utf8").then((contents) => {
    contents.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        return;
      }

      const separatorIndex = trimmed.indexOf("=");

      if (separatorIndex === -1) {
        return;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const rawValue = trimmed.slice(separatorIndex + 1).trim();

      if (!key || process.env[key]) {
        return;
      }

      process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
    });
  });
}

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}.`);
  }

  return value;
}

function parseProductSeeds(source) {
  const productsSectionMatch = source.match(
    /export const products = \[([\s\S]*?)\n\];/
  );

  if (!productsSectionMatch) {
    throw new Error("No se encontro el bloque export const products en src/data/products.js.");
  }

  const matches = [...productsSectionMatch[1].matchAll(/buildProduct\(\{([\s\S]*?)\n\s*\}\),/g)];

  if (matches.length === 0) {
    throw new Error("No se encontraron productos locales en src/data/products.js.");
  }

  return matches.map((match) => {
    const objectLiteral = `({${match[1]}\n})`;
    const product = Function(`"use strict"; return ${objectLiteral};`)();

    return {
      slug: product.id,
      name: product.name,
      category: product.category,
      price: 20,
      short_description: product.shortDescription,
      description: product.description,
      tag: product.tag || null,
      featured: Boolean(product.featured),
      active: product.active !== false,
      accent: product.accent || "#3AA6FF",
      glow: product.glow || "#7CF8D2",
      sizes: DEFAULT_SIZES,
      available_colors: DEFAULT_COLORS,
    };
  });
}

async function loadLocalProducts() {
  const sourcePath = path.join(projectRoot, "src", "data", "products.js");
  const source = await fs.readFile(sourcePath, "utf8");
  return parseProductSeeds(source);
}

function getMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

async function findLocalImageFiles(product) {
  const galleryPath = path.join(projectRoot, "public", "mockups", product.category, product.slug);

  try {
    const entries = await fs.readdir(galleryPath, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((filename) => IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase()))
      .sort((left, right) => {
        const leftScore = left.toLowerCase().startsWith("main") ? 0 : 1;
        const rightScore = right.toLowerCase().startsWith("main") ? 0 : 1;

        if (leftScore !== rightScore) {
          return leftScore - rightScore;
        }

        return left.localeCompare(right);
      })
      .map((filename) => ({
        filename,
        localPath: path.join(galleryPath, filename),
        storagePath: `${product.category}/${product.slug}/${filename}`,
      }));
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function uploadImage(client, bucket, image) {
  const fileBuffer = await fs.readFile(image.localPath);
  const { error } = await client.storage.from(bucket).upload(image.storagePath, fileBuffer, {
    upsert: true,
    contentType: getMimeType(image.localPath),
    cacheControl: "3600",
  });

  if (error) {
    throw error;
  }
}

async function fetchExistingProduct(client, table, slug) {
  const { data, error } = await client
    .from(table)
    .select("id, slug, main_image_path, secondary_image_paths")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function migrateProduct({ bucket, client, product, table }) {
  const existingProduct = await fetchExistingProduct(client, table, product.slug);
  const localImages = await findLocalImageFiles(product);

  if (localImages.length > 0) {
    for (const image of localImages) {
      await uploadImage(client, bucket, image);
    }
  }

  const mainImagePath =
    localImages[0]?.storagePath ||
    existingProduct?.main_image_path ||
    null;
  const secondaryImagePaths =
    localImages.length > 1
      ? localImages.slice(1).map((image) => image.storagePath)
      : Array.isArray(existingProduct?.secondary_image_paths)
        ? existingProduct.secondary_image_paths
        : [];

  const payload = {
    ...product,
    main_image_path: mainImagePath,
    secondary_image_paths: secondaryImagePaths,
  };

  const { data, error } = await client
    .from(table)
    .upsert(payload, {
      onConflict: "slug",
      ignoreDuplicates: false,
    })
    .select("id, slug, name, main_image_path, secondary_image_paths")
    .single();

  if (error) {
    throw error;
  }

  return {
    slug: data.slug,
    name: data.name,
    uploadedImages: localImages.length,
  };
}

async function main() {
  await loadEnvFile(path.join(projectRoot, ".env"));

  const supabaseUrl = getRequiredEnv("VITE_SUPABASE_URL");
  const supabaseServiceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const productsTable = process.env.VITE_SUPABASE_PRODUCTS_TABLE || "products";
  const storageBucket = process.env.VITE_SUPABASE_STORAGE_BUCKET || "product-mockups";

  const client = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const products = await loadLocalProducts();
  const results = [];

  for (const product of products) {
    const result = await migrateProduct({
      bucket: storageBucket,
      client,
      product,
      table: productsTable,
    });

    results.push(result);
    console.log(`Migrado ${result.slug} (${result.uploadedImages} imagenes locales subidas)`);
  }

  console.log("");
  console.log(`Catalogo migrado: ${results.length} productos procesados.`);
}

main().catch((error) => {
  console.error("La migracion fallo.");
  console.error(error?.message || error);
  process.exitCode = 1;
});
