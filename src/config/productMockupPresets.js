import { getSupabasePublicUrl } from "@/lib/supabase";

export const productMockupPresets = {
  "legacy-code": {
    designPath: "mockups/designs/legacy-code/front.png?v=2",
    placement: "frente",
    scale: 0.92,
    rotation: 0,
  },
};

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toPublicAssetUrl(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  if (/^(https?:|data:|\/)/i.test(value)) {
    return value;
  }

  return `${import.meta.env.BASE_URL}${value.replace(/^\.?\//, "")}`;
}

function toNumber(value, fallback) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeDimension(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

function normalizeDesignSize(value) {
  if (!isPlainObject(value)) {
    return null;
  }

  const width = normalizeDimension(value.width);
  const height = normalizeDimension(value.height);

  if (!width && !height) {
    return null;
  }

  return {
    ...(height ? { height } : {}),
    ...(width ? { width } : {}),
  };
}

function normalizePrintArea(value) {
  if (!isPlainObject(value)) {
    return null;
  }

  const x = normalizeDimension(value.x);
  const y = normalizeDimension(value.y);
  const width = normalizeDimension(value.width);
  const height = normalizeDimension(value.height);

  if (![x, y, width, height].every(Boolean)) {
    return null;
  }

  return { height, width, x, y };
}

function mergeMockupConfig(baseConfig = {}, overrideConfig = {}) {
  return {
    ...baseConfig,
    ...overrideConfig,
    designSize: {
      ...(isPlainObject(baseConfig.designSize) ? baseConfig.designSize : {}),
      ...(isPlainObject(overrideConfig.designSize) ? overrideConfig.designSize : {}),
    },
    printArea: {
      ...(isPlainObject(baseConfig.printArea) ? baseConfig.printArea : {}),
      ...(isPlainObject(overrideConfig.printArea) ? overrideConfig.printArea : {}),
    },
  };
}

export function resolveProductMockupConfig(product) {
  if (!product) {
    return null;
  }

  const preset = productMockupPresets[product.slug] || {};
  const remoteConfig = isPlainObject(product.mockupConfig) ? product.mockupConfig : {};
  const mergedConfig = mergeMockupConfig(preset, remoteConfig);
  const designImageUrl =
    toPublicAssetUrl(mergedConfig.designImageUrl || mergedConfig.designPath) ||
    getSupabasePublicUrl(mergedConfig.designImagePath);
  const fallbackImageUrl =
    toPublicAssetUrl(mergedConfig.fallbackImageUrl || mergedConfig.fallbackImagePath) ||
    product.mainImage ||
    "";

  return {
    alt: mergedConfig.alt || `Vista previa de ${product.name || "producto"}`,
    designImageUrl,
    designSize: normalizeDesignSize(mergedConfig.designSize),
    enabled: mergedConfig.enabled !== false,
    fallbackImageUrl,
    garmentColor: mergedConfig.garmentColor || null,
    offsetX: toNumber(mergedConfig.offsetX, 0),
    offsetY: toNumber(mergedConfig.offsetY, 0),
    placement: mergedConfig.placement || "frente",
    printArea: normalizePrintArea(mergedConfig.printArea),
    rotation: toNumber(mergedConfig.rotation, 0),
    scale: toNumber(mergedConfig.scale, 1),
  };
}

export function hasProductMockupPreview(product) {
  const config = resolveProductMockupConfig(product);

  return Boolean(config?.enabled && config.designImageUrl);
}
