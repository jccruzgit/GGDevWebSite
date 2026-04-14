import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductImage from "@/components/product/ProductImage";

export default function ProductGallery({ images, activeIndex, onChange }) {
  const hasMultipleImages = images.length > 1;

  const goToPrevious = () => {
    if (!hasMultipleImages) {
      return;
    }

    onChange(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  };

  const goToNext = () => {
    if (!hasMultipleImages) {
      return;
    }

    onChange(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
  };

  return (
    <div className="space-y-4">
      <div className="panel relative overflow-hidden">
        <ProductImage
          alt="Vista del diseño"
          className="h-[430px] sm:h-[540px]"
          fit="contain"
          image={images[activeIndex]}
          imageClassName="p-6"
          name="GGDev"
          surfaceClassName="bg-slate-100"
        />

        {hasMultipleImages ? (
          <>
            <button
              aria-label="Ver imagen anterior"
              className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white backdrop-blur-md hover:border-aqua/30 hover:text-aqua"
              onClick={goToPrevious}
              type="button"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Ver imagen siguiente"
              className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white backdrop-blur-md hover:border-aqua/30 hover:text-aqua"
              onClick={goToNext}
              type="button"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className="flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible">
          {images.map((image, index) => (
            <button
              key={index}
              aria-label={`Ver imagen ${index + 1}`}
              className={`min-w-[110px] overflow-hidden rounded-[24px] border md:min-w-0 ${
                activeIndex === index
                  ? "border-aqua shadow-glow"
                  : "border-white/10 hover:border-white/20"
              }`}
              onClick={() => onChange(index)}
              type="button"
            >
              <ProductImage
                alt=""
                className="h-28"
                fit="contain"
                image={image}
                imageClassName="p-2"
                name="GGDev"
                surfaceClassName="bg-slate-100"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
