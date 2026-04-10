import { MessageCircle } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import { buildWhatsAppUrl } from "@/utils/whatsapp";

export default function WhatsAppActionButton({
  children,
  className = "",
  disabled = false,
  message,
  onClick,
  rel = "noreferrer",
  showIcon = true,
  target = "_blank",
  variant = "primary",
  ...props
}) {
  const href = !disabled && !onClick && message ? buildWhatsAppUrl(message) : undefined;

  return (
    <CTAButton
      className={className}
      disabled={disabled}
      href={href}
      onClick={onClick}
      rel={href ? rel : undefined}
      target={href ? target : undefined}
      variant={variant}
      {...props}
    >
      {showIcon ? <MessageCircle className="h-4 w-4" /> : null}
      {children}
    </CTAButton>
  );
}
