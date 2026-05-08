import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

function normalizeBasePath(value, fallback = "/GGDevWebSite/") {
  const basePath = (value || fallback).trim();

  if (!basePath) {
    return fallback;
  }

  const withLeadingSlash = basePath.startsWith("/") ? basePath : `/${basePath}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = normalizeBasePath(env.VITE_SITE_BASE_PATH, "/GGDevWebSite/");

  return {
    // GitHub Pages sigue usando /GGDevWebSite/ por defecto.
    // Cuando migres a dominio propio en la raiz, usa VITE_SITE_BASE_PATH=/.
    base,
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
