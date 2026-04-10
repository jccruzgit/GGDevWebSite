import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({ quantity, onChange }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-white">Cantidad</p>
      <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1">
        <button
          aria-label="Reducir cantidad"
          className="rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white"
          onClick={() => onChange(Math.max(1, quantity - 1))}
          type="button"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-12 text-center text-sm font-semibold text-white">{quantity}</span>
        <button
          aria-label="Aumentar cantidad"
          className="rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white"
          onClick={() => onChange(quantity + 1)}
          type="button"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
