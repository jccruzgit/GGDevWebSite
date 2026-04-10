import { useMemo, useState } from "react";
import CTAButton from "@/components/ui/CTAButton";
import InlineNotice from "@/components/ui/InlineNotice";
import SectionHeading from "@/components/ui/SectionHeading";
import WhatsAppActionButton from "@/components/ui/WhatsAppActionButton";
import WhatsAppResponseNote from "@/components/ui/WhatsAppResponseNote";
import ResponsePromise from "@/components/advisory/ResponsePromise";
import { buildAdvisoryMessage, openWhatsApp } from "@/utils/whatsapp";

function getInputClassName(hasError) {
  return `w-full rounded-[24px] border px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none ${
    hasError
      ? "border-rose-400/35 bg-rose-500/10 focus:border-rose-300/60"
      : "border-white/10 bg-white/5 focus:border-aqua/30"
  }`;
}

function formatMissingFields(fields) {
  if (fields.length <= 1) {
    return fields[0] || "";
  }

  if (fields.length === 2) {
    return `${fields[0]} y ${fields[1]}`;
  }

  return `${fields.slice(0, -1).join(", ")} y ${fields.at(-1)}`;
}

export default function AdvisoryPage() {
  const [form, setForm] = useState({
    name: "",
    subject: "",
    message: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    subject: false,
    message: false,
  });

  const formErrors = useMemo(
    () => ({
      name: form.name.trim() ? "" : "Escribe tu nombre para iniciar la conversacion.",
      subject: form.subject.trim() ? "" : "Define el asunto principal de tu consulta.",
      message: form.message.trim() ? "" : "Describe la duda o problema que quieres resolver.",
    }),
    [form]
  );

  const isFormValid = !Object.values(formErrors).some(Boolean);
  const missingFields = [];

  if (formErrors.name) {
    missingFields.push("tu nombre");
  }

  if (formErrors.subject) {
    missingFields.push("el asunto");
  }

  if (formErrors.message) {
    missingFields.push("el mensaje");
  }

  const helperMessage = isFormValid
    ? "Tu consulta llegará ordenada para que podamos responderte con contexto desde el primer mensaje."
    : `Completa ${formatMissingFields(missingFields)} para abrir WhatsApp con tu solicitud de asesoría.`;

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleBlur = (field) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const handleOpenWhatsApp = () => {
    if (!isFormValid) {
      setTouched({
        name: true,
        subject: true,
        message: true,
      });
      return;
    }

    openWhatsApp(buildAdvisoryMessage(form));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleOpenWhatsApp();
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
              className={`h-12 ${getInputClassName(touched.name && Boolean(formErrors.name))}`}
              id="name"
              onBlur={handleBlur("name")}
              onChange={handleChange("name")}
              placeholder="Tu nombre"
              value={form.name}
            />
            {touched.name && formErrors.name ? (
              <InlineNotice className="mt-3" tone="error">
                {formErrors.name}
              </InlineNotice>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white" htmlFor="subject">
              Asunto
            </label>
            <input
              className={`h-12 ${getInputClassName(touched.subject && Boolean(formErrors.subject))}`}
              id="subject"
              onBlur={handleBlur("subject")}
              onChange={handleChange("subject")}
              placeholder="Ej. Quiero revisar la calidad de mi imagen"
              value={form.subject}
            />
            {touched.subject && formErrors.subject ? (
              <InlineNotice className="mt-3" tone="error">
                {formErrors.subject}
              </InlineNotice>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white" htmlFor="message">
              Mensaje
            </label>
            <textarea
              className={`min-h-40 py-3 ${getInputClassName(
                touched.message && Boolean(formErrors.message)
              )}`}
              id="message"
              onBlur={handleBlur("message")}
              onChange={handleChange("message")}
              placeholder="Cuéntanos qué quieres imprimir o qué duda necesitas resolver."
              value={form.message}
            />
            {touched.message && formErrors.message ? (
              <InlineNotice className="mt-3" tone="error">
                {formErrors.message}
              </InlineNotice>
            ) : null}
          </div>

          <div className="space-y-4">
            <CTAButton className="w-full" disabled={!isFormValid} type="submit">
              Enviar consulta por WhatsApp
            </CTAButton>
            <InlineNotice tone={isFormValid ? "info" : "error"}>{helperMessage}</InlineNotice>
            <WhatsAppResponseNote className="text-center sm:text-left" />
          </div>
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

          <div className="space-y-4">
            <WhatsAppActionButton
              className="w-full"
              disabled={!isFormValid}
              onClick={handleOpenWhatsApp}
              variant="secondary"
            >
              Abrir WhatsApp ahora
            </WhatsAppActionButton>
            <WhatsAppResponseNote className="text-center sm:text-left" />
          </div>
        </div>
      </section>
    </div>
  );
}
