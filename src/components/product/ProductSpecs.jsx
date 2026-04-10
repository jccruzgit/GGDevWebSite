const specs = [
  "Algodón premium de tacto suave",
  "Impresión DTF de alta definición",
  "Producción rápida y revisión visual",
];

export default function ProductSpecs() {
  return (
    <div className="panel-soft p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
        Especificaciones
      </p>
      <div className="mt-5 space-y-3">
        {specs.map((spec) => (
          <div
            key={spec}
            className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200"
          >
            {spec}
          </div>
        ))}
      </div>
    </div>
  );
}
