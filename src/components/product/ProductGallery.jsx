import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductImage from "@/components/product/ProductImage";
import ProductMockupPreview from "@/components/product/ProductMockupPreview";

function GalleryItemView({ item, thumbnail = false }) {
  if (!item) {
    return null;
  }

  if (item.kind === "mockup") {
    return (
      <ProductMockupPreview
        alt={item.alt}
        className={thumbnail ? "p-2" : "p-6 sm:p-8"}
        designImageUrl={item.mockupConfig.designImageUrl}
        designSize={item.mockupConfig.designSize}
        fallbackImageUrl={item.mockupConfig.fallbackImageUrl}
        frameClassName={thumbnail ? "max-w-[132px]" : "max-w-[420px]"}
        garmentColor={item.garmentColor}
        imageAlt={item.alt}
        offsetX={item.mockupConfig.offsetX}
        offsetY={item.mockupConfig.offsetY}
        overlayOnTop={false}
        placement={item.mockupConfig.placement}
        printArea={item.mockupConfig.printArea}
        rotation={item.mockupConfig.rotation}
        scale={item.mockupConfig.scale}
      />
    );
  }

  return (
    <ProductImage
      alt={item.alt}
      className={thumbnail ? "h-28" : "h-[430px] sm:h-[540px]"}
      fit="contain"
      image={item.image}
      imageClassName={thumbnail ? "p-2" : "p-6"}
      name="GGDev"
      surfaceClassName="bg-slate-100"
    />
  );
}

export default function ProductGallery({ activeIndex, items = [], onChange }) {
  const activeItem = items[activeIndex] || items[0] || null;
  const hasMultipleImages = items.length > 1;

  const goToPrevious = () => {
    if (!hasMultipleImages) {
      return;
    }

    onChange(activeIndex === 0 ? items.length - 1 : activeIndex - 1);
  };

  const goToNext = () => {
    if (!hasMultipleImages) {
      return;
    }

    onChange(activeIndex === items.length - 1 ? 0 : activeIndex + 1);
  };

  return (
    <div className="space-y-4">
      <div className="panel relative overflow-hidden">
        <div className="h-[430px] sm:h-[540px]">
          <GalleryItemView item={activeItem} />
        </div>

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
          {items.map((item, index) => (
            <button
              key={item.id || index}
              aria-label={`Ver imagen ${index + 1}`}
              className={`min-w-[110px] overflow-hidden rounded-[24px] border md:min-w-0 ${
                activeIndex === index
                  ? "border-aqua shadow-glow"
                  : "border-white/10 hover:border-white/20"
              }`}
              onClick={() => onChange(index)}
              type="button"
            >
              <GalleryItemView item={item} thumbnail />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
