import { createContext, useContext, useMemo, useState } from "react";

const CustomizerContext = createContext(null);

const initialState = {
  placement: "frente",
  garmentColor: "#111827",
  scale: 1,
  opacity: 1,
  offsetX: 0,
  offsetY: 0,
  fileName: "",
  image: "",
};

export function CustomizerProvider({ children }) {
  const [state, setState] = useState(initialState);

  const setPlacement = (placement) => {
    setState((current) => ({ ...current, placement }));
  };

  const setGarmentColor = (garmentColor) => {
    setState((current) => ({ ...current, garmentColor }));
  };

  const setOpacity = (opacity) => {
    setState((current) => ({ ...current, opacity }));
  };

  const zoomIn = () => {
    setState((current) => ({
      ...current,
      scale: Math.min(Number((current.scale + 0.1).toFixed(2)), 2.4),
    }));
  };

  const zoomOut = () => {
    setState((current) => ({
      ...current,
      scale: Math.max(Number((current.scale - 0.1).toFixed(2)), 0.6),
    }));
  };

  const centerImage = () => {
    setState((current) => ({ ...current, offsetX: 0, offsetY: 0 }));
  };

  const resetCustomizer = () => {
    setState((current) => ({
      ...initialState,
      image: current.image,
      fileName: current.fileName,
    }));
  };

  const setImageFromFile = (file) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setState((current) => ({
        ...current,
        image: reader.result,
        fileName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const value = useMemo(
    () => ({
      ...state,
      setPlacement,
      setGarmentColor,
      setOpacity,
      zoomIn,
      zoomOut,
      centerImage,
      resetCustomizer,
      setImageFromFile,
    }),
    [state]
  );

  return (
    <CustomizerContext.Provider value={value}>
      {children}
    </CustomizerContext.Provider>
  );
}

export function useCustomizer() {
  const context = useContext(CustomizerContext);

  if (!context) {
    throw new Error("useCustomizer debe usarse dentro de CustomizerProvider");
  }

  return context;
}
