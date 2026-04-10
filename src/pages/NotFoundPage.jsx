import CTAButton from "@/components/ui/CTAButton";

export default function NotFoundPage() {
  return (
    <div className="shell pt-16">
      <div className="panel mx-auto max-w-3xl p-10 text-center">
        <span className="eyebrow">Ruta no encontrada</span>
        <h1 className="mt-5 text-4xl font-bold text-white">Esta pantalla se perdió en el grid</h1>
        <p className="mt-4 text-base leading-8 text-slate-300">
          Regresa al inicio o entra al catálogo para seguir explorando camisetas con sello GGDev.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <CTAButton to="/">Volver al inicio</CTAButton>
          <CTAButton to="/catalogo" variant="secondary">
            Ver catálogo
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
