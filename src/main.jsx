import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import AppRouter from "@/routes/AppRouter";
import { CustomizerProvider } from "@/context/CustomizerContext";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <CustomizerProvider>
        <AppRouter />
      </CustomizerProvider>
    </HashRouter>
  </React.StrictMode>
);
