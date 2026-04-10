export default function ColorSelector({
  colors,
  selectedColor,
  onChange,
  label = "Color de prenda",
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-white">{label}</p>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const selected = selectedColor === color.hex || selectedColor === color.name;
          return (
            <button
              key={color.name}
              aria-label={`Seleccionar ${color.name}`}
              className={`flex items-center gap-3 rounded-full border px-3 py-2 text-sm ${
                selected
                  ? "border-aqua bg-aqua/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
              }`}
              onClick={() => onChange(color)}
              type="button"
            >
              <span
                className="h-5 w-5 rounded-full border border-white/15"
                style={{ backgroundColor: color.hex }}
              />
              {color.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
