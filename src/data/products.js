import { createMockGallery } from "@/utils/mockImage";

const sharedSizes = ["S", "M", "L", "XL", "2XL"];
const sharedColors = [
  { name: "Negro eclipse", hex: "#111827" },
  { name: "Blanco polar", hex: "#F5F7FA" },
  { name: "Azul midnight", hex: "#13213B" },
];

const categoryLabels = {
  devs: "Devs",
  anime: "Anime",
  gaming: "Gaming",
  motogp: "MotoGP",
};

function buildProduct({
  id,
  name,
  category,
  price,
  shortDescription,
  description,
  tag,
  featured = false,
  active = true,
  accent,
  glow,
}) {
  const gallery = createMockGallery({
    title: name,
    accent,
    glow,
  });

  return {
    id,
    slug: id,
    name,
    category,
    categoryLabel: categoryLabels[category],
    price,
    shortDescription,
    description,
    availableColors: sharedColors,
    sizes: sharedSizes,
    mainImage: gallery[0],
    secondaryImages: gallery.slice(1, 3),
    tag,
    featured,
    active,
  };
}

export const products = [
  buildProduct({
    id: "terminal-overdrive-01",
    name: "Terminal Overdrive 01",
    category: "devs",
    price: 24.9,
    shortDescription: "Una pieza oscura con lectura de consola y actitud de build serio.",
    description:
      "Pensada para perfiles dev que quieren una camiseta limpia, técnica y lista para destacar en contenido, eventos o uso diario.",
    tag: "Popular",
    featured: true,
    accent: "#7CF8D2",
    glow: "#27E4F2",
  }),
  buildProduct({
    id: "merge-conflict-club",
    name: "Merge Conflict Club",
    category: "devs",
    price: 25.5,
    shortDescription: "Humor interno para gente que vive entre ramas, fixes y despliegues.",
    description:
      "Un diseño con energía de equipo técnico y personalidad visual clara para quienes convierten errores en identidad.",
    tag: "Destacado",
    accent: "#3AA6FF",
    glow: "#7CF8D2",
  }),
  buildProduct({
    id: "stack-trace-syndicate",
    name: "Stack Trace Syndicate",
    category: "devs",
    price: 26.2,
    shortDescription: "Visual agresivo, contraste fuerte y estética dev de culto.",
    description:
      "Ideal para quienes quieren una pieza con presencia tech más editorial, sin perder el guiño geek que la hace memorable.",
    featured: true,
    accent: "#27E4F2",
    glow: "#3AA6FF",
  }),
  buildProduct({
    id: "oni-signal-v2",
    name: "Oni Signal V2",
    category: "anime",
    price: 27.9,
    shortDescription: "Anime oscuro con vibra urbana y una lectura visual muy marcada.",
    description:
      "Un mockup listo para convertirse en diseño real de línea anime premium, con presencia fuerte tanto en calle como en redes.",
    tag: "Nuevo",
    featured: true,
    accent: "#27E4F2",
    glow: "#7CF8D2",
  }),
  buildProduct({
    id: "mecha-district-77",
    name: "Mecha District 77",
    category: "anime",
    price: 28.4,
    shortDescription: "Capas visuales más densas para un look anime con energía futurista.",
    description:
      "Funciona como base clara para una línea de mockups anime con mayor impacto visual y lectura de colección.",
    accent: "#7CF8D2",
    glow: "#3AA6FF",
  }),
  buildProduct({
    id: "shibuya-afterglow",
    name: "Shibuya Afterglow",
    category: "anime",
    price: 27.4,
    shortDescription: "Neón controlado, composición limpia y espíritu nocturno.",
    description:
      "Pensada para una estética anime más elegante, con balance entre intensidad visual y acabado premium.",
    tag: "Popular",
    accent: "#3AA6FF",
    glow: "#27E4F2",
  }),
  buildProduct({
    id: "arcade-revival-x",
    name: "Arcade Revival X",
    category: "gaming",
    price: 26.9,
    shortDescription: "Retro competitivo con nostalgia bien pulida y presencia de setup.",
    description:
      "Una base ideal para catálogo gaming con personalidad inmediata y visual lista para clips, streams y reels.",
    tag: "Popular",
    featured: true,
    accent: "#3AA6FF",
    glow: "#7CF8D2",
  }),
  buildProduct({
    id: "ranked-night-shift",
    name: "Ranked Night Shift",
    category: "gaming",
    price: 27.2,
    shortDescription: "Gamer nocturno, lectura fuerte y look más maduro que un print casual.",
    description:
      "Sirve como referencia para una línea gaming premium centrada en oscuridad, contraste y actitud seria.",
    accent: "#27E4F2",
    glow: "#3AA6FF",
  }),
  buildProduct({
    id: "lagless-legends",
    name: "Lagless Legends",
    category: "gaming",
    price: 26.7,
    shortDescription: "Una camiseta con pulso competitivo y guiño geek bien dosificado.",
    description:
      "Diseñada para funcionar bien como producto de catálogo y también como futura pieza destacada dentro de la línea gaming.",
    tag: "Destacado",
    accent: "#7CF8D2",
    glow: "#27E4F2",
  }),
  buildProduct({
    id: "apex-chicane-club",
    name: "Apex Chicane Club",
    category: "motogp",
    price: 28.9,
    shortDescription: "Velocidad, líneas de pista y una presencia pensada para destacar.",
    description:
      "Un concepto base para colección racing con lectura premium y ritmo visual fuerte para historias y catálogo.",
    tag: "Destacado",
    featured: true,
    accent: "#7CF8D2",
    glow: "#3AA6FF",
  }),
  buildProduct({
    id: "midnight-paddock",
    name: "Midnight Paddock",
    category: "motogp",
    price: 29.4,
    shortDescription: "MotoGP nocturno con energía de calle y enfoque cinematográfico.",
    description:
      "Pensada para una línea que combine motor, cultura visual y una estética más aspiracional que deportiva genérica.",
    accent: "#27E4F2",
    glow: "#7CF8D2",
  }),
  buildProduct({
    id: "redline-sector-09",
    name: "Redline Sector 09",
    category: "motogp",
    price: 29.9,
    shortDescription: "Una referencia racing más agresiva para perfiles que quieren impacto inmediato.",
    description:
      "Lista para reemplazarse luego por arte final de marca, conservando ya una estructura clara de producto real.",
    tag: "Nuevo",
    featured: true,
    accent: "#3AA6FF",
    glow: "#27E4F2",
  }),
];

export const activeProducts = products.filter((product) => product.active);

export const featuredProducts = activeProducts.filter((product) => product.featured);

export const showcaseProducts = featuredProducts.slice(0, 6);
