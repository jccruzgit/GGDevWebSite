import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const { hasSupabaseConfig, isAdmin, loading, profileError, session, signIn } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (session && isAdmin) {
    return <Navigate replace to="/admin" />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await signIn(form);
    } catch (nextError) {
      setError(nextError.message || "No fue posible iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="shell py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="panel surface-grid overflow-hidden p-8 sm:p-10">
          <span className="eyebrow">
            <ShieldCheck className="h-3.5 w-3.5" />
            Panel privado
          </span>
          <h1 className="mt-6 text-4xl font-bold sm:text-5xl">
            Admin para cargar diseños sin tocar código
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            La ruta queda protegida con Supabase Auth y pensada para escalar luego a roles,
            reportes, pedidos y otros módulos internos.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="panel-soft p-5">
              <p className="text-sm font-semibold text-white">Qué resuelve desde hoy</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Alta de productos, subida de imagen principal y publicación directa al catálogo.
              </p>
            </div>
            <div className="panel-soft p-5">
              <p className="text-sm font-semibold text-white">Listo para crecer</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                La base ya contempla perfiles, roles, storage y una estructura compatible con
                futuras vistas de reportes u operaciones.
              </p>
            </div>
          </div>

          {!hasSupabaseConfig ? (
            <div className="panel-soft mt-8 border border-amber-400/20 bg-amber-400/10 p-5">
              <p className="text-sm font-semibold text-white">
                Falta conectar Supabase para habilitar el admin
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Crea un proyecto en Supabase y luego completa `VITE_SUPABASE_URL` y
                `VITE_SUPABASE_ANON_KEY` usando el archivo `.env.example`.
              </p>
            </div>
          ) : null}

          {session && !isAdmin ? (
            <div className="panel-soft mt-8 border border-amber-400/20 bg-amber-400/10 p-5">
              <p className="text-sm font-semibold text-white">Tu usuario no tiene rol admin</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {profileError ||
                  "Tu cuenta inició sesión, pero necesitas un perfil con rol `owner` o `admin` en la tabla profiles."}
              </p>
            </div>
          ) : null}
        </section>

        <section className="panel p-8 sm:p-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-slate-950">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Entrar al admin</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Usa tu cuenta de Supabase Auth. Si aún no existe, primero debes crearla desde el
            dashboard de Supabase.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-3 block text-sm font-semibold text-white">Correo</span>
              <input
                className="w-full rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aqua/40 focus:outline-none"
                disabled={!hasSupabaseConfig || loading || submitting}
                name="email"
                onChange={handleChange}
                placeholder="admin@ggdev.com"
                type="email"
                value={form.email}
              />
            </label>

            <label className="block">
              <span className="mb-3 block text-sm font-semibold text-white">Contraseña</span>
              <input
                className="w-full rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aqua/40 focus:outline-none"
                disabled={!hasSupabaseConfig || loading || submitting}
                name="password"
                onChange={handleChange}
                placeholder="Tu contraseña"
                type="password"
                value={form.password}
              />
            </label>

            {error ? (
              <div className="rounded-[20px] border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            <button
              className="inline-flex w-full items-center justify-center rounded-full bg-brand-gradient px-5 py-3 text-sm font-semibold text-slate-950 button-glow disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!hasSupabaseConfig || loading || submitting}
              type="submit"
            >
              {submitting ? "Entrando..." : "Iniciar sesión"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
