import { useMemo, useState } from "react";
import CustomizerControls from "@/components/customizer/CustomizerControls";
import CustomizerMockup from "@/components/customizer/CustomizerMockup";
import ColorSelector from "@/components/ui/ColorSelector";
import InlineNotice from "@/components/ui/InlineNotice";
import SectionHeading from "@/components/ui/SectionHeading";
import UploadBox from "@/components/ui/UploadBox";
import WhatsAppActionButton from "@/components/ui/WhatsAppActionButton";
import WhatsAppResponseNote from "@/components/ui/WhatsAppResponseNote";
import { useCustomizer } from "@/context/CustomizerContext";
import { createPublicRequest } from "@/services/requestService";
import {
  buildCustomizerMessage,
  buildSupportMessage,
  openWhatsApp,
} from "@/utils/whatsapp";

const garmentOptions = [
  { name: "Negro", hex: "#111827" },
  { name: "Blanco", hex: "#F5F7FA" },
  { name: "Azul", hex: "#13213B" },
];

export default function CustomizerPage() {
  const {
    placement,
    garmentColor,
    scale,
    offsetX,
    offsetY,
    file,
    fileName,
    image,
    setPlacement,
    setGarmentColor,
    setOffsetX,
    setOffsetY,
    setOffsets,
    zoomIn,
    zoomOut,
    centerImage,
    resetCustomizer,
    setImageFromFile,
  } = useCustomizer();
  const [notes, setNotes] = useState("");
  const [pendingAction, setPendingAction] = useState("");
  const [requestFeedback, setRequestFeedback] = useState({
    message: "",
    tone: "info",
  });

  const selectedGarment = useMemo(
    () => garmentOptions.find((item) => item.hex === garmentColor) || garmentOptions[0],
    [garmentColor]
  );

  const hasReference = Boolean(fileName);
  const hasNotes = Boolean(notes.trim());
  const helperMessage =
    hasReference || hasNotes
      ? "Tu mensaje saldrá con color, lado del diseño, archivo cargado, posición y notas para agilizar la conversación."
      : "Puedes seguir sin archivo. Te ayudaremos por WhatsApp a definir tamaño, ubicación y viabilidad del diseño.";

  const handleRequestAction = async ({ action, requestType, whatsappMessage }) => {
    setPendingAction(action);
    setRequestFeedback({
      message: "",
      tone: "info",
    });

    try {
      const savedRequest = await createPublicRequest({
        designFile: file,
        request: {
          designFileName: fileName,
          garmentColor: selectedGarment.name,
          metadata: {
            hasReference,
            source: "customizer-page",
          },
          notes,
          placement,
          previewOffsetX: offsetX,
          previewOffsetY: offsetY,
          previewScale: Math.round(scale * 100),
          requestType,
          subject:
            action === "order"
              ? "Solicitud de camiseta personalizada"
              : "Ayuda para personalizar camiseta",
        },
      });

      if (savedRequest) {
        setRequestFeedback({
          message:
            "Guardamos tu solicitud en el panel para darle seguimiento antes de cerrar la producción.",
          tone: "info",
        });
      }
    } catch (error) {
      setRequestFeedback({
        message:
          error.message ||
          "No se pudo guardar la solicitud en el panel, pero abriremos WhatsApp para continuar el pedido.",
        tone: "error",
      });
    } finally {
      setPendingAction("");
      openWhatsApp(whatsappMessage);
    }
  };

  const handleOrderClick = () => {
    void handleRequestAction({
      action: "order",
      requestType: "customizer",
      whatsappMessage: buildCustomizerMessage({
        placement,
        garmentColor: selectedGarment.name,
        fileName,
        scale,
        offsetX,
        offsetY,
        notes,
      }),
    });
  };

  const handleHelpClick = () => {
    void handleRequestAction({
      action: "help",
      requestType: "customizer",
      whatsappMessage: buildSupportMessage({
        intro: "Hola, necesito ayuda para personalizar una camiseta de GGDev.",
        details: [
          "Tipo de solicitud: Diseño personalizado",
          `Color de prenda: ${selectedGarment.name}`,
          `Lado del diseño: ${placement}`,
          `Archivo cargado: ${fileName || "Aún no he subido una imagen"}`,
          `Tamaño aproximado en vista previa: ${Math.round(scale * 100)}%`,
          `Posición horizontal en vista previa: ${offsetX}%`,
          `Posición vertical en vista previa: ${offsetY}%`,
          `Notas: ${notes.trim() || "Necesito ayuda para organizar mi idea."}`,
        ],
        closing:
          "Necesito ayuda para confirmar tamaño, calidad del archivo y viabilidad del diseño.",
      }),
    });
  };

  return (
    <div className="shell pt-10">
      <section className="panel surface-grid p-8 sm:p-10">
        <SectionHeading
          description="Sube tu imagen, ajusta tamaño y posición sobre la prenda, y envía tu idea para validar producción antes de fabricarla."
          eyebrow="Personalizador MVP"
          title="Diseña tu camiseta en un espacio de trabajo más claro"
        />
      </section>

      <section className="mt-10 grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start">
        <div className="space-y-6">
          <UploadBox
            description="Carga tu archivo y previsualízalo sobre la camiseta. PNG y JPG funcionan mejor para esta etapa."
            fileName={fileName}
            onFileSelect={setImageFromFile}
            title="Sube tu diseño base"
          />

          <CustomizerControls
            offsetX={offsetX}
            offsetY={offsetY}
            onCenter={centerImage}
            onOffsetXChange={setOffsetX}
            onOffsetYChange={setOffsetY}
            onReset={resetCustomizer}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
          />
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)]">
            <div className="panel-soft p-5">
              <p className="text-sm font-semibold text-white">Vista del diseño</p>
              <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
                {["frente", "espalda"].map((side) => (
                  <button
                    key={side}
                    className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
                      placement === side
                        ? "bg-aqua/12 text-white"
                        : "text-slate-300 hover:text-white"
                    }`}
                    onClick={() => setPlacement(side)}
                    type="button"
                  >
                    {side}
                  </button>
                ))}
              </div>
            </div>

            <div className="panel-soft p-5">
              <ColorSelector
                colors={garmentOptions}
                label="Color de la prenda"
                onChange={(color) => setGarmentColor(color.hex)}
                selectedColor={garmentColor}
              />
            </div>
          </div>

          <CustomizerMockup
            fileName={fileName}
            garmentColor={garmentColor}
            image={image}
            offsetX={offsetX}
            offsetY={offsetY}
            onOffsetChange={setOffsets}
            placement={placement}
            scale={scale}
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="panel-soft p-6">
              <label className="mb-3 block text-sm font-semibold text-white" htmlFor="custom-notes">
                Detalles de tu idea
              </label>
              <textarea
                className="min-h-40 w-full rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aqua/30 focus:outline-none"
                id="custom-notes"
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Describe tamaño aproximado, referencia visual, texto o cualquier detalle importante."
                value={notes}
              />
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Si aún no estás seguro de la calidad del archivo, podemos revisarlo contigo antes de
                producir.
              </p>
            </div>

            <div className="panel-soft flex flex-col justify-between p-6">
              <div>
                <p className="text-sm font-semibold text-white">Siguiente paso</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Cuando el preview se acerque a tu idea, envía la solicitud y revisamos tamaño,
                  archivo y acabado final.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex flex-col gap-3">
                  <WhatsAppActionButton
                    className="w-full"
                    disabled={Boolean(pendingAction)}
                    onClick={handleOrderClick}
                  >
                    {pendingAction === "order"
                      ? "Guardando solicitud..."
                      : "Enviar solicitud por WhatsApp"}
                  </WhatsAppActionButton>
                  <WhatsAppActionButton
                    className="w-full"
                    disabled={Boolean(pendingAction)}
                    onClick={handleHelpClick}
                    variant="secondary"
                  >
                    {pendingAction === "help"
                      ? "Guardando solicitud..."
                      : "Solicitar ayuda para personalizar"}
                  </WhatsAppActionButton>
                </div>

                <InlineNotice>{helperMessage}</InlineNotice>
                {requestFeedback.message ? (
                  <InlineNotice tone={requestFeedback.tone}>{requestFeedback.message}</InlineNotice>
                ) : null}
                <WhatsAppResponseNote className="text-center sm:text-left" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
