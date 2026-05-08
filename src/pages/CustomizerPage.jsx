import CustomizerControls from "@/components/customizer/CustomizerControls";
import CustomizerMockup from "@/components/customizer/CustomizerMockup";
import CustomizerRequestPanel from "@/components/customizer/CustomizerRequestPanel";
import ColorSelector from "@/components/ui/ColorSelector";
import SectionHeading from "@/components/ui/SectionHeading";
import UploadBox from "@/components/ui/UploadBox";
import { useCustomizer } from "@/context/CustomizerContext";

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

  return (
    <div className="shell pt-10">
      <section className="panel surface-grid p-8 sm:p-10">
        <SectionHeading
          description="Sube tu imagen, ajusta tamano y posicion sobre la prenda, descarga la vista previa y envia la solicitud real por WhatsApp."
          eyebrow="Personalizador GGDev"
          title="Convierte tu idea en un pedido listo para seguimiento"
        />
      </section>

      <section className="mt-10 grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start">
        <div className="space-y-6">
          <UploadBox
            description="Carga tu archivo y previsualizalo sobre la camiseta. PNG y JPG funcionan mejor para esta etapa."
            fileName={fileName}
            onFileSelect={setImageFromFile}
            title="Sube tu diseno base"
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
              <p className="text-sm font-semibold text-white">Vista del diseno</p>
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

          <CustomizerRequestPanel
            file={file}
            fileName={fileName}
            garmentColor={garmentColor}
            garmentOptions={garmentOptions}
            image={image}
            offsetX={offsetX}
            offsetY={offsetY}
            placement={placement}
            scale={scale}
          />
        </div>
      </section>
    </div>
  );
}
