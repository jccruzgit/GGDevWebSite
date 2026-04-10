import { Code2, Flame, Gamepad2, Gauge } from "lucide-react";

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
];

export const sizeOptions = ["XS", "S", "M", "L", "XL", "2XL"];
