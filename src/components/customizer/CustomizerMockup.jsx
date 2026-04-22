const mockupBasePath = `${import.meta.env.BASE_URL}mockups/tshirtmockup`;

const photoMockups = {
  frente: {
    src: `${mockupBasePath}/front-base.png`,
    width: 1600,
    height: 2000,
    alt: "Mockup frontal de camiseta",
    frameScale: 1,
    frameOffsetY: 0,
    printArea: {
      x: 463,
      y: 529,
      width: 586,
      height: 871,
    },
    emptyLabel: "Frente listo para arte",
    imageAlt: "Diseno cargado",
  },
  espalda: {
    src: `${mockupBasePath}/back-base.png`,
    width: 1600,
    height: 2000,
    alt: "Mockup trasero de camiseta",
    frameScale: 1.08,
    frameOffsetY: -8,
    printArea: {
      x: 581,
      y: 565,
      width: 479,
      height: 702,
    },
    emptyLabel: "Espalda lista para arte",
    imageAlt: "Diseno cargado en la espalda",
  },
};

function PhotoMockupView({ image, mockup, opacity, scale }) {
  const printAreaStyle = {
    left: `${(mockup.printArea.x / mockup.width) * 100}%`,
    top: `${(mockup.printArea.y / mockup.height) * 100}%`,
    width: `${(mockup.printArea.width / mockup.width) * 100}%`,
    height: `${(mockup.printArea.height / mockup.height) * 100}%`,
  };

  return (
    <div className="relative mx-auto w-full max-w-[420px] overflow-hidden">
      <div
        className="relative origin-center"
        style={{
          transform: `translateY(${mockup.frameOffsetY || 0}px) scale(${mockup.frameScale || 1})`,
        }}
      >
        <img alt={mockup.alt} className="h-auto w-full" src={mockup.src} />
        <div
          className="absolute rounded-[18px] border border-dashed border-aqua/35 bg-white/[0.03] p-4"
          style={printAreaStyle}
        >
          {image ? (
            <img
              alt={mockup.imageAlt}
              className="h-full w-full object-contain"
              src={image}
              style={{
                opacity,
                transform: `scale(${scale})`,
              }}
            />
          ) : (
            <span className="flex h-full items-center justify-center text-center text-xs uppercase tracking-[0.18em] text-slate-400">
              {mockup.emptyLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function FallbackMockup({ garmentColor, image, opacity, placement, scale }) {
  return (
    <div className="relative mx-auto h-[520px] w-full max-w-[380px]">
      <div
        className="absolute left-1/2 top-[56px] h-[420px] w-[280px] -translate-x-1/2 rounded-[42px] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_30px_60px_rgba(0,0,0,0.35)]"
        style={{ backgroundColor: garmentColor }}
      />
      <div
        className="absolute left-1/2 top-[18px] h-24 w-32 -translate-x-1/2 rounded-b-[48px] border border-white/10"
        style={{ backgroundColor: garmentColor }}
      />
      <div
        className="absolute left-[18px] top-[82px] h-[148px] w-[110px] rounded-[34px] border border-white/10"
        style={{ backgroundColor: garmentColor, transform: "rotate(18deg)" }}
      />
      <div
        className="absolute right-[18px] top-[82px] h-[148px] w-[110px] rounded-[34px] border border-white/10"
        style={{ backgroundColor: garmentColor, transform: "rotate(-18deg)" }}
      />
      <div
        className={`absolute left-1/2 top-[160px] flex min-h-[180px] w-[190px] -translate-x-1/2 items-center justify-center rounded-[30px] border border-dashed ${
          placement === "frente" ? "border-aqua/35" : "border-white/15"
        } bg-white/[0.03] p-4`}
      >
        {placement === "frente" && image ? (
          <img
            alt="Diseno cargado"
            className="max-h-full max-w-full object-contain"
            src={image}
            style={{
              opacity,
              transform: `scale(${scale})`,
            }}
          />
        ) : (
          <span className="text-center text-xs uppercase tracking-[0.18em] text-slate-400">
            Frente listo para arte
          </span>
        )}
      </div>
      <div
        className={`absolute left-1/2 top-[165px] flex min-h-[170px] w-[165px] -translate-x-1/2 items-center justify-center rounded-[30px] border border-dashed ${
          placement === "espalda" ? "border-aqua/35" : "border-white/15"
        } bg-white/[0.03] p-4`}
      >
        {placement === "espalda" && image ? (
          <img
            alt="Diseno cargado en la espalda"
            className="max-h-full max-w-full object-contain"
            src={image}
            style={{
              opacity,
              transform: `scale(${scale})`,
            }}
          />
        ) : (
          <span className="text-center text-xs uppercase tracking-[0.18em] text-slate-400">
            Espalda lista para arte
          </span>
        )}
      </div>
    </div>
  );
}

export default function CustomizerMockup({
  image,
  placement,
  garmentColor,
  scale,
  opacity,
  fileName,
}) {
  const photoMockup = garmentColor === "#F5F7FA" ? photoMockups[placement] : null;

  return (
    <div className="panel surface-grid relative overflow-hidden p-6 sm:p-10">
      <div className="absolute inset-x-10 top-8 h-32 rounded-full bg-aqua/10 blur-3xl" />
      <div className="relative mx-auto max-w-[420px]">
        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
          Vista activa: {placement}
        </div>

        {photoMockup ? (
          <PhotoMockupView image={image} mockup={photoMockup} opacity={opacity} scale={scale} />
        ) : (
          <FallbackMockup
            garmentColor={garmentColor}
            image={image}
            opacity={opacity}
            placement={placement}
            scale={scale}
          />
        )}

        <p className="mt-4 text-center text-sm text-slate-400">
          {fileName
            ? `Archivo cargado: ${fileName}`
            : "Sube una imagen y mira una previsualizacion rapida sobre la prenda."}
        </p>
      </div>
    </div>
  );
}
