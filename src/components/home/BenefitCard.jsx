export default function BenefitCard({ benefit }) {
  const Icon = benefit.icon;

  return (
    <article className="panel-soft h-full p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-slate-950">
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-400">
          GGDev
        </span>
      </div>
      <h3 className="mt-6 text-xl font-semibold text-white">{benefit.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{benefit.description}</p>
    </article>
  );
}
