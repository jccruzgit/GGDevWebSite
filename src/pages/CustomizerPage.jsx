import { useMemo, useState } from "react";
import ColorSelector from "@/components/ui/ColorSelector";
import InlineNotice from "@/components/ui/InlineNotice";
import SectionHeading from "@/components/ui/SectionHeading";
import UploadBox from "@/components/ui/UploadBox";
import WhatsAppActionButton from "@/components/ui/WhatsAppActionButton";
import WhatsAppResponseNote from "@/components/ui/WhatsAppResponseNote";
import CustomizerControls from "@/components/customizer/CustomizerControls";
import CustomizerMockup from "@/components/customizer/CustomizerMockup";
import { useCustomizer } from "@/context/CustomizerContext";
import {
  buildCustomizerMessage,
  buildSupportMessage,
  openWhatsApp,
} from "@/utils/whatsapp";

const garmentOptions = [
  { name: "Negro eclipse", hex: "#111827" },
  { name: "Blanco polar", hex: "#F5F7FA" },
  { name: "Azul midnight", hex: "#13213B" },
  { name: "Grafito neon", hex: "#1E293B" },
];

export default function CustomizerPage() {
  const {
    placement,
    garmentColor,
    scale,
    opacity,
    fileName,
    image,
    setPlacement,
    setGarmentColor,
    setOpacity,
    zoomIn,
    zoomOut,
    centerImage,
    resetCustomizer,
    setImageFromFile,
  } = useCustomizer();
  const [notes, setNotes] = useState("");

  const selectedGarment = useMemo(
    () => garmentOptions.find((item) => item.hex === garmentColor) || garmentOptions[0],
    [garmentColor]
  );

  const hasReference = Boolean(fileName);
  const hasNotes = Boolean(notes.trim());
  const helperMessage =
    hasReference || hasNotes
      ? "Tu mensaje saldrá con color, lado del diseño, archivo cargado y notas para agilizar la conversación."
      : "Puedes seguir sin archivo. Te ayudaremos por WhatsApp a definir tamaño, calidad y ubicación del diseño.";

  const handleOrderClick = () => {
    openWhatsApp(
      buildCustomizerMessage({
        placement,
        garmentColor: selectedGarment.name,
        fileName,
        scale,
        opacity,
        notes,
      })
    );
  };

  const handleHelpClick = () => {
    openWhatsApp(
      buildSupportMessage({
        intro: "Hola, necesito ayuda para personalizar una camiseta de GGDev.",
        details: [
          "Tipo de solicitud: Diseño personalizado",
          `Color de prenda: ${selectedGarment.name}`,
          `Lado del diseño: ${placement}`,
          `Archivo cargado: ${fileName || "Aún no he subido una imagen"}`,
          `Tamaño aproximado en vista previa: ${Math.round(scale * 100)}%`,
          `Opacidad de vista previa: ${Math.round(opacity * 100)}%`,
          `Notas: ${notes.trim() || "Necesito ayuda para organizar mi idea."}`,
        ],
        closing: "Necesito ayuda para confirmar tamaño, calidad del archivo y viabilidad del diseño.",
      })
    );
  };

  return (
    <div className="shell pt-10">
      <section className="panel surface-grid p-8 sm:p-10">
        <SectionHeading
          description="Sube tu imagen, prueba una vista rápida y envía tu idea para que GGDev la refine contigo antes de producir."
          eyebrow="Personalizador MVP"
          title="Diseña tu camiseta con una base visual clara y rápida"
        />
      </section>

      <section className="mt-10 grid gap-8 xl:grid-cols-[0.95fr_1.05fr_0.9fr]">
        <div className="space-y-6">
          <UploadBox fileName={fileName} onFileSelect={setImageFromFile} />
          <div className="panel-soft p-6">
            <ColorSelector
              colors={garmentOptions}
              onChange={(color) => setGarmentColor(color.hex)}
              selectedColor={garmentColor}
            />
          </div>
        </div>

        <CustomizerMockup
          fileName={fileName}
          garmentColor={garmentColor}
          image={image}
          opacity={opacity}
          placement={placement}
          scale={scale}
        />

        <div className="space-y-6">
          <CustomizerControls
            onCenter={centerImage}
            onOpacityChange={setOpacity}
            onPlacementChange={setPlacement}
            onReset={resetCustomizer}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            opacity={opacity}
            placement={placement}
          />

          <div className="panel-soft p-6">
            <label className="mb-3 block text-sm font-semibold text-white" htmlFor="custom-notes">
              Detalles de tu idea
            </label>
            <textarea
              className="min-h-32 w-full rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aqua/30 focus:outline-none"
              id="custom-notes"
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Describe tamaño aproximado, referencia visual, texto o cualquier detalle importante."
              value={notes}
            />
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Si todavía no estás seguro de la calidad de tu imagen, GGDev te ayuda a preparar el
              archivo antes de producir.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <WhatsAppActionButton className="w-full" onClick={handleOrderClick}>
                Enviar solicitud por WhatsApp
              </WhatsAppActionButton>
              <WhatsAppActionButton
                className="w-full"
                onClick={handleHelpClick}
                variant="secondary"
              >
                Solicitar ayuda para personalizar
              </WhatsAppActionButton>
            </div>

            <InlineNotice>{helperMessage}</InlineNotice>
            <WhatsAppResponseNote className="text-center sm:text-left" />
          </div>
        </div>
      </section>
    </div>
  );
}
