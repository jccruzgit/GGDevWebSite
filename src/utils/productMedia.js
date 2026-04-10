import { createMockGallery } from "@/utils/mockImage";

const fallbackImage = createMockGallery({
  title: "GGDev Signature",
  accent: "#7CF8D2",
  glow: "#27E4F2",
})[0];

export function getProductGalleryImages(product) {
  const images = [product?.mainImage, ...(product?.secondaryImages || [])].filter(Boolean);

  return images.length > 0 ? images : [fallbackImage];
}

export function getProductPrimaryImage(product) {
  return getProductGalleryImages(product)[0];
}

export function getProductFallbackImage() {
  return fallbackImage;
}
