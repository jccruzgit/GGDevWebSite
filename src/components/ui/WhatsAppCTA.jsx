import WhatsAppActionButton from "@/components/ui/WhatsAppActionButton";
import { buildGeneralWhatsAppMessage } from "@/utils/whatsapp";

export default function WhatsAppCTA({
  message = buildGeneralWhatsAppMessage(),
  children = "Escribir por WhatsApp",
  variant = "primary",
  className = "",
}) {
  return (
    <WhatsAppActionButton className={className} message={message} variant={variant}>
      {children}
    </WhatsAppActionButton>
  );
}
