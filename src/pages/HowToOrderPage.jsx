import CTAButton from "@/components/ui/CTAButton";
import SectionHeading from "@/components/ui/SectionHeading";
import { processSteps } from "@/data/processSteps";

export default function HowToOrderPage() {
  return (
    <div className="shell pt-10">
      <section className="panel surface-grid p-8 sm:p-10">
        <SectionHeading
          description="Un flujo simple de cinco pasos para que el pedido termine en conversación clara, validación visual y producción sin fricciones."
          eyebrow="Cómo pedir"
          title="Así conviertes una idea en una camiseta GGDev"
        />
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-5">
        {processSteps.map((step) => {
          const Icon = step.icon;
          return (
            <article key={step.id} className="panel-soft h-full p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-slate-950">
                <Icon className="h-5 w-5" />
              </div>
              <span className="mt-5 inline-flex rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-400">
                Paso {step.id}
              </span>
              <h2 className="mt-4 text-xl font-semibold text-white">{step.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-12">
        <div className="panel flex flex-col items-start gap-5 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">Siguiente paso</span>
            <h2 className="mt-4 text-3xl font-bold text-white">
              Ya sabes cómo funciona. Ahora toca elegir tu ruta.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              Si ya tienes una idea clara, entra al configurador. Si quieres inspiración, empieza
              por el catálogo.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <CTAButton to="/personalizar">Ir al configurador</CTAButton>
            <CTAButton to="/catalogo" variant="secondary">
              Ver catálogo
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}
