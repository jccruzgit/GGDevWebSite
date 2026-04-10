import { siteConfig } from "@/data/site";

function cleanPhoneNumber(value) {
  return value.replace(/[^\d]/g, "");
}

function encodeMessage(message) {
  return encodeURIComponent(message.trim());
}

export function buildWhatsAppUrl(message) {
  const phone = cleanPhoneNumber(siteConfig.whatsappNumber);
  return `https://wa.me/${phone}?text=${encodeMessage(message)}`;
}

export function buildProductMessage({
  productName,
  size,
  color,
  quantity,
  notes,
}) {
  return `
Hola GGDev, quiero pedir este diseño:

Diseño: ${productName}
Talla: ${size || "Por definir"}
Color de prenda: ${color || "Por definir"}
Cantidad: ${quantity || 1}
Notas: ${notes || "Sin notas adicionales"}

Quiero confirmar disponibilidad y tiempo de entrega.
  `;
}

export function buildCustomizerMessage({
  placement,
  garmentColor,
  fileName,
  notes,
}) {
  return `
Hola GGDev, quiero personalizar una camiseta.

Vista elegida: ${placement}
Color de prenda: ${garmentColor}
Archivo: ${fileName || "Pendiente de compartir"}
Detalles: ${notes || "Quiero asesoría sobre tamaño y ubicación del diseño."}

Necesito apoyo para finalizar mi pedido.
  `;
}

export function buildAdvisoryMessage({ name, subject, message }) {
  return `
Hola GGDev, necesito asesoría.

Nombre: ${name || "Sin nombre"}
Asunto: ${subject || "Consulta general"}
Mensaje: ${message || "Quiero ayuda para elegir o adaptar un diseño."}
  `;
}
