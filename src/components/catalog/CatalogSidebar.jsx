import { Filter } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";

export default function CatalogSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  sizes,
  selectedSize,
  onSizeChange,
}) {
  return (
    <aside className="panel sticky top-28 h-fit p-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-gradient text-slate-950">
          <Filter className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-white">Filtra tu selección</h2>
          <p className="text-sm text-slate-400">Encuentra tu estilo ideal</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-white">Categorías</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className={`rounded-full border px-4 py-2 text-sm ${
              selectedCategory === "all"
                ? "border-aqua bg-aqua/10 text-white"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
            }`}
            onClick={() => onCategoryChange("all")}
            type="button"
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`rounded-full border px-4 py-2 text-sm ${
                selectedCategory === category.id
                  ? "border-aqua bg-aqua/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
              }`}
              onClick={() => onCategoryChange(category.id)}
              type="button"
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm font-semibold text-white">Tallas</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className={`rounded-full border px-4 py-2 text-sm ${
              selectedSize === "all"
                ? "border-aqua bg-aqua/10 text-white"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
            }`}
            onClick={() => onSizeChange("all")}
            type="button"
          >
            Todas
          </button>
          {sizes.map((size) => (
            <button
              key={size}
              className={`rounded-full border px-4 py-2 text-sm ${
                selectedSize === size
                  ? "border-aqua bg-aqua/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
              }`}
              onClick={() => onSizeChange(size)}
              type="button"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-[24px] border border-aqua/15 bg-aqua/8 p-5">
        <p className="text-lg font-semibold text-white">Asesoría Pro</p>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Si no sabes qué diseño elegir o tu archivo necesita ajuste, te ayudamos sin costo extra.
        </p>
        <CTAButton className="mt-5 w-full" to="/asesoria" variant="secondary">
          Quiero apoyo
        </CTAButton>
      </div>
    </aside>
  );
}
