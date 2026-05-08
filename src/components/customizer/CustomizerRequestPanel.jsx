import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import InlineNotice from "@/components/ui/InlineNotice";
import QuantitySelector from "@/components/ui/QuantitySelector";
import SizeSelector from "@/components/ui/SizeSelector";
import WhatsAppActionButton from "@/components/ui/WhatsAppActionButton";
import WhatsAppResponseNote from "@/components/ui/WhatsAppResponseNote";
import { createPublicRequest } from "@/services/requestService";
import { downloadCustomizerPreview } from "@/utils/customizerPreview";
import {
  buildCustomizerOrderMessage,
  buildSupportMessage,
  openWhatsApp,
} from "@/utils/whatsapp";

const shirtSizes = ["XS", "S", "M", "L", "XL", "2XL"];

function getInputClassName(hasError) {
  return `h-12 w-full rounded-[24px] border px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none ${
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

export default function CustomizerRequestPanel({
  file,
  fileName,
  garmentColor,
  garmentOptions,
  image,
  offsetX,
  offsetY,
  placement,
  scale,
}) {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    size: "",
    quantity: 1,
    comments: "",
  });
  const [touched, setTouched] = useState({
    customerName: false,
    phone: false,
    size: false,
  });
  const [pendingAction, setPendingAction] = useState("");
  const [feedback, setFeedback] = useState({
    message: "",
    tone: "info",
  });
  const [downloadState, setDownloadState] = useState({
    message: "",
    tone: "info",
  });
  const [isDownloading, setIsDownloading] = useState(false);

  const selectedGarment = useMemo(
    () => garmentOptions.find((option) => option.hex === garmentColor) || garmentOptions[0],
    [garmentColor, garmentOptions]
  );

  const formErrors = useMemo(
    () => ({
      customerName: form.customerName.trim()
        ? ""
        : "Escribe tu nombre para que podamos identificar el pedido.",
      phone: form.phone.trim() ? "" : "Agrega tu telefono o WhatsApp para devolverte la respuesta.",
      size: form.size ? "" : "Selecciona una talla antes de enviar la solicitud.",
      quantity:
        Number.isInteger(form.quantity) && form.quantity > 0
          ? ""
          : "La cantidad minima para solicitar es 1.",
    }),
    [form]
  );

  const isOrderReady = !Object.values(formErrors).some(Boolean);
  const missingFields = [];

  if (formErrors.customerName) {
    missingFields.push("tu nombre");
  }

  if (formErrors.phone) {
    missingFields.push("tu telefono");
  }

  if (formErrors.size) {
    missingFields.push("la talla");
  }

  if (formErrors.quantity) {
    missingFields.push("una cantidad valida");
  }

  const helperMessage = isOrderReady
    ? "Tu solicitud saldra con contacto, talla, color, cantidad y configuracion del preview para cerrar el pedido mas rapido."
    : `Completa ${formatMissingFields(missingFields)} para habilitar la solicitud por WhatsApp.`;

  const handleFieldChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleFieldBlur = (field) => () => {
    setTouched((current) => ({
      ...current,
      [field]: true,
    }));
  };

  const handleSizeChange = (size) => {
    setForm((current) => ({
      ...current,
      size,
    }));
    setTouched((current) => ({
      ...current,
      size: true,
    }));
  };

  const handleQuantityChange = (quantity) => {
    setForm((current) => ({
      ...current,
      quantity: Math.max(1, Number.parseInt(quantity, 10) || 1),
    }));
  };

  const markAllTouched = () => {
    setTouched({
      customerName: true,
      phone: true,
      size: true,
    });
  };

  const saveRequest = async ({ action }) => {
    const hasReference = Boolean(fileName);

    try {
      const savedRequest = await createPublicRequest({
        designFile: file,
        request: {
          customerName: form.customerName,
          customerPhone: form.phone,
          designFileName: fileName,
          garmentColor: selectedGarment.name,
          metadata: {
            hasReference,
            source: "customizer-order-panel",
          },
          notes: form.comments,
          placement,
          previewOffsetX: offsetX,
          previewOffsetY: offsetY,
          previewScale: Math.round(scale * 100),
          quantity: form.quantity,
          requestType: "customizer",
          size: form.size,
          subject:
            action === "order"
              ? "Solicitud de camiseta personalizada"
              : "Ayuda para personalizar camiseta",
        },
      });

      if (savedRequest) {
        setFeedback({
          message:
            "Guardamos tu solicitud en el panel para darle seguimiento antes de cerrar la produccion.",
          tone: "info",
        });
      }
    } catch (error) {
      setFeedback({
        message:
          error.message ||
          "No se pudo guardar la solicitud en el panel, pero abriremos WhatsApp para continuar.",
        tone: "error",
      });
    }
  };

  const handleOpenWhatsApp = async () => {
    if (!isOrderReady) {
      markAllTouched();
      return;
    }

    setPendingAction("order");
    setFeedback({
      message: "",
      tone: "info",
    });

    try {
      await saveRequest({ action: "order" });
    } finally {
      setPendingAction("");
      openWhatsApp(
        buildCustomizerOrderMessage({
          customerName: form.customerName,
          phone: form.phone,
          size: form.size,
          color: selectedGarment.name,
          quantity: form.quantity,
          comments: form.comments,
          placement,
          fileName,
          scale,
          offsetX,
          offsetY,
        })
      );
    }
  };

  const handleHelpClick = async () => {
    setPendingAction("help");
    setFeedback({
      message: "",
      tone: "info",
    });

    try {
      await saveRequest({ action: "help" });
    } finally {
      setPendingAction("");
      openWhatsApp(
        buildSupportMessage({
          intro: "Hola, necesito ayuda para aterrizar una camiseta personalizada de GGDev.",
          details: [
            `Nombre: ${form.customerName.trim() || "Aun no lo he definido"}`,
            `Telefono o WhatsApp: ${form.phone.trim() || "Aun no lo he compartido"}`,
            `Talla: ${form.size || "Por definir"}`,
            `Color de camiseta: ${selectedGarment.name}`,
            `Cantidad: ${form.quantity}`,
            `Lado del diseno: ${placement}`,
            `Archivo cargado: ${fileName || "Aun no he subido una imagen"}`,
            `Tamano aproximado en vista previa: ${Math.round(scale * 100)}%`,
            `Posicion horizontal en vista previa: ${offsetX}%`,
            `Posicion vertical en vista previa: ${offsetY}%`,
            `Comentarios: ${form.comments.trim() || "Necesito ayuda para definir mejor la idea."}`,
          ],
          closing:
            "Quiero validar si mi diseno esta listo para producir y como concretar el pedido.",
        })
      );
    }
  };

  const handleDownloadClick = async () => {
    if (!image) {
      setDownloadState({
        message: "Carga una imagen para generar una vista previa descargable.",
        tone: "error",
      });
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadState({
        message: "Generando tu vista previa...",
        tone: "info",
      });

      const downloadName = await downloadCustomizerPreview({
        fileName,
        garmentColor,
        image,
        offsetX,
        offsetY,
        placement,
        scale,
      });

      setDownloadState({
        message: `Vista previa descargada: ${downloadName}`,
        tone: "info",
      });
    } catch (error) {
      setDownloadState({
        message: "No pudimos generar la imagen. Intenta de nuevo con el mismo diseno.",
        tone: "error",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    void handleOpenWhatsApp();
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-6">
      <form className="panel-soft space-y-6 p-5 sm:p-6" onSubmit={handleSubmit}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-aqua">
            Solicitud real
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Convierte tu preview en pedido</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Completa tus datos, revisa talla y color, y envia por WhatsApp una solicitud lista para
            seguimiento comercial.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              className="mb-2 block text-sm font-semibold text-white"
              htmlFor="customizer-customer-name"
            >
              Nombre del cliente
            </label>
            <input
              autoComplete="name"
              className={getInputClassName(
                touched.customerName && Boolean(formErrors.customerName)
              )}
              id="customizer-customer-name"
              onBlur={handleFieldBlur("customerName")}
              onChange={handleFieldChange("customerName")}
              placeholder="Tu nombre"
              type="text"
              value={form.customerName}
            />
            {touched.customerName && formErrors.customerName ? (
              <InlineNotice className="mt-3" tone="error">
                {formErrors.customerName}
              </InlineNotice>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white" htmlFor="customizer-phone">
              Telefono o WhatsApp
            </label>
            <input
              autoComplete="tel"
              className={getInputClassName(touched.phone && Boolean(formErrors.phone))}
              id="customizer-phone"
              onBlur={handleFieldBlur("phone")}
              onChange={handleFieldChange("phone")}
              placeholder="Tu numero de contacto"
              type="tel"
              value={form.phone}
            />
            {touched.phone && formErrors.phone ? (
              <InlineNotice className="mt-3" tone="error">
                {formErrors.phone}
              </InlineNotice>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <div>
            <SizeSelector onChange={handleSizeChange} selectedSize={form.size} sizes={shirtSizes} />
            {touched.size && formErrors.size ? (
              <InlineNotice className="mt-3" tone="error">
                {formErrors.size}
              </InlineNotice>
            ) : null}
          </div>
          <div>
            <QuantitySelector onChange={handleQuantityChange} quantity={form.quantity} />
            {formErrors.quantity ? (
              <InlineNotice className="mt-3" tone="error">
                {formErrors.quantity}
              </InlineNotice>
            ) : null}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
          <p className="text-sm font-semibold text-white">Color de camiseta</p>
          <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-aqua/20 bg-aqua/10 px-4 py-2 text-sm text-white">
            <span
              className="h-4 w-4 rounded-full border border-white/15"
              style={{ backgroundColor: garmentColor }}
            />
            {selectedGarment.name}
          </div>
          <p className="mt-3 text-xs leading-6 text-slate-400">
            Puedes cambiar este color arriba, en el selector del preview.
          </p>
        </div>

        <div>
          <label className="mb-3 block text-sm font-semibold text-white" htmlFor="customizer-comments">
            Comentarios adicionales
          </label>
          <textarea
            className="min-h-40 w-full rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aqua/30 focus:outline-none"
            id="customizer-comments"
            onChange={handleFieldChange("comments")}
            placeholder="Describe referencias, texto, ubicacion deseada o cualquier detalle importante para producir tu idea."
            value={form.comments}
          />
        </div>

        <div className="space-y-4">
          <WhatsAppActionButton
            className="w-full"
            disabled={pendingAction === "help"}
            type="submit"
          >
            {pendingAction === "order" ? "Guardando solicitud..." : "Solicitar por WhatsApp"}
          </WhatsAppActionButton>
          <InlineNotice tone={isOrderReady ? "info" : "error"}>{helperMessage}</InlineNotice>
          {feedback.message ? <InlineNotice tone={feedback.tone}>{feedback.message}</InlineNotice> : null}
        </div>
      </form>

      <div className="panel-soft flex flex-col justify-between p-5 sm:p-6">
        <div>
          <p className="text-sm font-semibold text-white">Resumen listo para enviar</p>
          <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Archivo</p>
              <p className="mt-2 font-medium text-white">{fileName || "Sin archivo cargado"}</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Vista activa</p>
              <p className="mt-2 font-medium capitalize text-white">{placement}</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Color</p>
              <p className="mt-2 font-medium text-white">{selectedGarment.name}</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Escala y posicion</p>
              <p className="mt-2 font-medium text-white">{Math.round(scale * 100)}% de escala</p>
              <p className="mt-1 text-slate-400">
                X: {offsetX}% | Y: {offsetY}%
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <CTAButton
            className="w-full"
            disabled={!image || isDownloading || Boolean(pendingAction)}
            onClick={handleDownloadClick}
            variant="secondary"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Generando vista previa" : "Descargar vista previa"}
          </CTAButton>
          <WhatsAppActionButton
            className="w-full"
            disabled={Boolean(pendingAction)}
            onClick={() => void handleHelpClick()}
            variant="secondary"
          >
            {pendingAction === "help"
              ? "Guardando solicitud..."
              : "Solicitar ayuda para personalizar"}
          </WhatsAppActionButton>
          <InlineNotice tone={downloadState.tone}>
            {downloadState.message ||
              "Descarga la imagen del preview y adjuntala en el chat para que GGDev vea exactamente la propuesta."}
          </InlineNotice>
          <WhatsAppResponseNote className="text-center sm:text-left" />
        </div>
      </div>
    </div>
  );
}
