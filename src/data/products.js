import { resolveProductGallery } from "@/assets/mockups";
import { createMockGallery } from "@/utils/mockImage";

const sharedSizes = ["S", "M", "L", "XL", "2XL"];
const sharedColors = [
  { name: "Negro eclipse", hex: "#111827" },
  { name: "Blanco polar", hex: "#F5F7FA" },
  { name: "Azul midnight", hex: "#13213B" },
];

const categoryLabels = {
  anime: "Anime",
  devs: "Devs",
  gaming: "Gaming",
  motogp: "MotoGP",
  streetwear: "Streetwear",
  "tech-humor": "Tech Humor",
};

function buildProduct({
  id,
  name,
  category,
  shortDescription,
  description,
  tag,
  featured = false,
  active = true,
  accent,
  glow,
}) {
  const gallery = resolveProductGallery({
    slug: id,
    category,
    fallbackImages: createMockGallery({
      title: name,
      accent,
      glow,
    }),
  });

  return {
    id,
    slug: id,
    name,
    category,
    categoryLabel: categoryLabels[category],
    price: 20,
    shortDescription,
    description,
    availableColors: sharedColors,
    sizes: sharedSizes,
    mainImage: gallery[0],
    secondaryImages: gallery.slice(1),
    tag,
    featured,
    active,
  };
}

export const products = [
  buildProduct({
    id: "legacy-code",
    name: "Legacy Code",
    category: "devs",
    shortDescription: "Humor dev clasico con una lectura limpia y directa sobre negro premium.",
    description:
      "Una camiseta para quienes conviven con sistemas heredados, refactors pendientes y todavia lo llevan con estilo.",
    tag: "Favorito dev",
    featured: true,
    accent: "#7CF8D2",
    glow: "#27E4F2",
  }),
  buildProduct({
    id: "machine-learning",
    name: "Machine Learning",
    category: "devs",
    shortDescription: "Estetica de IA aplicada a una pieza simple, actual y facil de combinar.",
    description:
      "Pensada para perfiles tech que quieren una referencia clara al mundo ML sin cargar demasiado la prenda.",
    tag: "Nuevo lanzamiento",
    accent: "#3AA6FF",
    glow: "#7CF8D2",
  }),
  buildProduct({
    id: "vaporwave-8-bit",
    name: "Vaporwave 8-Bit",
    category: "gaming",
    shortDescription: "Neon retro para setups con personalidad y nostalgia bien pulida.",
    description:
      "Una mezcla entre arcade, glitch controlado y color con identidad gamer premium.",
    tag: "Nuevo lanzamiento",
    featured: true,
    accent: "#3AA6FF",
    glow: "#7CF8D2",
  }),
  buildProduct({
    id: "mainframe-soul",
    name: "Mainframe Soul",
    category: "tech-humor",
    shortDescription: "Diseno elegante para quienes convierten errores en personalidad.",
    description:
      "Inspirado en interfaces crudas, estructuras modulares y una vibra tech con lectura editorial.",
    accent: "#27E4F2",
    glow: "#3AA6FF",
  }),
  buildProduct({
    id: "senor-developer",
    name: "Senor Developer",
    category: "devs",
    shortDescription: "Una referencia con identidad latina y tono geek para destacar sin ruido visual.",
    description:
      "Disenada para quienes mezclan humor, oficio y cultura dev en una pieza facil de reconocer.",
    accent: "#7CF8D2",
    glow: "#3AA6FF",
  }),
  buildProduct({
    id: "glitch-geist-01",
    name: "Glitch Geist 01",
    category: "anime",
    shortDescription: "Estetica espectral y urbana para perfiles visuales mas intensos.",
    description:
      "Combina glitch, narrativa nocturna y una silueta grafica que domina el look completo.",
    tag: "Edicion limitada",
    featured: true,
    accent: "#27E4F2",
    glow: "#7CF8D2",
  }),
  buildProduct({
    id: "github",
    name: "GitHub",
    category: "devs",
    shortDescription: "Un clasico reconocible al instante para perfiles que viven entre repos y ramas.",
    description:
      "Una camiseta directa y funcional para quienes quieren una referencia tech universal con acabado limpio.",
    accent: "#27E4F2",
    glow: "#7CF8D2",
  }),
  buildProduct({
    id: "async-await-ghost",
    name: "Async Await Ghost",
    category: "tech-humor",
    shortDescription: "Una pieza ligera, ingeniosa y lista para conversaciones geek.",
    description:
      "Pensada para destacar sin gritar, con humor de nicho y composicion limpia.",
    accent: "#3AA6FF",
    glow: "#27E4F2",
  }),
  buildProduct({
    id: "tokyo-midnight-run",
    name: "Tokyo Midnight Run",
    category: "motogp",
    shortDescription: "Velocidad urbana con lectura cinematografica y pulso nocturno.",
    description:
      "Trazos de calle, energia mecanica y un tono premium pensado para destacar en reels.",
    tag: "Favorito IG",
    accent: "#7CF8D2",
    glow: "#3AA6FF",
  }),
  buildProduct({
    id: "cyber-ronin-v04",
    name: "Cyber-Ronin V.04",
    category: "streetwear",
    shortDescription: "Streetwear oscuro con identidad futurista y presencia premium.",
    description:
      "Una camiseta para quienes quieren un statement visual fuerte sin perder limpieza de marca.",
    featured: true,
    accent: "#27E4F2",
    glow: "#7CF8D2",
  }),
];

export const activeProducts = products.filter((product) => product.active);

export const featuredProducts = activeProducts.filter((product) => product.featured);

export const showcaseProducts = featuredProducts.slice(0, 6);
