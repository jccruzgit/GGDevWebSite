import {
  Code2,
  Flame,
  Gamepad2,
  Gauge,
  Laptop,
  Palette,
  Shirt,
  Trophy,
} from "lucide-react";

export const categories = [
  {
    id: "devs",
    name: "Devs",
    description: "Gráficos limpios, terminales, bugs con estilo y actitud creadora.",
    accent: "from-mint via-aqua to-cyan",
    icon: Code2,
  },
  {
    id: "anime",
    name: "Anime",
    description: "Vibra intensa, trazos vibrantes y presencia de culto visual.",
    accent: "from-cyan via-aqua to-mint",
    icon: Flame,
  },
  {
    id: "gaming",
    name: "Gaming",
    description: "Diseños que se sienten competitivos, épicos y listos para destacar.",
    accent: "from-aqua via-cyan to-mint",
    icon: Gamepad2,
  },
  {
    id: "f1",
    name: "F1",
    description: "Velocidad, trazos aerodinámicos y energía de paddock premium.",
    accent: "from-mint via-cyan to-aqua",
    icon: Trophy,
  },
  {
    id: "motogp",
    name: "MotoGP",
    description: "Diseños agresivos con lectura rápida y carácter de pista.",
    accent: "from-cyan via-mint to-aqua",
    icon: Gauge,
  },
  {
    id: "streetwear",
    name: "Streetwear",
    description: "Actitud urbana, cortes limpios y piezas hechas para destacar.",
    accent: "from-aqua via-mint to-cyan",
    icon: Shirt,
  },
  {
    id: "tech-humor",
    name: "Tech Humor",
    description: "Humor geek que se entiende en una mirada y se recuerda dos veces.",
    accent: "from-mint via-aqua to-cyan",
    icon: Laptop,
  },
  {
    id: "personalizados",
    name: "Personalizados",
    description: "Tu idea convertida en prenda con soporte visual y técnico.",
    accent: "from-cyan via-aqua to-mint",
    icon: Palette,
  },
];

export const sizeOptions = ["XS", "S", "M", "L", "XL", "2XL"];
