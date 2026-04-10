import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Music2 } from "lucide-react";
import logoMark from "@/assets/logo-mark.svg";
import { siteConfig } from "@/data/site";
import { buildWhatsAppUrl } from "@/utils/whatsapp";

const links = [
  { label: "Inicio", to: "/" },
  { label: "Catálogo", to: "/catalogo" },
  { label: "Personalizar", to: "/personalizar" },
  { label: "Asesoría", to: "/asesoria" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/8 pb-10 pt-14">
      <div className="shell">
        <div className="panel grid gap-10 p-8 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <img alt="Logo GGDev" className="h-12 w-12 rounded-2xl" src={logoMark} />
              <div>
                <p className="text-lg font-bold text-white">GGDev</p>
                <p className="text-sm text-slate-400">Camisetas personalizadas con vibra premium</p>
              </div>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
              Diseños tech, anime, gaming y motor con una experiencia directa por WhatsApp para
              ayudarte a elegir, adaptar y pedir sin complicaciones.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
              Explora
            </p>
            <div className="mt-4 space-y-3">
              {links.map((item) => (
                <Link
                  key={item.to}
                  className="block text-sm text-slate-300 hover:text-white"
                  to={item.to}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
              Contacto
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                aria-label="Instagram"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 hover:border-aqua/30 hover:text-white"
                href={siteConfig.instagram}
                rel="noreferrer"
                target="_blank"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                aria-label="TikTok"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 hover:border-aqua/30 hover:text-white"
                href={siteConfig.tiktok}
                rel="noreferrer"
                target="_blank"
              >
                <Music2 className="h-4 w-4" />
              </a>
              <a
                aria-label="WhatsApp"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 hover:border-aqua/30 hover:text-white"
                href={buildWhatsAppUrl("Hola GGDev, quiero más información sobre sus camisetas.")}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-5 text-sm text-slate-400">{siteConfig.email}</p>
          </div>
        </div>
        <p className="mt-6 text-center text-xs uppercase tracking-[0.24em] text-slate-500">
          GGDev · Diseñado para destacar en publicaciones, historias y calle
        </p>
      </div>
    </footer>
  );
}
