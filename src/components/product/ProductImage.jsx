export default function ProductImage({
  alt,
  category,
  className = "",
  image,
  name,
  watermark = false,
}) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-surface-3 via-night to-surface-2 ${className}`}>
      {image ? (
        <img
          alt={alt}
          className="h-full w-full object-cover"
          src={image}
        />
      ) : (
        <div className="flex h-full w-full flex-col justify-end bg-[radial-gradient(circle_at_top,rgba(39,228,242,0.16),transparent_28%),linear-gradient(180deg,rgba(8,18,37,1),rgba(5,13,29,1))] p-5">
          <span className="eyebrow w-fit">{category || "GGDev"}</span>
          <p className="mt-4 max-w-[16rem] text-2xl font-bold text-white">{name || "GGDev"}</p>
          <p className="mt-2 text-sm text-slate-400">
            Mockup pendiente de reemplazar por imagen final de producto.
          </p>
        </div>
      )}

      {watermark ? (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-[clamp(1.8rem,6vw,3.8rem)] font-bold uppercase tracking-[0.45em] text-white/6">
              GGDev
            </span>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-end p-4">
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45 backdrop-blur-md">
              GGDev
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
}
