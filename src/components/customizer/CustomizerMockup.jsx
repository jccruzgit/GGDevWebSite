import { getPhotoMockup } from "@/config/customizerMockups";

function ArtworkPreview({ image, alt, emptyLabel, offsetX, offsetY, scale }) {
  return image ? (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{
        transform: `translate(${offsetX}%, ${offsetY}%)`,
      }}
    >
      <img
        alt={alt}
        className="max-h-full max-w-full object-contain"
        src={image}
        style={{
          transform: `scale(${scale})`,
        }}
      />
    </div>
  ) : (
    <span className="flex h-full items-center justify-center text-center text-xs uppercase tracking-[0.18em] text-slate-400">
      {emptyLabel}
    </span>
  );
}

function PhotoMockupView({ image, mockup, offsetX, offsetY, scale }) {
  const printAreaStyle = {
    left: `${(mockup.printArea.x / mockup.width) * 100}%`,
    top: `${(mockup.printArea.y / mockup.height) * 100}%`,
    width: `${(mockup.printArea.width / mockup.width) * 100}%`,
    height: `${(mockup.printArea.height / mockup.height) * 100}%`,
  };
  const printAreaClassName = image
    ? "absolute z-10 overflow-hidden rounded-[18px] border border-transparent"
    : "absolute z-10 overflow-hidden rounded-[18px] border border-dashed border-white/15 bg-black/[0.08] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]";

  return (
    <div className="relative flex h-full w-full items-center justify-center p-6 sm:p-8">
      <div className="relative w-full max-w-[420px]">
        <div
          className="relative origin-center"
          style={{
            transform: `translateY(${mockup.frameOffsetY || 0}px) scale(${mockup.frameScale || 1})`,
          }}
        >
          <img alt={mockup.alt} className="h-auto w-full" src={mockup.src} />
          <div
            className={printAreaClassName}
            style={printAreaStyle}
          >
            <ArtworkPreview
              alt={mockup.imageAlt}
              emptyLabel={mockup.emptyLabel}
              image={image}
              offsetX={offsetX}
              offsetY={offsetY}
              scale={scale}
            />
          </div>
          {mockup.overlaySrc ? (
            <img
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 h-full w-full"
              src={mockup.overlaySrc}
              style={{
                mixBlendMode: mockup.overlayBlendMode || "normal",
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FallbackMockup({ garmentColor, image, offsetX, offsetY, placement, scale }) {
  const activePrintAreaClassName =
    "border-transparent bg-white/[0.01]";
  const emptyPrintAreaClassName =
    "border-white/15 bg-black/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]";

  return (
    <div className="relative flex h-full w-full items-center justify-center p-6 sm:p-8">
      <div className="relative h-[420px] w-full max-w-[360px]">
        <div
          className="absolute left-1/2 top-[56px] h-[320px] w-[240px] -translate-x-1/2 rounded-[42px] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_30px_60px_rgba(0,0,0,0.35)]"
          style={{ backgroundColor: garmentColor }}
        />
        <div
          className="absolute left-1/2 top-[18px] h-20 w-28 -translate-x-1/2 rounded-b-[48px] border border-white/10"
          style={{ backgroundColor: garmentColor }}
        />
        <div
          className="absolute left-[30px] top-[82px] h-[120px] w-[96px] rounded-[34px] border border-white/10"
          style={{ backgroundColor: garmentColor, transform: "rotate(18deg)" }}
        />
        <div
          className="absolute right-[30px] top-[82px] h-[120px] w-[96px] rounded-[34px] border border-white/10"
          style={{ backgroundColor: garmentColor, transform: "rotate(-18deg)" }}
        />
        <div
          className={`absolute left-1/2 top-[138px] flex min-h-[160px] w-[180px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-[30px] border border-dashed ${
            placement === "frente" && image ? activePrintAreaClassName : emptyPrintAreaClassName
          } p-4`}
        >
          {placement === "frente" ? (
            <ArtworkPreview
              alt="Diseño cargado"
              emptyLabel="Frente listo para arte"
              image={image}
              offsetX={offsetX}
              offsetY={offsetY}
              scale={scale}
            />
          ) : (
            <span className="text-center text-xs uppercase tracking-[0.18em] text-slate-400">
              Frente listo para arte
            </span>
          )}
        </div>
        <div
          className={`absolute left-1/2 top-[138px] flex min-h-[160px] w-[180px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-[30px] border border-dashed ${
            placement === "espalda" && image ? activePrintAreaClassName : emptyPrintAreaClassName
          } p-4`}
        >
          {placement === "espalda" ? (
            <ArtworkPreview
              alt="Diseño cargado en la espalda"
              emptyLabel="Espalda lista para arte"
              image={image}
              offsetX={offsetX}
              offsetY={offsetY}
              scale={scale}
            />
          ) : (
            <span className="text-center text-xs uppercase tracking-[0.18em] text-slate-400">
              Espalda lista para arte
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomizerMockup({
  image,
  placement,
  garmentColor,
  offsetX,
  offsetY,
  scale,
  fileName,
}) {
  const photoMockup = getPhotoMockup(garmentColor, placement);

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
        {photoMockup ? (
          <PhotoMockupView
            image={image}
            mockup={photoMockup}
            offsetX={offsetX}
            offsetY={offsetY}
            scale={scale}
          />
        ) : (
          <FallbackMockup
            garmentColor={garmentColor}
            image={image}
            offsetX={offsetX}
            offsetY={offsetY}
            placement={placement}
            scale={scale}
          />
        )}
      </div>

      <p className="mt-4 text-sm text-slate-400">
        Usa el panel lateral para mover y escalar el diseño dentro del área imprimible.
      </p>
    </div>
  );
}
