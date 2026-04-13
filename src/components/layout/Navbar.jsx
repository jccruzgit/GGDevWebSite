import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";
import CTAButton from "@/components/ui/CTAButton";
import { buildGeneralWhatsAppMessage, buildWhatsAppUrl } from "@/utils/whatsapp";

const navItems = [
  { label: "Catalogo", to: "/catalogo" },
  { label: "Personalizar", to: "/personalizar" },
  { label: "Asesoria", to: "/asesoria" },
  { label: "Como pedir", to: "/como-pedir" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const generalWhatsAppUrl = buildWhatsAppUrl(buildGeneralWhatsAppMessage());

  const linkClassName = ({ isActive }) =>
    `text-sm font-medium ${
      isActive ? "text-white" : "text-slate-300 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-night/80 backdrop-blur-xl">
      <div className="shell">
        <div className="flex items-center justify-between gap-3 py-4">
          <Link className="flex items-center gap-3" to="/">
            <BrandLogo
              alt="Inicio GGDev"
              className="shrink-0"
              imgClassName="drop-shadow-[0_0_22px_rgba(39,228,242,0.28)]"
              variant="icon"
            />
            <div className="hidden sm:block">
              <span className="block text-lg font-bold text-white">GGDev</span>
              <span className="block text-xs uppercase tracking-[0.28em] text-slate-400">
                Camisetas premium
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} className={linkClassName} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <CTAButton href={generalWhatsAppUrl} rel="noreferrer" target="_blank">
              WhatsApp
            </CTAButton>
          </div>

          <button
            aria-label={open ? "Cerrar menu" : "Abrir menu"}
            className="inline-flex rounded-full border border-white/10 bg-white/5 p-3 text-slate-200 lg:hidden"
            onClick={() => setOpen((current) => !current)}
            type="button"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <div className="panel mb-4 space-y-4 p-4 lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/6 hover:text-white"
                  }`
                }
                onClick={() => setOpen(false)}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
            <CTAButton
              className="w-full"
              href={generalWhatsAppUrl}
              rel="noreferrer"
              target="_blank"
            >
              WhatsApp
            </CTAButton>
          </div>
        ) : null}
      </div>
    </header>
  );
}
