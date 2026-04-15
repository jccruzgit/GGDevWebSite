import {
  getSupabaseClient,
  getSupabasePublicUrl,
  hasSupabaseConfig,
  supabaseProductsTable,
  supabaseStorageBucket,
} from "@/lib/supabase";

export const defaultProductSizes = ["S", "M", "L", "XL", "2XL"];
export const defaultProductColors = [
  { name: "Negro eclipse", hex: "#111827" },
  { name: "Blanco polar", hex: "#F5F7FA" },
  { name: "Azul midnight", hex: "#13213B" },
];

export const productCategoryLabels = {
  anime: "Anime",
  bands: "Metal",
  custom: "Personalizados",
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

function buildProductPayload({ currentImagePath = null, product, userId }) {
  return {
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
    main_image_path: currentImagePath,
    secondary_image_paths: Array.isArray(product.secondaryImagePaths) ? product.secondaryImagePaths : [],
    created_by: userId || null,
  };
}

async function removeStorageObjects(paths) {
  const validPaths = Array.isArray(paths) ? paths.filter(Boolean) : [];

  if (validPaths.length === 0 || !hasSupabaseConfig) {
    return;
  }

  const client = getSupabaseClient();
  await client.storage.from(supabaseStorageBucket).remove(validPaths);
}

async function uploadProductMainImage({ currentImagePath = "", file, slug }) {
  if (!file) {
    return currentImagePath || "";
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

  if (currentImagePath && currentImagePath !== path) {
    await removeStorageObjects([currentImagePath]);
  }

  return path;
}

async function uploadSecondaryImageFile({ client, file, slug, index }) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${slug}/secondary-${Date.now()}-${index}.${extension}`;
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

async function uploadSecondaryImages({ currentPaths = [], files = [], galleryItems = [], slug }) {
  const nextGalleryItems = Array.isArray(galleryItems) ? galleryItems.filter(Boolean) : [];
  const previousPaths = Array.isArray(currentPaths) ? currentPaths.filter(Boolean) : [];

  if (nextGalleryItems.length > 0) {
    const client = getSupabaseClient();
    const finalPaths = [];

    for (const [index, item] of nextGalleryItems.entries()) {
      if (item.kind === "existing" && item.path) {
        finalPaths.push(item.path);
        continue;
      }

      if (item.kind === "new" && item.file) {
        finalPaths.push(
          await uploadSecondaryImageFile({
            client,
            file: item.file,
            index,
            slug,
          })
        );
      }
    }

    const removedPaths = previousPaths.filter((path) => !finalPaths.includes(path));
    await removeStorageObjects(removedPaths);
    return finalPaths;
  }

  const nextFiles = Array.isArray(files) ? files.filter(Boolean) : [];

  if (nextFiles.length === 0) {
    return previousPaths;
  }

  const client = getSupabaseClient();
  const uploadedPaths = [];

  for (const [index, file] of nextFiles.entries()) {
    uploadedPaths.push(await uploadSecondaryImageFile({ client, file, index, slug }));
  }

  await removeStorageObjects(previousPaths);
  return uploadedPaths;
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
  const mainImage = getSupabasePublicUrl(record.main_image_path);
  const secondaryImages = normalizeImageList(record.secondary_image_paths);

  return {
    id: record.id || record.slug,
    remoteId: record.id || null,
    slug: record.slug,
    name: record.name,
    category: record.category,
    categoryLabel: productCategoryLabels[record.category] || record.category || "CatÃ¡logo",
    price: Number(record.price) || 20,
    shortDescription:
      record.short_description || "DiseÃ±o agregado desde el panel administrativo.",
    description:
      record.description ||
      "Producto administrado desde Supabase y listo para mostrarse en catÃ¡logo.",
    availableColors: normalizeColors(record.available_colors),
    sizes: normalizeSizes(record.sizes),
    mainImage: mainImage || "",
    mainImagePath: record.main_image_path || "",
    secondaryImages,
    secondaryImagePaths: Array.isArray(record.secondary_image_paths)
      ? record.secondary_image_paths
      : [],
    tag: record.tag || "",
    featured: Boolean(record.featured),
    active: record.active !== false,
    createdAt: record.created_at || "",
    updatedAt: record.updated_at || "",
    source: "supabase",
  };
}

export function mergeCatalogProducts(remoteProducts = []) {
  return Array.isArray(remoteProducts) ? remoteProducts : [];
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

export async function createAdminProduct({
  file,
  product,
  secondaryFiles = [],
  secondaryGalleryItems = [],
  userId,
}) {
  if (!hasSupabaseConfig) {
    throw new Error("Falta configurar Supabase en las variables de entorno.");
  }

  const client = getSupabaseClient();
  const mainImagePath = await uploadProductMainImage({
    file,
    slug: product.slug,
  });
  const secondaryImagePaths = await uploadSecondaryImages({
    files: secondaryFiles,
    galleryItems: secondaryGalleryItems,
    slug: product.slug,
  });
  const payload = buildProductPayload({
    currentImagePath: mainImagePath,
    product: {
      ...product,
      secondaryImagePaths,
    },
    userId,
  });

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

export async function updateAdminProduct({
  currentImagePath = "",
  currentSecondaryImagePaths = [],
  file,
  product,
  productId,
  secondaryFiles = [],
  secondaryGalleryItems = [],
  userId,
}) {
  if (!hasSupabaseConfig) {
    throw new Error("Falta configurar Supabase en las variables de entorno.");
  }

  const client = getSupabaseClient();
  const mainImagePath = await uploadProductMainImage({
    currentImagePath,
    file,
    slug: product.slug,
  });
  const secondaryImagePaths = await uploadSecondaryImages({
    currentPaths: currentSecondaryImagePaths,
    files: secondaryFiles,
    galleryItems: secondaryGalleryItems,
    slug: product.slug,
  });
  const payload = buildProductPayload({
    currentImagePath: mainImagePath,
    product: {
      ...product,
      secondaryImagePaths,
    },
    userId,
  });

  const { data, error } = await client
    .from(supabaseProductsTable)
    .update(payload)
    .eq("id", productId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return normalizeSupabaseProduct(data);
}

export async function patchAdminProduct(productId, changes) {
  if (!hasSupabaseConfig) {
    throw new Error("Falta configurar Supabase en las variables de entorno.");
  }

  const client = getSupabaseClient();
  const { data, error } = await client
    .from(supabaseProductsTable)
    .update(changes)
    .eq("id", productId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return normalizeSupabaseProduct(data);
}

export async function deleteAdminProduct({
  mainImagePath = "",
  productId,
  secondaryImagePaths = [],
}) {
  if (!hasSupabaseConfig) {
    throw new Error("Falta configurar Supabase en las variables de entorno.");
  }

  const client = getSupabaseClient();
  const { error } = await client
    .from(supabaseProductsTable)
    .delete()
    .eq("id", productId);

  if (error) {
    throw error;
  }

  await removeStorageObjects([mainImagePath, ...secondaryImagePaths]);
}

