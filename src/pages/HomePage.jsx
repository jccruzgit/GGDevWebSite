import { ArrowRight } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";
import BenefitCard from "@/components/home/BenefitCard";
import CategoryCard from "@/components/home/CategoryCard";
import CommercialCTA from "@/components/home/CommercialCTA";
import ExampleGallery from "@/components/home/ExampleGallery";
import ProcessSection from "@/components/home/ProcessSection";
import TestimonialCard from "@/components/home/TestimonialCard";
import ProductCard from "@/components/catalog/ProductCard";
import ProductImage from "@/components/product/ProductImage";
import CTAButton from "@/components/ui/CTAButton";
import SectionHeading from "@/components/ui/SectionHeading";
import { useCatalog } from "@/context/CatalogContext";
import { categories } from "@/data/categories";
import { commercialBenefits, commercialSteps } from "@/data/commercial";
import { testimonials } from "@/data/testimonials";

export default function HomePage() {
  const { featuredProducts, showcaseProducts } = useCatalog();
  const heroProduct = featuredProducts[0] || showcaseProducts[0];
  const hasFeaturedProducts = featuredProducts.length > 0;
  const hasShowcaseProducts = showcaseProducts.length > 0;

  return (
    <div className="pb-10">
      <section className="shell pt-8 sm:pt-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <div className="inline-flex rounded-[30px] border border-white/10 bg-white/5 p-3 shadow-card backdrop-blur-xl">
              <BrandLogo
                alt="GGDev"
                imgClassName="h-12 sm:h-14 drop-shadow-[0_0_30px_rgba(39,228,242,0.2)]"
                variant="full"
              />
            </div>
            <span className="eyebrow mt-6">Seleccion insignia GGDev</span>
            <h1 className="mt-6 text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-7xl">
              Tu estilo,
              <span className="text-gradient"> nivel leyenda.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Camisetas personalizadas con identidad tech, anime, motor y gaming para quienes
              quieren vestir con estilo propio y destacar desde el primer vistazo.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTAButton to="/catalogo">
                Explorar catalogo
                <ArrowRight className="h-4 w-4" />
              </CTAButton>
              <CTAButton to="/personalizar" variant="secondary">
                Personalizar ahora
              </CTAButton>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="panel-soft p-4">
                <p className="text-2xl font-bold text-white">+20 disenos</p>
                <p className="mt-1 text-sm text-slate-400">Disponibles</p>
              </div>
              <div className="panel-soft p-4">
                <p className="text-2xl font-bold text-white">24h</p>
                <p className="mt-1 text-sm text-slate-400">De respuesta</p>
              </div>
              <div className="panel-soft p-4">
                <p className="text-2xl font-bold text-white">A tu estilo</p>
                <p className="mt-1 text-sm text-slate-400">Personalizable</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="panel surface-grid relative overflow-hidden p-6 sm:p-8">
              <div className="absolute left-1/2 top-10 h-44 w-44 -translate-x-1/2 rounded-full bg-aqua/16 blur-3xl" />
              <div className="grid gap-4 sm:grid-cols-[0.78fr_1fr]">
                <div className="space-y-4">
                  <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      {heroProduct ? "Diseno destacado" : "Catalogo remoto"}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {heroProduct?.name || "Sube tus disenos a Supabase"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {heroProduct
                        ? "Una camiseta con presencia limpia, contraste fuerte y un look pensado para destacar tanto en uso diario como en tus fotos."
                        : "Cuando cargues productos reales desde el panel, aqui se mostraran automaticamente sin mockups locales de relleno."}
                    </p>
                  </div>
                  <div className="rounded-[28px] border border-aqua/15 bg-aqua/8 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Compra directa
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">Pide facil por WhatsApp</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Elige tu diseno, confirma talla y color, y cierra tu pedido con una atencion
                      clara, rapida y directa.
                    </p>
                  </div>
                </div>
                <div className="relative rounded-[34px] border border-white/10 bg-gradient-to-b from-surface-3 to-surface-2 p-5 shadow-glow">
                  {heroProduct ? (
                    <div className="rounded-[28px] border border-white/10 bg-night/50 p-3">
                      <div className="overflow-hidden rounded-[24px]">
                        <ProductImage
                          alt="Previsualizacion premium GGDev"
                          className="h-[420px]"
                          fit="contain"
                          image={heroProduct.mainImage}
                          imageClassName="p-4"
                          name={heroProduct.name}
                          surfaceClassName="bg-slate-100"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-[420px] items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-night/50 p-8 text-center">
                      <div className="max-w-sm">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                          Sin mockups locales
                        </p>
                        <p className="mt-4 text-2xl font-semibold text-white">
                          El escaparate mostrara solo productos reales.
                        </p>
                        <p className="mt-4 text-sm leading-7 text-slate-300">
                          Agrega disenos desde Supabase para poblar automaticamente el home, el catalogo y el detalle de producto.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="absolute -bottom-6 -left-8 w-[220px] rounded-[28px] border border-white/10 bg-night/90 p-4 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Acabado premium
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      Disenos con gran presencia visual, buen contraste sobre la prenda y un
                      acabado pensado para impresionar desde el primer vistazo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell mt-24">
        <SectionHeading
          description="Explora categorias pensadas para creadores, fans y personas que quieren una camiseta con identidad clara."
          eyebrow="Categorias"
          title="Tu proxima camiseta empieza con una idea que conecte contigo"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {hasFeaturedProducts ? (
        <section className="shell mt-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              description="Una seleccion lista para elegir sin complicaciones, con estilos que ya se ven bien sobre la prenda."
              eyebrow="Disenos listos para pedir"
              title="Empieza con una camiseta que ya se ve brutal"
            />
            <CTAButton to="/catalogo" variant="secondary">
              Ver catalogo completo
            </CTAButton>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      {hasShowcaseProducts ? (
        <section className="shell mt-24">
          <ExampleGallery items={showcaseProducts} />
        </section>
      ) : null}

      <section className="shell mt-16">
        <CommercialCTA
          description="Si ya encontraste un diseno que te gusta, puedes explorarlo mejor, personalizar otra idea o pedirlo de una vez."
          eyebrow="Siguiente paso"
          title="No te quedes solo con la idea. Convierte tu estilo en una camiseta real."
        />
      </section>

      <section className="shell mt-24">
        <SectionHeading
          align="center"
          description="Queremos que pedir una camiseta personalizada se sienta claro, confiable y facil de recomendar."
          eyebrow="Por que elegir GGDev"
          title="Mas confianza, mejor guia y un proceso que realmente acompana"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {commercialBenefits.map((benefit) => (
            <BenefitCard key={benefit.title} benefit={benefit} />
          ))}
        </div>
      </section>

      <section className="shell mt-24">
        <ProcessSection steps={commercialSteps} />
      </section>

      <section className="shell mt-16">
        <CommercialCTA
          description="Tanto si ya tienes una idea definida como si solo llevas una referencia, te ayudamos a aterrizarla y confirmarla."
          eyebrow="Pedido guiado"
          title="El proceso es simple, pero el resultado tiene que sentirse premium."
          whatsappLabel="Hablar por WhatsApp"
        />
      </section>

      <section className="shell mt-24">
        <SectionHeading
          description="Opiniones de clientes que llegaron con una idea o una referencia y terminaron con una camiseta lista para presumir."
          eyebrow="Testimonios"
          title="Lo que se siente al pedir con GGDev"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>

      <section className="shell mt-24">
        <CommercialCTA
          description="Explora disenos, sube tu idea o abre WhatsApp para confirmar detalles, precio final y entrega con atencion real."
          eyebrow="Cierre directo"
          title="GGDev esta listo para ayudarte a pedir desde cualquier canal."
          whatsappLabel="Pedir por WhatsApp"
        />
      </section>
    </div>
  );
}
