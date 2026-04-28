import { Code2, Disc3, Flame, Gamepad2, Gauge, Sparkles } from "lucide-react";

export const categories = [
  {
    id: "devs",
    name: "Devs",
    description: "Consola, terminal, humor técnico y una estética limpia con identidad creadora.",
    accent: "from-mint via-aqua to-cyan",
    icon: Code2,
  },
  {
    id: "anime",
    name: "Anime",
    description: "Vibra intensa, contraste fuerte y mockups listos para evolucionar a colección real.",
    accent: "from-cyan via-aqua to-mint",
    icon: Flame,
  },
  {
    id: "bands",
    name: "Metal",
    description: "Diseños con alma de rock y heavy metal, inspirados en portadas, giras, riffs y símbolos con actitud.",
    accent: "from-aqua via-mint to-cyan",
    icon: Disc3,
  },
  {
    id: "gaming",
    name: "Gaming",
    description: "Diseños que se sienten competitivos, oscuros y listos para destacar en contenido.",
    accent: "from-aqua via-cyan to-mint",
    icon: Gamepad2,
  },
  {
    id: "motogp",
    name: "MotoGP",
    description: "Velocidad, lectura visual premium y energía de pista para una línea con actitud.",
    accent: "from-cyan via-mint to-aqua",
    icon: Gauge,
  },
  {
    id: "custom",
    name: "Personalizados",
    description: "Diseños nacidos de referencias, mezclas de estilos y cruces entre las categorías principales.",
    accent: "from-mint via-cyan to-aqua",
    icon: Sparkles,
  },
];

export const sizeOptions = ["XS", "S", "M", "L", "XL", "2XL"];
