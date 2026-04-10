import { AlignCenter, Minus, Plus, RotateCcw } from "lucide-react";
import InfoCard from "@/components/ui/InfoCard";

export default function CustomizerControls({
  placement,
  onPlacementChange,
  onZoomIn,
  onZoomOut,
  onCenter,
  onReset,
  opacity,
  onOpacityChange,
}) {
  return (
    <div className="space-y-5">
      <div className="panel-soft p-6">
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
              onClick={() => onPlacementChange(side)}
              type="button"
            >
              {side}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-soft p-6">
        <p className="text-sm font-semibold text-white">Ajustes rápidos</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:border-aqua/30"
            onClick={onZoomIn}
            type="button"
          >
            <Plus className="mx-auto mb-2 h-4 w-4" />
            Acercar
          </button>
          <button
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:border-aqua/30"
            onClick={onZoomOut}
            type="button"
          >
            <Minus className="mx-auto mb-2 h-4 w-4" />
            Alejar
          </button>
          <button
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:border-aqua/30"
            onClick={onCenter}
            type="button"
          >
            <AlignCenter className="mx-auto mb-2 h-4 w-4" />
            Centrar
          </button>
          <button
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:border-aqua/30"
            onClick={onReset}
            type="button"
          >
            <RotateCcw className="mx-auto mb-2 h-4 w-4" />
            Reiniciar
          </button>
        </div>
      </div>

      <div className="panel-soft p-6">
        <label className="block text-sm font-semibold text-white" htmlFor="opacity">
          Opacidad del diseño
        </label>
        <input
          className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#27E4F2]"
          id="opacity"
          max="1"
          min="0.2"
          onChange={(event) => onOpacityChange(Number(event.target.value))}
          step="0.05"
          type="range"
          value={opacity}
        />
        <div className="mt-2 flex justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
          <span>Suave</span>
          <span>{Math.round(opacity * 100)}%</span>
          <span>Sólido</span>
        </div>
      </div>

      <InfoCard
        description="Si no estás seguro de la calidad de tu imagen o el tamaño del arte, GGDev te asesora sin costo adicional."
        title="Acompañamiento visual incluido"
      />
    </div>
  );
}
