import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ProductImage from "@/components/product/ProductImage";
import { formatCurrency } from "@/utils/format";
import { getProductPrimaryImage } from "@/utils/productMedia";

export default function ProductCard({ product }) {
  return (
    <article className="panel-soft group overflow-hidden">
      <div className="relative overflow-hidden">
        <ProductImage
          alt={product.name}
          category={product.categoryLabel}
          className="h-72 transition duration-500 group-hover:scale-105"
          image={getProductPrimaryImage(product)}
          name={product.name}
          watermark
        />
        {product.tag ? (
          <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-md">
            {product.tag}
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
