import CTAButton from "@/components/ui/CTAButton";
import WhatsAppCTA from "@/components/ui/WhatsAppCTA";

export default function CommercialCTA({
  eyebrow = "Listo para pedir",
  title,
  description,
  primaryLabel = "Explorar catálogo",
  primaryTo = "/catalogo",
  secondaryLabel = "Personalizar ahora",
  secondaryTo = "/personalizar",
  whatsappLabel = "Pedir por WhatsApp",
  className = "",
}) {
  return (
    <section className={`panel overflow-hidden p-8 sm:p-10 ${className}`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{title}</h2>
          <p className="mt-4 text-base leading-8 text-slate-300">{description}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-start lg:justify-end">
          <CTAButton to={primaryTo}>{primaryLabel}</CTAButton>
          <CTAButton to={secondaryTo} variant="secondary">
            {secondaryLabel}
          </CTAButton>
          <WhatsAppCTA variant="ghost">{whatsappLabel}</WhatsAppCTA>
        </div>
      </div>
    </section>
  );
}
