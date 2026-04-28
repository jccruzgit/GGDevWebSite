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
import { useCatalog } from "@/context/CatalogContext";
import { productTrustItems } from "@/data/commercial";
import { createPublicRequest } from "@/services/requestService";
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
  const { activeProducts, loading, products } = useCatalog();
  const product = useMemo(
    () => products.find((item) => item.slug === id || item.id === id),
    [id, products]
  );

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [pendingAction, setPendingAction] = useState("");
  const [requestFeedback, setRequestFeedback] = useState({
    message: "",
    tone: "info",
  });

  const productImages = useMemo(() => getProductGalleryImages(product), [product]);
  const hasProductImages = productImages.length > 0;
  const relatedProducts = useMemo(
    () =>
      activeProducts
        .filter((item) => item.id !== product?.id && item.category === product?.category)
        .slice(0, 3),
    [activeProducts, product]
  );

  if (!product && loading) {
    return (
      <div className="shell pt-14">
        <div className="panel p-10 text-center">
          <h1 className="text-3xl font-bold text-white">Cargando diseno</h1>
          <p className="mt-4 text-slate-400">
            Estamos buscando el producto en el catalogo para mostrarte el detalle correcto.
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="shell pt-14">
        <div className="panel p-10 text-center">
          <h1 className="text-3xl font-bold text-white">Ese diseno ya no esta disponible</h1>
          <p className="mt-4 text-slate-400">
            Vuelve al catalogo para explorar otros disenos o pide apoyo para una version similar.
          </p>
          <CTAButton className="mt-8" to="/catalogo">
            Ir al catalogo
          </CTAButton>
        </div>
      </div>
    );
  }

  const productErrors = {
    color: selectedColor?.name ? "" : "Selecciona un color de prenda para continuar.",
    quantity:
      Number.isInteger(quantity) && quantity > 0
        ? ""
        : "La cantidad debe ser un numero valido mayor que cero.",
    size: selectedSize ? "" : "Selecciona una talla para continuar.",
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
    missingFields.push("una cantidad valida");
  }

  const productNotice = isProductOrderReady
    ? "Tu mensaje incluira el diseno, talla, color, cantidad y notas para cerrar el pedido mas rapido."
    : `Selecciona ${formatMissingFields(missingFields)} para desbloquear el pedido por WhatsApp.`;

  const handleRequestAction = async ({ action, requestType, whatsappMessage }) => {
    setPendingAction(action);
    setRequestFeedback({
      message: "",
      tone: "info",
    });

    try {
      const savedRequest = await createPublicRequest({
        request: {
          garmentColor: selectedColor?.name || "",
          metadata: {
            productId: product.id,
            source: "product-detail-page",
          },
          notes,
          productName: product.name,
          productSlug: product.slug,
          quantity,
          requestType,
          size: selectedSize,
          subject:
            action === "order"
              ? `Pedido directo de ${product.name}`
              : `Ayuda antes de pedir ${product.name}`,
        },
      });

      if (savedRequest) {
        setRequestFeedback({
          message:
            "Guardamos esta solicitud en el panel para dar seguimiento aunque el cierre siga por WhatsApp.",
          tone: "info",
        });
      }
    } catch (error) {
      setRequestFeedback({
        message:
          error.message ||
          "No se pudo guardar la solicitud en el panel, pero abriremos WhatsApp para continuar.",
        tone: "error",
      });
    } finally {
      setPendingAction("");
      openWhatsApp(whatsappMessage);
    }
  };

  const handleOrderClick = () => {
    if (!isProductOrderReady) {
      return;
    }

    void handleRequestAction({
      action: "order",
      requestType: "product-order",
      whatsappMessage: buildProductOrderMessage({
        color: selectedColor?.name,
        notes,
        productName: product.name,
        quantity,
        size: selectedSize,
      }),
    });
  };

  const handleHelpClick = () => {
    void handleRequestAction({
      action: "help",
      requestType: "product-help",
      whatsappMessage: buildSupportMessage({
        intro: `Hola, necesito ayuda con el diseno ${product.name}.`,
        details: [
          `Diseno: ${product.name}`,
          `Talla: ${selectedSize || "Por definir"}`,
          `Color: ${selectedColor?.name || "Por definir"}`,
          `Cantidad: ${quantity}`,
          `Notas: ${notes.trim() || "Necesito recomendacion para elegir la mejor opcion."}`,
        ],
        closing: "Quiero que me orienten antes de confirmar mi pedido.",
      }),
    });
  };

  return (
    <div className="shell pt-10">
      <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-6">
          {hasProductImages ? (
            <ProductGallery activeIndex={activeImage} images={productImages} onChange={setActiveImage} />
          ) : (
            <div className="panel p-10 text-center">
              <h2 className="text-2xl font-bold text-white">Imagen pendiente de carga</h2>
              <p className="mt-4 text-slate-400">
                Este producto existe en el catalogo, pero todavia no tiene imagen principal publicada.
              </p>
            </div>
          )}
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
                placeholder="Cuentanos si quieres un ajuste, una referencia o alguna indicacion especial."
                value={notes}
              />
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <WhatsAppActionButton
                  className="w-full sm:flex-1"
                  disabled={!isProductOrderReady || Boolean(pendingAction)}
                  onClick={handleOrderClick}
                >
                  {pendingAction === "order" ? "Guardando solicitud..." : "Pedir por WhatsApp"}
                </WhatsAppActionButton>
                <WhatsAppActionButton
                  className="w-full sm:flex-1"
                  disabled={Boolean(pendingAction)}
                  onClick={handleHelpClick}
                  variant="secondary"
                >
                  {pendingAction === "help"
                    ? "Guardando solicitud..."
                    : "Necesito ayuda con este diseno"}
                </WhatsAppActionButton>
              </div>

              <InlineNotice tone={isProductOrderReady ? "info" : "error"}>
                {productNotice}
              </InlineNotice>
              {requestFeedback.message ? (
                <InlineNotice tone={requestFeedback.tone}>{requestFeedback.message}</InlineNotice>
              ) : null}
              <WhatsAppResponseNote className="text-center sm:text-left" />
            </div>
          </div>
        </div>
      </div>

      <TrustSection
        className="mt-16"
        description={`Queremos que pedir ${product.name} se sienta claro desde el primer mensaje hasta la confirmacion final.`}
        eyebrow="Confianza GGDev"
        items={productTrustItems}
        note="Si no estas seguro del tamano o la ubicacion del diseno, te ayudamos antes de producir."
        title="Compra con respaldo visual y acompanamiento real"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppActionButton
            className="w-full sm:w-auto"
            disabled={Boolean(pendingAction)}
            onClick={handleHelpClick}
            variant="secondary"
          >
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
              description={`Mas opciones dentro de ${product.categoryLabel} para comparar estilo, color y presencia visual.`}
              eyebrow="Relacionados"
              title="Sigue explorando esta linea"
            />
            <CTAButton to={`/catalogo?categoria=${product.category}`}>Ver mas de esta categoria</CTAButton>
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
