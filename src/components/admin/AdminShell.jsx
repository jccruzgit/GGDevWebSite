import { Link, Outlet } from "react-router-dom";
import { LogOut, ShieldCheck, Store } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminShell() {
  const { profile, role, signOut, user } = useAuth();

  return (
    <div className="shell py-8">
      <div className="panel surface-grid overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="eyebrow">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin GGDev
            </span>
            <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
              Control de catálogo y diseños
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Este panel ya queda listo para crecer con más módulos, roles y reportes sin mezclar
              la capa pública con la administración.
            </p>
          </div>

          <div className="panel-soft flex flex-col gap-4 p-5 sm:min-w-[320px]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Sesión actual
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {profile?.full_name || user?.email || "Administrador"}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Rol: <span className="font-semibold text-aqua">{role || "Sin rol"}</span>
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:border-aqua/30 hover:text-aqua"
                to="/catalogo"
              >
                <Store className="h-4 w-4" />
                Ver sitio
              </Link>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 py-3 text-sm font-semibold text-slate-950 button-glow hover:scale-[1.01]"
                onClick={() => void signOut()}
                type="button"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}
