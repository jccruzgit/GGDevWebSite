import {
  ImagePlus,
  MessageCircleMore,
  PackageCheck,
  Palette,
  ShieldCheck,
  Shirt,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { createMockGallery } from "@/utils/mockImage";

export const showcaseExamples = [
  {
    id: "cyber-ronin-street",
    name: "Cyber-Ronin fit",
    category: "Streetwear",
    image: createMockGallery({
      title: "Cyber-Ronin V.04",
      accent: "#27E4F2",
      glow: "#7CF8D2",
    })[0],
  },
  {
    id: "tokyo-midnight-reel",
    name: "Tokyo reel look",
    category: "MotoGP",
    image: createMockGallery({
      title: "Tokyo Midnight Run",
      accent: "#7CF8D2",
      glow: "#3AA6FF",
    })[1],
  },
  {
    id: "terminal-minimal",
    name: "Terminal clean drop",
    category: "Devs",
    image: createMockGallery({
      title: "Terminal Master",
      accent: "#7CF8D2",
      glow: "#27E4F2",
    })[2],
  },
  {
    id: "glitch-anime",
    name: "Glitch anime shot",
    category: "Anime",
    image: createMockGallery({
      title: "Glitch Geist 01",
      accent: "#27E4F2",
      glow: "#7CF8D2",
    })[0],
  },
  {
    id: "vaporwave-gaming",
    name: "Vaporwave setup drop",
    category: "Gaming",
    image: createMockGallery({
      title: "Vaporwave 8-Bit",
      accent: "#3AA6FF",
      glow: "#7CF8D2",
    })[1],
  },
  {
    id: "async-humor",
    name: "Humor geek premium",
    category: "Tech Humor",
    image: createMockGallery({
      title: "Async Await Ghost",
      accent: "#3AA6FF",
      glow: "#27E4F2",
    })[2],
  },
];

export const commercialBenefits = [
  {
    icon: MessageCircleMore,
    title: "Atención real por WhatsApp",
    description:
      "Hablas con nosotros para aterrizar el pedido, resolver dudas y confirmar tiempos sin formularios eternos.",
  },
  {
    icon: Shirt,
    title: "Diseños listos o personalizados",
    description:
      "Puedes pedir una camiseta del catálogo o traer tu propia idea para convertirla en una prenda con presencia.",
  },
  {
    icon: WandSparkles,
    title: "Asesoría con tu imagen",
    description:
      "Si tu archivo necesita ajuste visual, te guiamos con tamaño, contraste y ubicación antes de producir.",
  },
  {
    icon: PackageCheck,
    title: "Producción bajo pedido",
    description:
      "Cada pedido se confirma contigo primero, para cuidar el acabado final y evitar decisiones improvisadas.",
  },
  {
    icon: Sparkles,
    title: "Estilo premium y atención cercana",
    description:
      "La experiencia está pensada para que se sienta seria, visualmente cuidada y lista para cerrar desde redes.",
  },
];

export const commercialSteps = [
  {
    id: 1,
    icon: ImagePlus,
    title: "Eliges un diseño o subes tu idea",
    description:
      "Empiezas desde el catálogo o nos mandas tu referencia para trabajar una camiseta con identidad clara.",
  },
  {
    id: 2,
    icon: Palette,
    title: "Definimos detalles contigo",
    description:
      "Revisamos color de prenda, ubicación del arte, talla y cualquier ajuste para que el resultado se vea sólido.",
  },
  {
    id: 3,
    icon: MessageCircleMore,
    title: "Confirmamos todo por WhatsApp",
    description:
      "Te respondemos con una conversación directa para validar disponibilidad, precio final y tiempos.",
  },
  {
    id: 4,
    icon: PackageCheck,
    title: "Producimos y coordinamos entrega",
    description:
      "Una vez aprobado el pedido, pasamos a producción y cerramos contigo la entrega sin pasos innecesarios.",
  },
];

export const productTrustItems = [
  {
    icon: ShieldCheck,
    title: "Pedido validado antes de producir",
    description:
      "No pasamos directo a impresión. Primero revisamos contigo talla, color y notas para evitar errores.",
  },
  {
    icon: WandSparkles,
    title: "Soporte visual para tu diseño",
    description:
      "Si quieres mover el arte, ajustar tamaño o comparar colores, te ayudamos antes de cerrar el pedido.",
  },
  {
    icon: Sparkles,
    title: "Acabado pensado para destacar",
    description:
      "La idea es que la camiseta se vea bien en fotos, historias, reels y también en uso real.",
  },
];
