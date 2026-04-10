import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/catalog/ProductCard";
import CatalogSidebar from "@/components/catalog/CatalogSidebar";
import CTAButton from "@/components/ui/CTAButton";
import { categories, sizeOptions } from "@/data/categories";
import { activeProducts } from "@/data/products";

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("categoria") || "all";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSize, setSelectedSize] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredProducts = useMemo(() => {
    return activeProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesSize = selectedSize === "all" || product.sizes.includes(selectedSize);
      return matchesCategory && matchesSize;
    });
  }, [selectedCategory, selectedSize]);

  return (
    <div className="shell pt-10">
      <section className="panel surface-grid overflow-hidden p-8 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="eyebrow">Catálogo GGDev</span>
            <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
              Diseños con actitud premium para redes, calle y comunidad.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Filtra por categoría, revisa tallas y encuentra la pieza que mejor conecta con tu
              estética. Si algo no te convence, te ayudamos a refinarlo.
            </p>
          </div>
          <div className="rounded-[28px] border border-aqua/15 bg-aqua/8 p-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-slate-950">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-white">Asesoría Pro incluida</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Si tu estilo está claro pero no el diseño exacto, te guiamos para aterrizar una pieza
              lista para producir con mejor presencia visual.
            </p>
            <CTAButton className="mt-6" to="/asesoria" variant="secondary">
              Quiero asesoría
            </CTAButton>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[320px_1fr]">
        <CatalogSidebar
          categories={categories}
          onCategoryChange={setSelectedCategory}
          onSizeChange={setSelectedSize}
          selectedCategory={selectedCategory}
          selectedSize={selectedSize}
          sizes={sizeOptions}
        />

        <div>
          <SectionHeading
            description={`${filteredProducts.length} diseños encontrados para tu selección actual.`}
            eyebrow="Selección activa"
            title="Explora la selección"
          />

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.slice(0, visibleCount).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="panel mt-8 p-8 text-center">
              <p className="text-xl font-semibold text-white">No hay resultados con ese filtro</p>
              <p className="mt-3 text-sm text-slate-400">
                Prueba otra categoría o cambia la talla para ver más diseños.
              </p>
            </div>
          ) : null}

          {visibleCount < filteredProducts.length ? (
            <div className="mt-10 flex justify-center">
              <CTAButton onClick={() => setVisibleCount((current) => current + 3)} variant="secondary">
                Cargar más diseños
              </CTAButton>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
