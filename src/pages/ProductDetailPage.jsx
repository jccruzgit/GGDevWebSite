import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "@/components/catalog/ProductCard";
import ProductGallery from "@/components/product/ProductGallery";
import ProductSpecs from "@/components/product/ProductSpecs";
import CTAButton from "@/components/ui/CTAButton";
import ColorSelector from "@/components/ui/ColorSelector";
import InlineNotice from "@/components/ui/InlineNotice";
import QuantitySelector from "@/components/ui/QuantitySelector";
import SectionHeading from "@/components/ui/SectionHeading";
import SizeSelector from "@/components/ui/SizeSelector";
import TrustSection from "@/components/ui/TrustSection";
import WhatsAppActionButton from "@/components/ui/WhatsAppActionButton";
import WhatsAppResponseNote from "@/components/ui/WhatsAppResponseNote";
import { productTrustItems } from "@/data/commercial";
import { activeProducts, products } from "@/data/products";
import { formatCurrency } from "@/utils/format";
import { getProductGalleryImages } from "@/utils/productMedia";
import {
  buildProductOrderMessage,
  buildSupportMessage,
  openWhatsApp,
} from "@/utils/whatsapp";

function formatMissingFields(fields) {
  if (fields.length <= 1) {
    return fields[0] || "";
  }

  if (fields.length === 2) {
    return `${fields[0]} y ${fields[1]}`;
  }

  return `${fields.slice(0, -1).join(", ")} y ${fields.at(-1)}`;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = useMemo(
    () => products.find((item) => item.slug === id || item.id === id),
    [id]
  );

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const productImages = useMemo(() => getProductGalleryImages(product), [product]);
  const relatedProducts = useMemo(
    () =>
      activeProducts
        .filter((item) => item.id !== product?.id && item.category === product?.category)
        .slice(0, 3),
    [product]
  );

  if (!product) {
    return (
      <div className="shell pt-14">
        <div className="panel p-10 text-center">
          <h1 className="text-3xl font-bold text-white">Ese diseño ya no está disponible</h1>
          <p className="mt-4 text-slate-400">
            Vuelve al catálogo para explorar otros diseños o pide apoyo para una versión similar.
          </p>
          <CTAButton className="mt-8" to="/catalogo">
            Ir al catálogo
          </CTAButton>
        </div>
      </div>
    );
  }

  const productErrors = {
    size: selectedSize ? "" : "Selecciona una talla para continuar.",
    color: selectedColor?.name ? "" : "Selecciona un color de prenda para continuar.",
    quantity:
      Number.isInteger(quantity) && quantity > 0
        ? ""
        : "La cantidad debe ser un número válido mayor que cero.",
  };

  const isProductOrderReady = !Object.values(productErrors).some(Boolean);
  const missingFields = [];

  if (productErrors.size) {
    missingFields.push("una talla");
  }

  if (productErrors.color) {
    missingFields.push("un color");
  }

  if (productErrors.quantity) {
    missingFields.push("una cantidad válida");
  }

  const productNotice = isProductOrderReady
    ? "Tu mensaje incluirá el diseño, talla, color, cantidad y notas para cerrar el pedido más rápido."
    : `Selecciona ${formatMissingFields(missingFields)} para desbloquear el pedido por WhatsApp.`;

  const handleOrderClick = () => {
    if (!isProductOrderReady) {
      return;
    }

    openWhatsApp(
      buildProductOrderMessage({
        productName: product.name,
        size: selectedSize,
        color: selectedColor?.name,
        quantity,
        notes,
      })
    );
  };

  const handleHelpClick = () => {
    openWhatsApp(
      buildSupportMessage({
        intro: `Hola, necesito ayuda con el diseño ${product.name}.`,
        details: [
          `Diseño: ${product.name}`,
          `Talla: ${selectedSize || "Por definir"}`,
          `Color: ${selectedColor?.name || "Por definir"}`,
          `Cantidad: ${quantity}`,
          `Notas: ${notes.trim() || "Necesito recomendación para elegir la mejor opción."}`,
        ],
        closing: "Quiero que me orienten antes de confirmar mi pedido.",
      })
    );
  };

  return (
    <div className="shell pt-10">
      <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-6">
          <ProductGallery activeIndex={activeImage} images={productImages} onChange={setActiveImage} />
          <ProductSpecs />
        </div>

        <div className="space-y-6">
          <div>
            <span className="eyebrow">{product.categoryLabel}</span>
            <SectionHeading description={product.description} title={product.name} />
            <p className="mt-6 text-3xl font-bold text-white">{formatCurrency(product.price)}</p>
          </div>

          <div className="panel-soft space-y-6 p-6">
            <ColorSelector
              colors={product.availableColors}
              onChange={setSelectedColor}
              selectedColor={selectedColor?.hex}
            />
            <SizeSelector
              onChange={setSelectedSize}
              selectedSize={selectedSize}
              sizes={product.sizes}
            />
            <QuantitySelector onChange={setQuantity} quantity={quantity} />

            <div>
              <label className="mb-3 block text-sm font-semibold text-white" htmlFor="notes">
                Notas adicionales
              </label>
              <textarea
                className="min-h-32 w-full rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aqua/30 focus:outline-none"
                id="notes"
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Cuéntanos si quieres un ajuste, una referencia o alguna indicación especial."
                value={notes}
              />
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <WhatsAppActionButton
                  className="w-full sm:flex-1"
                  disabled={!isProductOrderReady}
                  onClick={handleOrderClick}
                >
                  Pedir por WhatsApp
                </WhatsAppActionButton>
                <WhatsAppActionButton
                  className="w-full sm:flex-1"
                  onClick={handleHelpClick}
                  variant="secondary"
                >
                  Necesito ayuda con este diseño
                </WhatsAppActionButton>
              </div>

              <InlineNotice tone={isProductOrderReady ? "info" : "error"}>
                {productNotice}
              </InlineNotice>
              <WhatsAppResponseNote className="text-center sm:text-left" />
            </div>
          </div>
        </div>
      </div>

      <TrustSection
        className="mt-16"
        description={`Queremos que pedir ${product.name} se sienta claro desde el primer mensaje hasta la confirmación final.`}
        eyebrow="Confianza GGDev"
        items={productTrustItems}
        note="Si no estás seguro del tamaño o la ubicación del diseño, te ayudamos antes de producir."
        title="Compra con respaldo visual y acompañamiento real"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppActionButton className="w-full sm:w-auto" onClick={handleHelpClick} variant="secondary">
            Quiero ayuda antes de pedir
          </WhatsAppActionButton>
          <CTAButton className="w-full sm:w-auto" to="/personalizar">
            Personalizar otra idea
          </CTAButton>
        </div>
        <WhatsAppResponseNote />
      </TrustSection>

      {relatedProducts.length > 0 ? (
        <section className="mt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              description={`Más opciones dentro de ${product.categoryLabel} para comparar estilo, color y presencia visual.`}
              eyebrow="Relacionados"
              title="Sigue explorando esta línea"
            />
            <CTAButton to={`/catalogo?categoria=${product.category}`}>Ver más de esta categoría</CTAButton>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
