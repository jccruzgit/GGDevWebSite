import { MessageCircle } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import { buildWhatsAppUrl } from "@/utils/whatsapp";

export default function WhatsAppCTA({
  message = "Hola GGDev, quiero recibir asesoría para mi camiseta.",
  children = "Escribir por WhatsApp",
  variant = "primary",
  className = "",
}) {
  return (
    <CTAButton
      className={className}
      href={buildWhatsAppUrl(message)}
      rel="noreferrer"
      target="_blank"
      variant={variant}
    >
      <MessageCircle className="h-4 w-4" />
      {children}
    </CTAButton>
  );
}
