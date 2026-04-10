import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/utils/format";

export default function ProductCard({ product }) {
  return (
    <article className="panel-soft group overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          alt={product.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
          src={product.images[0]}
        />
        {product.featuredTag ? (
          <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-md">
            {product.featuredTag}
          </span>
        ) : null}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-400">
            {product.categoryLabel}
          </span>
          <span className="text-sm font-semibold text-aqua">{formatCurrency(product.price)}</span>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white">{product.name}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">{product.shortDescription}</p>
        <Link
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-aqua"
          to={`/producto/${product.slug}`}
        >
          Ver detalle
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
