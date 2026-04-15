export function getProductGalleryImages(product) {
  return [product?.mainImage, ...(product?.secondaryImages || [])].filter(Boolean);
}

export function getProductPrimaryImage(product) {
  return getProductGalleryImages(product)[0] || "";
}

export function getProductFallbackImage() {
  return "";
}
