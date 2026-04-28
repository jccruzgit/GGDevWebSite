import { Link } from "react-router-dom";
import ProductImage from "@/components/product/ProductImage";
import SectionHeading from "@/components/ui/SectionHeading";
import { getProductPrimaryImage } from "@/utils/productMedia";

const layoutClasses = [
  "md:col-span-2 xl:col-span-7 xl:row-span-2",
  "xl:col-span-5",
  "xl:col-span-5",
  "xl:col-span-4",
  "xl:col-span-4",
  "xl:col-span-4",
];

export default function ExampleGallery({ items }) {
  return (
    <section>
      <SectionHeading
        description="Descubre algunas de las camisetas destacadas de la tienda, con estilos pensados para sobresalir en el día a día y en tus fotos."
        eyebrow="Diseños destacados"
        title="Camisetas con presencia y estilo propio"
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-12">
        {items.map((item, index) => (
          <article
            key={item.id}
            className={`panel-soft group relative overflow-hidden ${layoutClasses[index] || "xl:col-span-4"}`}
          >
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-night via-night/35 to-transparent opacity-95" />
            <ProductImage
              alt={item.name}
              category={item.categoryLabel}
              className={`relative z-0 transition duration-500 group-hover:scale-[1.03] ${
                index === 0 ? "h-[420px] sm:h-[520px]" : "h-[320px]"
              }`}
              fit="contain"
              image={getProductPrimaryImage(item)}
              imageClassName="p-4"
              name={item.name}
              surfaceClassName="bg-slate-100"
            />
            <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6">
              <span className="inline-flex rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-200 backdrop-blur-md">
                {item.categoryLabel}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-2xl">
                {item.name}
              </h3>
              <Link
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-aqua drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] hover:text-white"
                to={`/producto/${item.slug}`}
              >
                Ir al detalle
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
