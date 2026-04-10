import { siteConfig } from "@/data/site";

function cleanPhoneNumber(value = "") {
  return value.replace(/[^\d]/g, "");
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function sentenceCase(value) {
  const text = normalizeText(value);

  if (!text) {
    return "";
  }

  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

function encodeMessage(message) {
  return encodeURIComponent(normalizeText(message));
}

function joinLines(lines) {
  return lines.filter(Boolean).join("\n").trim();
}

function joinSections(sections) {
  return sections.filter(Boolean).join("\n\n").trim();
}

function formatQuantity(value) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

export function buildWhatsAppUrl(message, phoneNumber = siteConfig.whatsappNumber) {
  const phone = cleanPhoneNumber(phoneNumber);
  return `https://wa.me/${phone}?text=${encodeMessage(message)}`;
}

export function openWhatsApp(message, options = {}) {
  const { phoneNumber, target = "_blank" } = options;
  const url = buildWhatsAppUrl(message, phoneNumber);

  if (typeof window !== "undefined") {
    if (target === "_self") {
      window.location.assign(url);
    } else {
      window.open(url, target, "noopener,noreferrer");
    }
  }

  return url;
}

export function buildProductOrderMessage({
  productName,
  size,
  color,
  quantity,
  notes,
}) {
  return joinSections([
    "Hola, quiero pedir esta camiseta de GGDev.",
    joinLines([
      `Diseño: ${normalizeText(productName) || "Por definir"}`,
      `Talla: ${normalizeText(size) || "Por definir"}`,
      `Color: ${normalizeText(color) || "Por definir"}`,
      `Cantidad: ${formatQuantity(quantity)}`,
      `Notas: ${normalizeText(notes) || "Sin notas adicionales"}`,
    ]),
    "¿Me pueden confirmar disponibilidad y tiempo de entrega?",
  ]);
}

export function buildCustomizerMessage({
  placement,
  garmentColor,
  fileName,
  scale,
  opacity,
  notes,
}) {
  const hasFile = Boolean(normalizeText(fileName));
  const normalizedNotes = normalizeText(notes);

  return joinSections([
    "Hola, quiero personalizar una camiseta con mi propio diseño.",
    joinLines([
      "Tipo de solicitud: Diseño personalizado",
      `Color de prenda: ${normalizeText(garmentColor) || "Por definir"}`,
      `Lado del diseño: ${sentenceCase(placement) || "Por definir"}`,
      hasFile
        ? `Archivo cargado: ${normalizeText(fileName)}`
        : "Archivo cargado: Aún no he subido una imagen.",
      scale ? `Tamaño aproximado en vista previa: ${Math.round(scale * 100)}%` : "",
      opacity ? `Opacidad de vista previa: ${Math.round(opacity * 100)}%` : "",
      `Notas: ${
        normalizedNotes || "Necesito ayuda para definir tamaño, ubicación y acabado del diseño."
      }`,
    ]),
    hasFile
      ? "Necesito ayuda para confirmar tamaño, calidad del archivo y tiempo de producción."
      : "Todavía no tengo el archivo listo y necesito ayuda para prepararlo.",
  ]);
}

export function buildAdvisoryMessage({ name, subject, message }) {
  return joinSections([
    "Hola, necesito asesoría con mi diseño.",
    joinLines([
      `Nombre: ${normalizeText(name) || "No indicado"}`,
      `Asunto: ${normalizeText(subject) || "Consulta general"}`,
      `Mensaje: ${normalizeText(message) || "Quiero ayuda para aterrizar mi idea."}`,
    ]),
  ]);
}

export function buildSupportMessage({ intro, details = [], closing }) {
  return joinSections([
    normalizeText(intro) || "Hola, quiero ayuda con mi pedido de GGDev.",
    joinLines(details),
    normalizeText(closing) || "Quedo atento para continuar por WhatsApp.",
  ]);
}

export function buildGeneralWhatsAppMessage() {
  return buildSupportMessage({
    intro: "Hola, quiero pedir una camiseta de GGDev.",
    closing: "Me gustaría confirmar modelos disponibles, precio final y entrega.",
  });
}

export const buildProductMessage = buildProductOrderMessage;
