export default function TrustSection({
  eyebrow,
  title,
  description,
  items,
  note,
  children,
  className = "",
}) {
  return (
    <section className={`panel surface-grid overflow-hidden p-8 sm:p-10 ${className}`}>
      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div>
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{title}</h2>
            {description ? <p className="mt-4 text-base leading-8 text-slate-300">{description}</p> : null}
          </div>

          {note ? (
            <div className="rounded-[28px] border border-aqua/15 bg-aqua/8 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Atención previa
              </p>
              <p className="mt-3 text-base leading-7 text-white">{note}</p>
            </div>
          ) : null}

          {children}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="panel-soft h-full p-5">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-slate-950">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
