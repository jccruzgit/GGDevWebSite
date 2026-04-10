import ProductImage from "@/components/product/ProductImage";

export default function ProductGallery({ images, activeIndex, onChange }) {
  return (
    <div className="space-y-4">
      <div className="panel overflow-hidden">
        <ProductImage
          alt="Vista del diseño"
          className="h-[430px] sm:h-[540px]"
          image={images[activeIndex]}
          name="GGDev"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            aria-label={`Ver imagen ${index + 1}`}
            className={`overflow-hidden rounded-[24px] border ${
              activeIndex === index
                ? "border-aqua shadow-glow"
                : "border-white/10 hover:border-white/20"
            }`}
            onClick={() => onChange(index)}
            type="button"
          >
            <ProductImage alt="" className="h-28" image={image} name="GGDev" />
          </button>
        ))}
      </div>
    </div>
  );
}
