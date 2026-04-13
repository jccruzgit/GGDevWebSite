import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function AccessPanel({ title, description }) {
  return (
    <div className="shell py-12">
      <div className="panel mx-auto max-w-2xl p-8 text-center sm:p-10">
        <span className="eyebrow">Acceso admin</span>
        <h1 className="mt-5 text-3xl font-bold text-white">{title}</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">{description}</p>
      </div>
    </div>
  );
}

export default function ProtectedAdminRoute() {
  const { hasSupabaseConfig, isAdmin, loading, profileError, session } = useAuth();

  if (!hasSupabaseConfig) {
    return <Navigate replace to="/admin/login" />;
  }

  if (loading) {
    return (
      <AccessPanel
        description="Estamos validando tu sesion y cargando los permisos del panel."
        title="Verificando acceso"
      />
    );
  }

  if (!session) {
    return <Navigate replace to="/admin/login" />;
  }

  if (!isAdmin) {
    return (
      <AccessPanel
        description={
          profileError ||
          "Tu usuario existe, pero no tiene un rol valido para administrar el catalogo."
        }
        title="Sin permisos para entrar al admin"
      />
    );
  }

  return <Outlet />;
}
