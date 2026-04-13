import SectionHeading from "@/components/ui/SectionHeading";

export default function ProcessSection({ steps }) {
  return (
    <section>
      <SectionHeading
        align="center"
        description="Un proceso simple para que una idea que nace en Instagram, TikTok o WhatsApp termine en un pedido bien confirmado."
        eyebrow="Cómo trabajamos tu pedido"
        title="Te guiamos desde la idea hasta la entrega"
      />

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <article key={step.id} className="panel-soft h-full p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-slate-950">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-4xl font-bold leading-none text-white/10">{step.id}</span>
              </div>
              <span className="mt-6 inline-flex rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-400">
                Paso {step.id}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
