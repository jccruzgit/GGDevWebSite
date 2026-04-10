export default function ProductGallery({ images, activeIndex, onChange }) {
  return (
    <div className="space-y-4">
      <div className="panel overflow-hidden">
        <img
          alt="Vista del diseño"
          className="h-[430px] w-full object-cover sm:h-[540px]"
          src={images[activeIndex]}
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
            <img alt="" className="h-28 w-full object-cover" src={image} />
          </button>
        ))}
      </div>
    </div>
  );
}
