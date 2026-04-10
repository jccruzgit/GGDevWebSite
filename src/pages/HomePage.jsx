import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";
import WhatsAppCTA from "@/components/ui/WhatsAppCTA";
import CategoryCard from "@/components/home/CategoryCard";
import ProductCard from "@/components/catalog/ProductCard";
import TestimonialCard from "@/components/home/TestimonialCard";
import InfoCard from "@/components/ui/InfoCard";
import { categories } from "@/data/categories";
import { featuredProducts } from "@/data/products";
import { processSteps } from "@/data/processSteps";
import { testimonials } from "@/data/testimonials";

const trustItems = [
  {
    icon: Sparkles,
    title: "Revisión estética incluida",
    description:
      "Si tu idea necesita orden visual, nosotros te guiamos antes de producir para que el resultado se vea realmente premium.",
  },
  {
    icon: WandSparkles,
    title: "Optimización para impresión",
    description:
      "Te orientamos sobre tamaño, resolución y contraste para evitar camisetas con acabado improvisado.",
  },
  {
    icon: ShieldCheck,
    title: "Acompañamiento directo",
    description:
      "El cierre del pedido es por WhatsApp con asesoría real, sin procesos fríos ni pasos innecesarios.",
  },
];

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
              Camisetas personalizadas con ADN tech, anime, motor y gaming para gente que quiere
              verse como marca, no como algo genérico.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTAButton to="/catalogo">
                Elegir diseño
                <ArrowRight className="h-4 w-4" />
              </CTAButton>
              <CTAButton to="/personalizar" variant="secondary">
                Subir mi imagen
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
                <p className="text-2xl font-bold text-white">DTF</p>
                <p className="mt-1 text-sm text-slate-400">Alta definición</p>
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
                      Velocidad nocturna, lectura fuerte y estética lista para destacar en redes.
                    </p>
                  </div>
                  <div className="rounded-[28px] border border-aqua/15 bg-aqua/8 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Soporte real</p>
                    <p className="mt-2 text-lg font-semibold text-white">Te ayudamos a refinar</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Si el arte no está listo, lo ajustamos contigo antes de producir.
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
                      Vibra premium
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      Previsualizaciones protagonistas, contraste alto y botones claros para cerrar por
                      WhatsApp.
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
            description="Una selección con presencia fuerte para quienes quieren empezar rápido sin sacrificar identidad."
            eyebrow="Diseños legendarios"
            title="Diseños listos para pedir"
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
        <SectionHeading
          align="center"
          description="Un flujo simple para que la experiencia se sienta premium, clara y rápida desde el primer clic."
          eyebrow="Cómo forjar tu estilo"
          title="Tres pasos para llevar tu idea a camiseta"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {processSteps.slice(0, 3).map((step) => (
            <InfoCard
              key={step.id}
              className="h-full"
              description={step.description}
              icon={step.icon}
              title={`${step.id}. ${step.title}`}
            />
          ))}
        </div>
      </section>

      <section className="shell mt-24">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="panel p-8 sm:p-10">
            <span className="eyebrow">Asesoría de diseño</span>
            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
              Si tu archivo no está perfecto, no te dejamos solo.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              GGDev revisa resolución, ubicación del arte, proporción y contraste para que la
              pieza final conserve fuerza visual tanto en foto como en uso real.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CTAButton to="/asesoria">Quiero asesoría</CTAButton>
              <WhatsAppCTA variant="secondary">Hablar con GGDev</WhatsAppCTA>
            </div>
          </div>
          <div className="grid gap-4">
            {trustItems.map((item) => (
              <InfoCard key={item.title} {...item} />
            ))}
          </div>
        </div>
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
        <div className="panel flex flex-col items-start justify-between gap-6 overflow-hidden p-8 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <span className="eyebrow">Cierre directo</span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Pide por WhatsApp y termina tu pedido sin vueltas.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              Explora, personaliza y envía tu pedido con una conversación clara. Nada de pagos en
              línea por ahora; aquí el proceso se confirma contigo.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <CTAButton to="/catalogo">Explorar catálogo</CTAButton>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:border-aqua/30 hover:bg-white/10"
              to="/personalizar"
            >
              Ir al configurador
              <MessageCircle className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
