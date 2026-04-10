import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // GitHub Pages sirve el sitio bajo /<repo>/, no desde la raiz del dominio.
  base: "/GGDevWebSite/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
