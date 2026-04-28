import { createContext, useContext, useMemo, useState } from "react";

const CustomizerContext = createContext(null);
const maxOffset = 40;

const initialState = {
  placement: "frente",
  garmentColor: "#F5F7FA",
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  file: null,
  fileName: "",
  image: "",
};

export function CustomizerProvider({ children }) {
  const [state, setState] = useState(initialState);

  const clampOffset = (value) => {
    const clamped = Math.max(-maxOffset, Math.min(maxOffset, Number(value) || 0));
    return Number(clamped.toFixed(1));
  };

  const setPlacement = (placement) => {
    setState((current) => ({ ...current, placement }));
  };

  const setGarmentColor = (garmentColor) => {
    setState((current) => ({ ...current, garmentColor }));
  };

  const setOffsetX = (offsetX) => {
    setState((current) => ({ ...current, offsetX: clampOffset(offsetX) }));
  };

  const setOffsetY = (offsetY) => {
    setState((current) => ({ ...current, offsetY: clampOffset(offsetY) }));
  };

  const setOffsets = ({ offsetX, offsetY }) => {
    setState((current) => ({
      ...current,
      offsetX: clampOffset(offsetX),
      offsetY: clampOffset(offsetY),
    }));
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
      file: current.file,
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
        file,
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
      setOffsetX,
      setOffsetY,
      setOffsets,
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
