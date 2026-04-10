export default function CustomizerMockup({
  image,
  placement,
  garmentColor,
  scale,
  opacity,
  fileName,
}) {
  return (
    <div className="panel surface-grid relative overflow-hidden p-6 sm:p-10">
      <div className="absolute inset-x-10 top-8 h-32 rounded-full bg-aqua/10 blur-3xl" />
      <div className="relative mx-auto max-w-[420px]">
        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
          Vista activa: {placement}
        </div>
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
                alt="Diseño cargado"
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
                alt="Diseño cargado en la espalda"
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
        <p className="mt-4 text-center text-sm text-slate-400">
          {fileName
            ? `Archivo cargado: ${fileName}`
            : "Sube una imagen y mira una previsualización rápida sobre la prenda."}
        </p>
      </div>
    </div>
  );
}
