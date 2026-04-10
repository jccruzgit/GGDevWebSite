const defaultMessage =
  "Te responderemos por WhatsApp para confirmar detalles, precio final y entrega.";

export default function WhatsAppResponseNote({
  children = defaultMessage,
  className = "",
}) {
  return <p className={`text-sm leading-6 text-slate-400 ${className}`}>{children}</p>;
}
