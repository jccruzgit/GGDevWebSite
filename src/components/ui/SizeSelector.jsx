export default function SizeSelector({
  sizes,
  selectedSize,
  onChange,
  label = "Talla",
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-white">{label}</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            className={`min-w-12 rounded-2xl border px-4 py-2 text-sm font-medium ${
              selectedSize === size
                ? "border-aqua bg-aqua/12 text-white"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
            }`}
            onClick={() => onChange(size)}
            type="button"
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
