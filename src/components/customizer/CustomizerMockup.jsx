import ProductMockupPreview from "@/components/product/ProductMockupPreview";

export default function CustomizerMockup({
  image,
  placement,
  garmentColor,
  offsetX,
  offsetY,
  onOffsetChange,
  scale,
  fileName,
}) {
  return (
    <div className="panel surface-grid relative overflow-hidden p-5 sm:p-6">
      <div className="absolute inset-x-12 top-6 h-20 rounded-full bg-aqua/12 blur-3xl" />
      <div className="relative flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
          Vista activa: {placement}
        </div>
        <p className="text-right text-xs uppercase tracking-[0.18em] text-slate-400">
          {fileName ? fileName : "Sin archivo cargado"}
        </p>
      </div>

      <div className="relative mt-5 aspect-[16/10] w-full overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(39,228,242,0.16),_transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:36px_36px] opacity-40" />
        <ProductMockupPreview
          className="p-6 sm:p-8"
          designImageUrl={image}
          emptyLabel={placement === "espalda" ? "Espalda lista para arte" : "Frente listo para arte"}
          frameClassName="max-w-[420px]"
          garmentColor={garmentColor}
          imageAlt={placement === "espalda" ? "Diseño cargado en la espalda" : "Diseño cargado"}
          interactive
          offsetX={offsetX}
          offsetY={offsetY}
          onOffsetChange={onOffsetChange}
          placement={placement}
          scale={scale}
        />
      </div>

      <p className="mt-4 text-sm text-slate-400">
        Usa el panel lateral para mover y escalar el diseño dentro del área imprimible.
      </p>
    </div>
  );
}
