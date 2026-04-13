import { products as localProducts } from "@/data/products";
import {
  getSupabaseClient,
  getSupabasePublicUrl,
  hasSupabaseConfig,
  supabaseProductsTable,
  supabaseStorageBucket,
} from "@/lib/supabase";
import { createMockGallery } from "@/utils/mockImage";

export const defaultProductSizes = ["S", "M", "L", "XL", "2XL"];
export const defaultProductColors = [
  { name: "Negro eclipse", hex: "#111827" },
  { name: "Blanco polar", hex: "#F5F7FA" },
  { name: "Azul midnight", hex: "#13213B" },
];

export const productCategoryLabels = {
  anime: "Anime",
  devs: "Devs",
  gaming: "Gaming",
  motogp: "MotoGP",
  streetwear: "Streetwear",
  "tech-humor": "Tech Humor",
};

export const productCategoryOptions = Object.entries(productCategoryLabels).map(
  ([value, label]) => ({
    label,
    value,
  })
);

function normalizeSizes(sizes) {
  return Array.isArray(sizes) && sizes.length > 0 ? sizes : defaultProductSizes;
}

function normalizeColors(colors) {
  return Array.isArray(colors) && colors.length > 0 ? colors : defaultProductColors;
}

function normalizeImageList(paths) {
  if (!Array.isArray(paths)) {
    return [];
  }

  return paths.map((path) => getSupabasePublicUrl(path)).filter(Boolean);
}

export function slugifyProductName(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeSupabaseProduct(record) {
  const accent = record.accent || "#3AA6FF";
  const glow = record.glow || "#7CF8D2";
  const fallbackImages = createMockGallery({
    title: record.name || "GGDev",
    accent,
    glow,
  });
  const mainImage = getSupabasePublicUrl(record.main_image_path);
  const secondaryImages = normalizeImageList(record.secondary_image_paths);

  return {
    id: record.slug || record.id,
    slug: record.slug,
    name: record.name,
    category: record.category,
    categoryLabel: productCategoryLabels[record.category] || record.category || "Catalogo",
    price: Number(record.price) || 20,
    shortDescription:
      record.short_description ||
      "Diseno agregado desde el panel administrativo.",
    description:
      record.description ||
      "Producto administrado desde Supabase y listo para mostrarse en catalogo.",
    availableColors: normalizeColors(record.available_colors),
    sizes: normalizeSizes(record.sizes),
    mainImage: mainImage || fallbackImages[0],
    secondaryImages: secondaryImages.length > 0 ? secondaryImages : fallbackImages.slice(1),
    tag: record.tag || "",
    featured: Boolean(record.featured),
    active: record.active !== false,
    source: "supabase",
  };
}

export function mergeCatalogProducts(remoteProducts = []) {
  const productMap = new Map(localProducts.map((product) => [product.slug, product]));

  remoteProducts.forEach((product) => {
    productMap.set(product.slug, product);
  });

  return Array.from(productMap.values());
}

export async function fetchPublicCatalogProducts() {
  if (!hasSupabaseConfig) {
    return [];
  }

  const client = getSupabaseClient();
  const { data, error } = await client
    .from(supabaseProductsTable)
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(normalizeSupabaseProduct);
}

export async function fetchAdminProducts() {
  if (!hasSupabaseConfig) {
    return [];
  }

  const client = getSupabaseClient();
  const { data, error } = await client
    .from(supabaseProductsTable)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(normalizeSupabaseProduct);
}

async function uploadProductMainImage({ file, slug }) {
  if (!file) {
    return "";
  }

  const client = getSupabaseClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${slug}/main-${Date.now()}.${extension}`;
  const { error } = await client.storage.from(supabaseStorageBucket).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  return path;
}

export async function createAdminProduct({ file, product, userId }) {
  if (!hasSupabaseConfig) {
    throw new Error("Falta configurar Supabase en las variables de entorno.");
  }

  const client = getSupabaseClient();
  const mainImagePath = await uploadProductMainImage({
    file,
    slug: product.slug,
  });
  const payload = {
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: Number(product.price) || 20,
    short_description: product.shortDescription,
    description: product.description,
    tag: product.tag || null,
    featured: Boolean(product.featured),
    active: Boolean(product.active),
    accent: product.accent || "#3AA6FF",
    glow: product.glow || "#7CF8D2",
    sizes: normalizeSizes(product.sizes),
    available_colors: normalizeColors(product.availableColors),
    main_image_path: mainImagePath,
    secondary_image_paths: [],
    created_by: userId,
  };

  const { data, error } = await client
    .from(supabaseProductsTable)
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return normalizeSupabaseProduct(data);
}
