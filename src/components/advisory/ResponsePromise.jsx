import { Clock3, Sparkles, ShieldCheck } from "lucide-react";
import InfoCard from "@/components/ui/InfoCard";

const items = [
  {
    icon: Sparkles,
    title: "Revisión visual real",
    description: "Te ayudamos a decidir tamaño, ubicación y lectura del diseño antes de producir.",
  },
  {
    icon: ShieldCheck,
    title: "Ajuste para impresión",
    description: "Validamos resolución, contraste y composición para que la camiseta salga limpia.",
  },
  {
    icon: Clock3,
    title: "Respuesta ágil",
    description: "Atención por WhatsApp con tiempos claros para destrabar tu pedido rápido.",
  },
];

export default function ResponsePromise() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <InfoCard key={item.title} {...item} />
      ))}
    </div>
  );
}
