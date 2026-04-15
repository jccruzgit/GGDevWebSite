import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { hasSupabaseConfig } from "@/lib/supabase";
import { fetchPublicCatalogProducts } from "@/services/catalogService";

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [remoteProducts, setRemoteProducts] = useState([]);
  const [loading, setLoading] = useState(hasSupabaseConfig);
  const [error, setError] = useState("");

  const refreshProducts = async () => {
    if (!hasSupabaseConfig) {
      setRemoteProducts([]);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);

    try {
      const nextProducts = await fetchPublicCatalogProducts();
      setRemoteProducts(nextProducts);
      setError("");
    } catch (nextError) {
      setRemoteProducts([]);
      setError(nextError.message || "No se pudo cargar el catalogo remoto.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshProducts();
  }, []);

  const products = useMemo(() => remoteProducts, [remoteProducts]);
  const activeProducts = useMemo(() => products.filter((product) => product.active), [products]);
  const featuredProducts = useMemo(
    () => activeProducts.filter((product) => product.featured),
    [activeProducts]
  );
  const showcaseProducts = useMemo(() => featuredProducts.slice(0, 6), [featuredProducts]);

  const value = useMemo(
    () => ({
      activeProducts,
      error,
      featuredProducts,
      loading,
      products,
      refreshProducts,
      showcaseProducts,
      staticProducts: [],
    }),
    [activeProducts, error, featuredProducts, loading, products, refreshProducts, showcaseProducts]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);

  if (!context) {
    throw new Error("useCatalog debe usarse dentro de CatalogProvider");
  }

  return context;
}
