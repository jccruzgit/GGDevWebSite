import { resolveProductMockupConfig } from "@/config/productMockupPresets";

export function getProductGalleryImages(product) {
  return [product?.mainImage, ...(product?.secondaryImages || [])].filter(Boolean);
}

export function getProductGalleryItems(product) {
  const fallbackImages = getProductGalleryImages(product);
  const mockupConfig = resolveProductMockupConfig(product);
  const supportsDynamicPreview = Boolean(mockupConfig?.enabled && mockupConfig.designImageUrl);

  if (!supportsDynamicPreview) {
    return fallbackImages.map((image, index) => ({
      alt: `Vista ${index + 1} de ${product?.name || "producto"}`,
      id: `image-${index}`,
      image,
      kind: "image",
    }));
  }

  const staticGallery = fallbackImages
    .filter((image, index) => !(index === 0 && image === mockupConfig.fallbackImageUrl))
    .map((image, index) => ({
      alt: `Vista ${index + 1} de ${product?.name || "producto"}`,
      id: `image-${index}`,
      image,
      kind: "image",
    }));

  return [
    {
      alt: mockupConfig.alt,
      fallbackImageUrl: mockupConfig.fallbackImageUrl,
      id: "mockup-preview",
      kind: "mockup",
      mockupConfig,
    },
    ...staticGallery,
  ];
}

export function getProductPrimaryImage(product) {
  return getProductGalleryImages(product)[0] || "";
}

export function getProductFallbackImage() {
  return "";
}
