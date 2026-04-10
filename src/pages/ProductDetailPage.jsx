import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import CTAButton from "@/components/ui/CTAButton";
import ColorSelector from "@/components/ui/ColorSelector";
import QuantitySelector from "@/components/ui/QuantitySelector";
import SectionHeading from "@/components/ui/SectionHeading";
import SizeSelector from "@/components/ui/SizeSelector";
import ProductGallery from "@/components/product/ProductGallery";
import ProductSpecs from "@/components/product/ProductSpecs";
import { products } from "@/data/products";
import { formatCurrency } from "@/utils/format";
import {
  buildAdvisoryMessage,
  buildProductMessage,
  buildWhatsAppUrl,
} from "@/utils/whatsapp";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = useMemo(
    () => products.find((item) => item.slug === id || item.id === id),
    [id]
  );

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[1] || product?.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

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

  const productWhatsAppUrl = buildWhatsAppUrl(
    buildProductMessage({
      productName: product.name,
      size: selectedSize,
      color: selectedColor?.name,
      quantity,
      notes,
    })
  );

  const helpWhatsAppUrl = buildWhatsAppUrl(
    buildAdvisoryMessage({
      subject: `Ayuda con ${product.name}`,
      message:
        notes ||
        `Quiero apoyo para definir la mejor talla, color o ubicación del diseño ${product.name}.`,
    })
  );

  return (
    <div className="shell pt-10">
      <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <ProductGallery activeIndex={activeImage} images={product.images} onChange={setActiveImage} />

        <div className="space-y-6">
          <div>
            <span className="eyebrow">{product.categoryLabel}</span>
            <SectionHeading description={product.description} title={product.name} />
            <p className="mt-6 text-3xl font-bold text-white">{formatCurrency(product.price)}</p>
          </div>

          <div className="panel-soft space-y-6 p-6">
            <ColorSelector
              colors={product.colors}
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

            <div className="flex flex-col gap-3 sm:flex-row">
              <CTAButton href={productWhatsAppUrl} rel="noreferrer" target="_blank">
                Pedir por WhatsApp
              </CTAButton>
              <CTAButton href={helpWhatsAppUrl} rel="noreferrer" target="_blank" variant="secondary">
                Necesito ayuda con este diseño
              </CTAButton>
            </div>
          </div>

          <ProductSpecs />
        </div>
      </div>
    </div>
  );
}
