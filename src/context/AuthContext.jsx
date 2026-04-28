import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  adminAllowedRoles,
  getSupabaseClient,
  hasSupabaseConfig,
  supabaseProfilesTable,
} from "@/lib/supabase";

const AuthContext = createContext(null);

async function fetchProfile(userId) {
  const client = getSupabaseClient();

  if (!client || !userId) {
    return null;
  }

  const { data, error } = await client
    .from(supabaseProfilesTable)
    .select("id, email, full_name, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(hasSupabaseConfig);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setLoading(false);
      return undefined;
    }

    const client = getSupabaseClient();
    let isMounted = true;

    const syncSession = async (nextSession) => {
      if (!isMounted) {
        return;
      }

      setSession(nextSession);

      if (!nextSession?.user) {
        setProfile(null);
        setProfileError("");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const nextProfile = await fetchProfile(nextSession.user.id);

        if (!isMounted) {
          return;
        }

        setProfile(nextProfile);
        setProfileError(
          nextProfile ? "" : "No se encontro el perfil del usuario en Supabase."
        );
      } catch (nextError) {
        if (!isMounted) {
          return;
        }

        setProfile(null);
        setProfileError(
          nextError.message || "No se pudo validar el rol del usuario."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void client.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          throw error;
        }

        return syncSession(data.session || null);
      })
      .catch((nextError) => {
        if (!isMounted) {
          return;
        }

        setSession(null);
        setProfile(null);
        setProfileError(nextError.message || "No se pudo recuperar la sesión.");
        setLoading(false);
      });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      void syncSession(nextSession || null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }) => {
    const client = getSupabaseClient();

    if (!client) {
      throw new Error("Faltan las variables de entorno de Supabase.");
    }

    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const client = getSupabaseClient();

    if (!client) {
      return;
    }

    const { error } = await client.auth.signOut();

    if (error) {
      throw error;
    }
  };

  const user = session?.user || null;
  const role = profile?.role || "";
  const isAdmin = Boolean(user && role && adminAllowedRoles.includes(role));

  const value = useMemo(
    () => ({
      hasSupabaseConfig,
      isAdmin,
      loading,
      profile,
      profileError,
      role,
      session,
      signIn,
      signOut,
      user,
    }),
    [isAdmin, loading, profile, profileError, role, session, signIn, signOut, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
