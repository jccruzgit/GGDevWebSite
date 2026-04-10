export default function InfoCard({ icon: Icon, title, description, className = "" }) {
  return (
    <article className={`panel-soft p-6 ${className}`}>
      {Icon ? (
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-slate-950">
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
    </article>
  );
}
