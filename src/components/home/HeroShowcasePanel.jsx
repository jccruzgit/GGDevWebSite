import { useEffect, useMemo, useState } from "react";
import ProductImage from "@/components/product/ProductImage";

const ROTATION_INTERVAL_MS = 5200;
const FADE_DURATION_MS = 320;
const TITLE_CLAMP_STYLE = {
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  display: "-webkit-box",
  overflow: "hidden",
};
const BODY_CLAMP_STYLE = {
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 3,
  display: "-webkit-box",
  overflow: "hidden",
};

function buildFallbackCopy(hasProducts) {
  if (hasProducts) {
    return {
      body: "Una camiseta con presencia limpia, contraste fuerte y un look pensado para destacar tanto en uso diario como en tus fotos.",
      kicker: "Diseno destacado",
      title: "Rotacion developers GGDev",
    };
  }

  return {
    body: "Cuando cargues productos reales desde el panel, aqui se mostraran automaticamente sin mockups locales de relleno.",
    kicker: "Catalogo remoto",
    title: "Sube tus disenos a Supabase",
  };
}

export default function HeroShowcasePanel({ products = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayProduct, setDisplayProduct] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const developersProducts = useMemo(
    () => products.filter((product) => product.category === "devs"),
    [products]
  );
  const hasDevelopersProducts = developersProducts.length > 0;
  const activeProduct = hasDevelopersProducts ? developersProducts[activeIndex] : null;
  const copy = buildFallbackCopy(hasDevelopersProducts);

  useEffect(() => {
    setActiveIndex(0);
  }, [developersProducts.length]);

  useEffect(() => {
    if (!activeProduct) {
      setDisplayProduct(null);
      setIsTransitioning(false);
      return undefined;
    }

    if (!displayProduct) {
      setDisplayProduct(activeProduct);
      return undefined;
    }

    if (displayProduct.id === activeProduct.id) {
      return undefined;
    }

    setIsTransitioning(true);

    const timeoutId = window.setTimeout(() => {
      setDisplayProduct(activeProduct);
      setIsTransitioning(false);
    }, FADE_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeProduct, displayProduct]);

  useEffect(() => {
    if (developersProducts.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % developersProducts.length);
    }, ROTATION_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [developersProducts]);

  return (
    <div className="panel surface-grid relative overflow-hidden p-5 sm:p-6 lg:p-7">
      <div className="absolute left-1/2 top-8 h-36 w-36 -translate-x-1/2 rounded-full bg-aqua/16 blur-3xl" />
      <div className="grid gap-4 lg:grid-cols-[0.72fr_1fr] lg:gap-5">
        <div className="grid content-start gap-4 lg:grid-rows-[minmax(0,1fr)_auto]">
          <div className="flex min-h-[250px] flex-col rounded-[24px] border border-white/10 bg-white/5 p-4 sm:p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              {activeProduct?.categoryLabel || copy.kicker}
            </p>
            <p
              className="mt-2 min-h-[3.5rem] text-lg font-semibold leading-7 text-white"
              style={TITLE_CLAMP_STYLE}
            >
              {activeProduct?.name || copy.title}
            </p>
            <p className="mt-2 min-h-[4.5rem] text-sm leading-6 text-slate-300" style={BODY_CLAMP_STYLE}>
              {activeProduct?.shortDescription || copy.body}
            </p>
            {developersProducts.length > 1 ? (
              <div className="mt-auto flex gap-2 pt-4">
                {developersProducts.map((product, index) => (
                  <span
                    key={product.id}
                    className={`h-1.5 rounded-full transition-all duration-700 ${
                      index === activeIndex ? "w-8 bg-aqua" : "w-3 bg-white/15"
                    }`}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-[24px] border border-aqua/15 bg-aqua/8 p-4 sm:p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Compra directa</p>
            <p className="mt-2 text-lg font-semibold text-white">Pide facil por WhatsApp</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Elige tu diseno, confirma talla y color, y cierra tu pedido con una atencion clara,
              rapida y directa.
            </p>
          </div>
        </div>

        <div className="relative rounded-[30px] border border-white/10 bg-gradient-to-b from-surface-3 to-surface-2 px-4 py-5 shadow-glow sm:px-5 sm:py-6">
          {displayProduct ? (
            <div className="rounded-[24px] border border-white/10 bg-night/55 p-3">
              <div
                className={`overflow-hidden rounded-[20px] transition-opacity duration-300 ${
                  isTransitioning ? "opacity-0" : "opacity-100"
                }`}
              >
                <ProductImage
                  alt="Previsualizacion premium GGDev"
                  className="h-[260px] sm:h-[290px] lg:h-[320px]"
                  fit="contain"
                  image={displayProduct.mainImage}
                  imageClassName={`p-4 transition-all duration-[1600ms] ease-out ${
                    developersProducts.length > 1 ? "scale-[1.015]" : ""
                  }`}
                  name={displayProduct.name}
                  surfaceClassName="bg-slate-100"
                />
              </div>
            </div>
          ) : (
            <div className="flex h-[260px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-night/50 p-8 text-center sm:h-[290px] lg:h-[320px]">
              <div className="max-w-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Sin mockups locales
                </p>
                <p className="mt-4 text-2xl font-semibold text-white">
                  El escaparate mostrara solo productos reales.
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Agrega disenos de la categoria developers desde Supabase para poblar
                  automaticamente esta vitrina principal.
                </p>
              </div>
            </div>
          )}

          <div className="absolute inset-x-4 -bottom-5 sm:left-auto sm:right-5 sm:w-[220px]">
            <div className="rounded-[24px] border border-white/10 bg-night/90 p-4 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Acabado premium</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                Disenos con gran presencia visual, buen contraste sobre la prenda y un acabado
                pensado para impresionar desde el primer vistazo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
