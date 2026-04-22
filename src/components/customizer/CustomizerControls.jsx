import { AlignCenter, Minus, Plus, RotateCcw } from "lucide-react";
import InfoCard from "@/components/ui/InfoCard";

export default function CustomizerControls({
  onZoomIn,
  onZoomOut,
  onCenter,
  onReset,
  offsetX,
  offsetY,
  onOffsetXChange,
  onOffsetYChange,
}) {
  return (
    <div className="space-y-5">
      <div className="panel-soft p-6">
        <p className="text-sm font-semibold text-white">Tamaño y posición</p>
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

        <label
          className="mt-6 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
          htmlFor="offset-x"
        >
          Horizontal
        </label>
        <input
          className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#27E4F2]"
          id="offset-x"
          max="40"
          min="-40"
          onChange={(event) => onOffsetXChange(Number(event.target.value))}
          step="1"
          type="range"
          value={offsetX}
        />
        <div className="mt-2 flex justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
          <span>Izquierda</span>
          <span>{offsetX}%</span>
          <span>Derecha</span>
        </div>

        <label
          className="mt-5 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
          htmlFor="offset-y"
        >
          Vertical
        </label>
        <input
          className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#27E4F2]"
          id="offset-y"
          max="40"
          min="-40"
          onChange={(event) => onOffsetYChange(Number(event.target.value))}
          step="1"
          type="range"
          value={offsetY}
        />
        <div className="mt-2 flex justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
          <span>Arriba</span>
          <span>{offsetY}%</span>
          <span>Abajo</span>
        </div>
      </div>

      <InfoCard
        description="Ajusta tamaño y posición aquí, y luego confirma por WhatsApp para revisar viabilidad, calidad del archivo y producción."
        title="Preview para aprobación"
      />
    </div>
  );
}
