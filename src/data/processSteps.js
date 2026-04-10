import {
  ImagePlus,
  Shirt,
  Send,
  MessageCircleMore,
  PackageCheck,
} from "lucide-react";

export const processSteps = [
  {
    id: 1,
    title: "Elige o sube tu diseño",
    description:
      "Explora el catálogo o trae tu propio arte para convertirlo en una camiseta con sello GGDev.",
    icon: ImagePlus,
  },
  {
    id: 2,
    title: "Personaliza tu prenda",
    description:
      "Define color, frente o espalda y déjanos ayudarte a ajustar posición, tamaño y presencia visual.",
    icon: Shirt,
  },
  {
    id: 3,
    title: "Envía el pedido",
    description:
      "Manda los detalles por WhatsApp y deja claras tus preferencias de talla, color y cantidad.",
    icon: Send,
  },
  {
    id: 4,
    title: "Confirmamos por WhatsApp",
    description:
      "Revisamos contigo cualquier ajuste técnico, resolvemos dudas y validamos la producción.",
    icon: MessageCircleMore,
  },
  {
    id: 5,
    title: "Producción y entrega",
    description:
      "Fabricamos tu prenda y coordinamos la entrega con una experiencia directa y sin fricción.",
    icon: PackageCheck,
  },
];
