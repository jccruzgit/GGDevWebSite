import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/routes/AppRouter";
import { CustomizerProvider } from "@/context/CustomizerContext";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomizerProvider>
        <AppRouter />
      </CustomizerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
