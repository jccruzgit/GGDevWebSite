import { useState } from "react";
import { MessageCircle } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import SectionHeading from "@/components/ui/SectionHeading";
import ResponsePromise from "@/components/advisory/ResponsePromise";
import { buildAdvisoryMessage, buildWhatsAppUrl } from "@/utils/whatsapp";

export default function AdvisoryPage() {
  const [form, setForm] = useState({
    name: "",
    subject: "",
    message: "",
  });

  const advisoryUrl = buildWhatsAppUrl(buildAdvisoryMessage(form));

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    window.open(advisoryUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="shell pt-10">
      <section className="panel surface-grid p-8 sm:p-10">
        <SectionHeading
          description="Te ayudamos a validar resolución, ubicación del arte, adaptación para impresión y claridad visual antes de producir."
          eyebrow="Asesoría GGDev"
          title="No dejes tu diseño al azar si quieres que la camiseta realmente se vea premium"
        />
      </section>

      <section className="mt-10">
        <ResponsePromise />
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <form className="panel space-y-6 p-8" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-white">Cuéntanos qué necesitas</h2>
          <p className="text-sm leading-7 text-slate-300">
            Te orientamos con resolución de imagen, ubicación del diseño, adaptación para
            impresión y revisión de calidad.
          </p>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white" htmlFor="name">
              Nombre
            </label>
            <input
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-slate-500 focus:border-aqua/30 focus:outline-none"
              id="name"
              onChange={handleChange("name")}
              placeholder="Tu nombre"
              value={form.name}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white" htmlFor="subject">
              Asunto
            </label>
            <input
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-slate-500 focus:border-aqua/30 focus:outline-none"
              id="subject"
              onChange={handleChange("subject")}
              placeholder="Ej. Quiero revisar la calidad de mi imagen"
              value={form.subject}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white" htmlFor="message">
              Mensaje
            </label>
            <textarea
              className="min-h-40 w-full rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aqua/30 focus:outline-none"
              id="message"
              onChange={handleChange("message")}
              placeholder="Cuéntanos qué quieres imprimir o qué duda necesitas resolver."
              value={form.message}
            />
          </div>

          <button
            className="button-glow inline-flex w-full items-center justify-center rounded-full bg-brand-gradient px-5 py-3 text-sm font-semibold text-slate-950"
            type="submit"
          >
            Enviar consulta
          </button>
        </form>

        <div className="space-y-6">
          <div className="panel p-8">
            <p className="eyebrow">Confianza GGDev</p>
            <h2 className="mt-5 text-3xl font-bold text-white">Respuesta clara y acompañamiento real</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Nuestro flujo final siempre termina en conversación directa contigo para confirmar
              detalles, resolver dudas y aterrizar el diseño con criterio visual.
            </p>
            <div className="mt-6 rounded-[24px] border border-aqua/15 bg-aqua/8 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Tiempo estimado de respuesta
              </p>
              <p className="mt-3 text-3xl font-bold text-white">Menos de 24 horas</p>
              <p className="mt-2 text-sm text-slate-300">
                Ideal para pedidos, ajustes rápidos y consultas sobre calidad de archivo.
              </p>
            </div>
          </div>

          <CTAButton href={advisoryUrl} rel="noreferrer" target="_blank" variant="secondary">
            <MessageCircle className="h-4 w-4" />
            Abrir WhatsApp ahora
          </CTAButton>
        </div>
      </section>
    </div>
  );
}
