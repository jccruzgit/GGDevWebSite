import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CatalogProvider } from "@/context/CatalogContext";
import AppRouter from "@/routes/AppRouter";
import { CustomizerProvider } from "@/context/CustomizerContext";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <CatalogProvider>
          <CustomizerProvider>
            <AppRouter />
          </CustomizerProvider>
        </CatalogProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
