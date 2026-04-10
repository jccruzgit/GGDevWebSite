import { createMockGallery } from "@/utils/mockImage";

const sharedSizes = ["S", "M", "L", "XL", "2XL"];
const sharedColors = [
  { name: "Negro eclipse", hex: "#111827" },
  { name: "Blanco polar", hex: "#F5F7FA" },
  { name: "Azul midnight", hex: "#13213B" },
];

export const products = [
  {
    id: "terminal-master",
    slug: "terminal-master",
    name: "Terminal Master",
    category: "devs",
    categoryLabel: "Devs",
    price: 24.9,
    shortDescription: "Minimalismo oscuro con estética de consola y poder silencioso.",
    description:
      "Una pieza insignia para quienes viven entre commits, despliegues y noches largas frente al monitor.",
    colors: sharedColors,
    sizes: sharedSizes,
    featuredTag: "Favorito dev",
    images: createMockGallery({
      title: "Terminal Master",
      accent: "#7CF8D2",
      glow: "#27E4F2",
    }),
  },
  {
    id: "vaporwave-8-bit",
    slug: "vaporwave-8-bit",
    name: "Vaporwave 8-Bit",
    category: "gaming",
    categoryLabel: "Gaming",
    price: 26.5,
    shortDescription: "Neón retro para setups con personalidad y nostalgia bien pulida.",
    description:
      "Una mezcla entre arcade, glitch controlado y color con identidad gamer premium.",
    colors: sharedColors,
    sizes: sharedSizes,
    featuredTag: "Nuevo lanzamiento",
    images: createMockGallery({
      title: "Vaporwave 8-Bit",
      accent: "#3AA6FF",
      glow: "#7CF8D2",
    }),
  },
  {
    id: "mainframe-soul",
    slug: "mainframe-soul",
    name: "Mainframe Soul",
    category: "tech-humor",
    categoryLabel: "Tech Humor",
    price: 23.9,
    shortDescription: "Diseño elegante para quienes convierten errores en personalidad.",
    description:
      "Inspirado en interfaces crudas, estructuras modulares y una vibra tech con lectura editorial.",
    colors: sharedColors,
    sizes: sharedSizes,
    images: createMockGallery({
      title: "Mainframe Soul",
      accent: "#27E4F2",
      glow: "#3AA6FF",
    }),
  },
  {
    id: "null-pointer-protocol",
    slug: "null-pointer-protocol",
    name: "Null Pointer Protocol",
    category: "devs",
    categoryLabel: "Devs",
    price: 25.9,
    shortDescription: "Humor técnico con visual agresivo y acabado de colección.",
    description:
      "Para quienes hablan en stack traces pero quieren vestir con una presencia más seria.",
    colors: sharedColors,
    sizes: sharedSizes,
    images: createMockGallery({
      title: "Null Pointer Protocol",
      accent: "#7CF8D2",
      glow: "#3AA6FF",
    }),
  },
  {
    id: "glitch-geist-01",
    slug: "glitch-geist-01",
    name: "Glitch Geist 01",
    category: "anime",
    categoryLabel: "Anime",
    price: 27.4,
    shortDescription: "Estética espectral y urbana para perfiles visuales más intensos.",
    description:
      "Combina glitch, narrativa nocturna y una silueta gráfica que domina el look completo.",
    colors: sharedColors,
    sizes: sharedSizes,
    featuredTag: "Edición limitada",
    images: createMockGallery({
      title: "Glitch Geist 01",
      accent: "#27E4F2",
      glow: "#7CF8D2",
    }),
  },
  {
    id: "async-await-ghost",
    slug: "async-await-ghost",
    name: "Async Await Ghost",
    category: "tech-humor",
    categoryLabel: "Tech Humor",
    price: 24.5,
    shortDescription: "Una pieza ligera, ingeniosa y lista para conversaciones geek.",
    description:
      "Pensada para destacar sin gritar, con humor de nicho y composición limpia.",
    colors: sharedColors,
    sizes: sharedSizes,
    images: createMockGallery({
      title: "Async Await Ghost",
      accent: "#3AA6FF",
      glow: "#27E4F2",
    }),
  },
  {
    id: "tokyo-midnight-run",
    slug: "tokyo-midnight-run",
    name: "Tokyo Midnight Run",
    category: "motogp",
    categoryLabel: "MotoGP",
    price: 28.9,
    shortDescription: "Velocidad urbana con lectura cinematográfica y pulso nocturno.",
    description:
      "Trazos de calle, energía mecánica y un tono premium pensado para destacar en reels.",
    colors: sharedColors,
    sizes: sharedSizes,
    featuredTag: "Favorito IG",
    images: createMockGallery({
      title: "Tokyo Midnight Run",
      accent: "#7CF8D2",
      glow: "#3AA6FF",
    }),
  },
  {
    id: "cyber-ronin-v04",
    slug: "cyber-ronin-v04",
    name: "Cyber-Ronin V.04",
    category: "streetwear",
    categoryLabel: "Streetwear",
    price: 29.9,
    shortDescription: "Streetwear oscuro con identidad futurista y presencia premium.",
    description:
      "Una camiseta para quienes quieren un statement visual fuerte sin perder limpieza de marca.",
    colors: sharedColors,
    sizes: sharedSizes,
    images: createMockGallery({
      title: "Cyber-Ronin V.04",
      accent: "#27E4F2",
      glow: "#7CF8D2",
    }),
  },
];

export const featuredProducts = products.slice(0, 4);
