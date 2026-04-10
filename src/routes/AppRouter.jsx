import { Route, Routes } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/pages/HomePage";
import CatalogPage from "@/pages/CatalogPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CustomizerPage from "@/pages/CustomizerPage";
import AdvisoryPage from "@/pages/AdvisoryPage";
import HowToOrderPage from "@/pages/HowToOrderPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/producto/:id" element={<ProductDetailPage />} />
        <Route path="/personalizar" element={<CustomizerPage />} />
        <Route path="/asesoria" element={<AdvisoryPage />} />
        <Route path="/como-pedir" element={<HowToOrderPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
