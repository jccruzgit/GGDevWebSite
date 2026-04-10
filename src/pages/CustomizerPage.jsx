import { useMemo, useState } from "react";
import CTAButton from "@/components/ui/CTAButton";
import ColorSelector from "@/components/ui/ColorSelector";
import SectionHeading from "@/components/ui/SectionHeading";
import UploadBox from "@/components/ui/UploadBox";
import CustomizerControls from "@/components/customizer/CustomizerControls";
import CustomizerMockup from "@/components/customizer/CustomizerMockup";
import { useCustomizer } from "@/context/CustomizerContext";
import {
  buildAdvisoryMessage,
  buildCustomizerMessage,
  buildWhatsAppUrl,
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

  const orderUrl = buildWhatsAppUrl(
    buildCustomizerMessage({
      placement,
      garmentColor: selectedGarment.name,
      fileName,
      notes,
    })
  );

  const advisoryUrl = buildWhatsAppUrl(
    buildAdvisoryMessage({
      subject: "Ayuda para personalizar una camiseta",
      message:
        notes ||
        "No estoy seguro de la calidad de mi imagen, el tamaño o la mejor ubicación del diseño.",
    })
  );

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
              Si no estás seguro de la calidad de tu imagen o tamaño, GGDev te asesora sin costo
              adicional.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <CTAButton href={orderUrl} rel="noreferrer" target="_blank">
              Enviar pedido
            </CTAButton>
            <CTAButton href={advisoryUrl} rel="noreferrer" target="_blank" variant="secondary">
              Solicitar ayuda
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}
