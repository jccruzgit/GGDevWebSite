import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";
import CategoryCard from "@/components/home/CategoryCard";
import ProductCard from "@/components/catalog/ProductCard";
import TestimonialCard from "@/components/home/TestimonialCard";
import BenefitCard from "@/components/home/BenefitCard";
import CommercialCTA from "@/components/home/CommercialCTA";
import ExampleGallery from "@/components/home/ExampleGallery";
import ProcessSection from "@/components/home/ProcessSection";
import { categories } from "@/data/categories";
import { commercialBenefits, commercialSteps, showcaseExamples } from "@/data/commercial";
import { featuredProducts } from "@/data/products";
import { testimonials } from "@/data/testimonials";

export default function HomePage() {
  return (
    <div className="pb-10">
      <section className="shell pt-8 sm:pt-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <span className="eyebrow">Selección insignia GGDev</span>
            <h1 className="mt-6 text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-7xl">
              Tu estilo,
              <span className="text-gradient"> nivel leyenda.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Camisetas personalizadas con ADN tech, anime, motor y gaming para perfiles que
              quieren vender imagen, no verse como algo genérico.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTAButton to="/catalogo">
                Explorar catálogo
                <ArrowRight className="h-4 w-4" />
              </CTAButton>
              <CTAButton to="/personalizar" variant="secondary">
                Personalizar ahora
              </CTAButton>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="panel-soft p-4">
                <p className="text-2xl font-bold text-white">+8</p>
                <p className="mt-1 text-sm text-slate-400">Diseños activos</p>
              </div>
              <div className="panel-soft p-4">
                <p className="text-2xl font-bold text-white">24h</p>
                <p className="mt-1 text-sm text-slate-400">Respuesta estimada</p>
              </div>
              <div className="panel-soft p-4">
                <p className="text-2xl font-bold text-white">Bajo pedido</p>
                <p className="mt-1 text-sm text-slate-400">Producción confirmada</p>
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
                      Selección destacada
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">Tokyo Midnight Run</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Una vibra potente para entrar desde redes y cerrar el pedido con una sola
                      conversación.
                    </p>
                  </div>
                  <div className="rounded-[28px] border border-aqua/15 bg-aqua/8 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Confianza comercial
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      Te guiamos antes de producir
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Si el arte no está listo o no sabes qué talla pedir, lo revisamos contigo
                      antes de confirmar.
                    </p>
                  </div>
                </div>
                <div className="relative rounded-[34px] border border-white/10 bg-gradient-to-b from-surface-3 to-surface-2 p-5 shadow-glow">
                  <div className="rounded-[28px] border border-white/10 bg-night/50 p-3">
                    <div className="overflow-hidden rounded-[24px]">
                      <img
                        alt="Previsualización premium GGDev"
                        className="h-[420px] w-full object-cover"
                        src={featuredProducts[0].images[0]}
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -left-8 w-[220px] rounded-[28px] border border-white/10 bg-night/90 p-4 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Cierre por WhatsApp
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      Diseños claros, CTA directos y una experiencia lista para captar pedidos
                      desde Instagram o TikTok.
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
          description="Explora universos visuales pensados para creadores, fandoms intensos y perfiles que viven entre redes, comunidad y calle."
          eyebrow="Categorías"
          title="Tu próxima camiseta empieza con una estética clara"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="shell mt-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            description="Una selección con identidad fuerte para entrar rápido, elegir mejor y pedir sin vueltas."
            eyebrow="Diseños listos para vender visual"
            title="Empieza con un diseño que ya tiene presencia"
          />
          <CTAButton to="/catalogo" variant="secondary">
            Ver catálogo completo
          </CTAButton>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="shell mt-24">
        <ExampleGallery items={showcaseExamples} />
      </section>

      <section className="shell mt-16">
        <CommercialCTA
          description="Si ya viste un diseño que te gustó, puedes ir al catálogo, personalizar el tuyo o cerrar de una vez por WhatsApp."
          eyebrow="Siguiente paso"
          title="No te quedes solo en la inspiración. Convierte esa idea en pedido."
        />
      </section>

      <section className="shell mt-24">
        <SectionHeading
          align="center"
          description="Una experiencia pensada para que comprar una camiseta personalizada se sienta clara, seria y fácil de recomendar."
          eyebrow="¿Por qué pedir con GGDev?"
          title="Más confianza, mejor guía y un proceso que sí acompaña"
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
          description="Tanto si vienes con una idea definida como si apenas tienes una referencia, te ayudamos a ordenar el pedido y confirmarlo por WhatsApp."
          eyebrow="Pedido guiado"
          title="El proceso es simple, pero el resultado tiene que sentirse premium."
          whatsappLabel="Hablar por WhatsApp"
        />
      </section>

      <section className="shell mt-24">
        <SectionHeading
          description="Opiniones de clientes que llegaron con una idea, una referencia o un archivo dudoso y terminaron con una prenda lista para presumir."
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
          description="Explora diseños, sube tu idea o abre WhatsApp para confirmar detalles, precio final y entrega con atención real."
          eyebrow="Cierre directo"
          title="GGDev ya está listo para captar tu pedido desde cualquier canal."
          whatsappLabel="Pedir por WhatsApp"
        />
      </section>
    </div>
  );
}
