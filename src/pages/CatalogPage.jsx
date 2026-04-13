import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles } from "lucide-react";
import CatalogSidebar from "@/components/catalog/CatalogSidebar";
import ProductCard from "@/components/catalog/ProductCard";
import CTAButton from "@/components/ui/CTAButton";
import InlineNotice from "@/components/ui/InlineNotice";
import SectionHeading from "@/components/ui/SectionHeading";
import { useCatalog } from "@/context/CatalogContext";
import { categories, sizeOptions } from "@/data/categories";

export default function CatalogPage() {
  const { activeProducts, error } = useCatalog();
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
  }, [activeProducts, selectedCategory, selectedSize]);

  return (
    <div className="shell pt-10">
      <section className="panel surface-grid overflow-hidden p-8 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="eyebrow">Catalogo GGDev</span>
            <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
              Disenos con actitud premium para redes, calle y comunidad.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Filtra por categoria, revisa tallas y encuentra la pieza que mejor conecta con tu
              estilo. Si algo no te convence, te ayudamos a refinarlo.
            </p>
          </div>
          <div className="rounded-[28px] border border-aqua/15 bg-aqua/8 p-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-slate-950">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-white">Asesoria Pro incluida</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Si tu estilo esta claro pero no el diseno exacto, te guiamos para aterrizar una pieza
              lista para producir con mejor presencia visual.
            </p>
            <CTAButton className="mt-6" to="/asesoria" variant="secondary">
              Quiero asesoria
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
          {error ? (
            <InlineNotice tone="info">
              El catalogo remoto no se pudo cargar. Se muestran los disenos locales disponibles.
            </InlineNotice>
          ) : null}

          <SectionHeading
            description={`${filteredProducts.length} disenos encontrados para tu seleccion actual.`}
            eyebrow="Seleccion activa"
            title="Explora la seleccion"
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
                Prueba otra categoria o cambia la talla para ver mas disenos.
              </p>
            </div>
          ) : null}

          {visibleCount < filteredProducts.length ? (
            <div className="mt-10 flex justify-center">
              <CTAButton
                onClick={() => setVisibleCount((current) => current + 3)}
                variant="secondary"
              >
                Cargar mas disenos
              </CTAButton>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
