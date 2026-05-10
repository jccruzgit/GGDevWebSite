import { useRef } from "react";
import { getPhotoMockup } from "@/config/customizerMockups";

function getDesignFrameStyle(designSize) {
  if (!designSize) {
    return {
      height: "100%",
      width: "100%",
    };
  }

  return {
    height: designSize.height ? `${designSize.height}%` : "100%",
    width: designSize.width ? `${designSize.width}%` : "100%",
  };
}

function ArtworkLayer({
  designImageUrl,
  designSize,
  emptyLabel,
  imageAlt,
  interactive,
  offsetX,
  offsetY,
  onOffsetChange,
  rotation,
  scale,
}) {
  const dragState = useRef(null);

  const handlePointerDown = (event) => {
    if (!designImageUrl || !interactive || !onOffsetChange) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    dragState.current = {
      height: bounds.height,
      pointerId: event.pointerId,
      startOffsetX: offsetX,
      startOffsetY: offsetY,
      startX: event.clientX,
      startY: event.clientY,
      width: bounds.width,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handlePointerMove = (event) => {
    const currentDrag = dragState.current;

    if (!currentDrag || currentDrag.pointerId !== event.pointerId || !onOffsetChange) {
      return;
    }

    const deltaX = ((event.clientX - currentDrag.startX) / currentDrag.width) * 100;
    const deltaY = ((event.clientY - currentDrag.startY) / currentDrag.height) * 100;

    onOffsetChange({
      offsetX: currentDrag.startOffsetX + deltaX,
      offsetY: currentDrag.startOffsetY + deltaY,
    });
  };

  const handlePointerEnd = (event) => {
    if (dragState.current?.pointerId === event.pointerId) {
      dragState.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  if (!designImageUrl) {
    return (
      <span className="flex h-full items-center justify-center text-center text-xs uppercase tracking-[0.18em] text-slate-400">
        {emptyLabel}
      </span>
    );
  }

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${
        interactive ? "touch-none select-none cursor-grab active:cursor-grabbing" : ""
      }`}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
    >
      <div
        className="flex items-center justify-center"
        style={{
          ...getDesignFrameStyle(designSize),
          transform: `translate(${offsetX}%, ${offsetY}%)`,
        }}
      >
        <img
          alt={imageAlt}
          className="h-full w-full object-contain"
          src={designImageUrl}
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: "center",
          }}
        />
      </div>
    </div>
  );
}

function PhotoMockupView({
  alt,
  className,
  designImageUrl,
  designSize,
  emptyLabel,
  frameClassName,
  garmentColor,
  imageAlt,
  interactive,
  offsetX,
  offsetY,
  overlayOnTop,
  onOffsetChange,
  placement,
  printArea,
  rotation,
  scale,
}) {
  const mockup = getPhotoMockup(garmentColor, placement);

  if (!mockup) {
    return null;
  }

  const resolvedPrintArea = {
    ...mockup.printArea,
    ...(printArea || {}),
  };
  const printAreaStyle = {
    height: `${(resolvedPrintArea.height / mockup.height) * 100}%`,
    left: `${(resolvedPrintArea.x / mockup.width) * 100}%`,
    top: `${(resolvedPrintArea.y / mockup.height) * 100}%`,
    width: `${(resolvedPrintArea.width / mockup.width) * 100}%`,
  };
  const printAreaClassName = designImageUrl
    ? "absolute z-10 overflow-hidden rounded-[18px] border border-transparent"
    : "absolute z-10 overflow-hidden rounded-[18px] border border-dashed border-white/15 bg-black/[0.08] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]";
  const overlayClassName = `pointer-events-none absolute inset-0 ${
    overlayOnTop ? "z-20" : "z-[5]"
  } h-full w-full`;

  return (
    <div className={`relative flex h-full w-full items-center justify-center ${className}`.trim()}>
      <div className={`relative w-full ${frameClassName}`.trim()}>
        <div
          className="relative origin-center"
          style={{
            aspectRatio: `${mockup.width} / ${mockup.height}`,
            transform: `translateY(${mockup.frameOffsetY || 0}px) scale(${mockup.frameScale || 1})`,
          }}
        >
          <img
            alt={alt || mockup.alt}
            className="absolute inset-0 h-full w-full"
            src={mockup.src}
          />
          {mockup.overlaySrc && !overlayOnTop ? (
            <img
              alt=""
              aria-hidden="true"
              className={overlayClassName}
              src={mockup.overlaySrc}
              style={{
                mixBlendMode: mockup.overlayBlendMode || "normal",
              }}
            />
          ) : null}
          <div className={`relative ${printAreaClassName}`.trim()} style={printAreaStyle}>
            <ArtworkLayer
              designImageUrl={designImageUrl}
              designSize={designSize}
              emptyLabel={emptyLabel || mockup.emptyLabel}
              imageAlt={imageAlt || mockup.imageAlt}
              interactive={interactive}
              offsetX={offsetX}
              offsetY={offsetY}
              onOffsetChange={onOffsetChange}
              rotation={rotation}
              scale={scale}
            />
          </div>
          {mockup.overlaySrc && overlayOnTop ? (
            <img
              alt=""
              aria-hidden="true"
              className={overlayClassName}
              src={mockup.overlaySrc}
              style={{
                mixBlendMode: mockup.overlayBlendMode || "normal",
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FallbackMockup({
  className,
  designImageUrl,
  designSize,
  emptyLabel,
  frameClassName,
  garmentColor,
  imageAlt,
  interactive,
  offsetX,
  offsetY,
  onOffsetChange,
  placement,
  rotation,
  scale,
}) {
  const activePrintAreaClassName = "border-transparent bg-white/[0.01]";
  const emptyPrintAreaClassName =
    "border-white/15 bg-black/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]";
  const frontActive = placement === "frente";
  const backActive = placement === "espalda";

  return (
    <div className={`relative flex h-full w-full items-center justify-center ${className}`.trim()}>
      <div className={`relative h-[420px] w-full ${frameClassName}`.trim()}>
        <div
          className="absolute left-1/2 top-[56px] h-[320px] w-[240px] -translate-x-1/2 rounded-[42px] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_30px_60px_rgba(0,0,0,0.35)]"
          style={{ backgroundColor: garmentColor }}
        />
        <div
          className="absolute left-1/2 top-[18px] h-20 w-28 -translate-x-1/2 rounded-b-[48px] border border-white/10"
          style={{ backgroundColor: garmentColor }}
        />
        <div
          className="absolute left-[30px] top-[82px] h-[120px] w-[96px] rounded-[34px] border border-white/10"
          style={{ backgroundColor: garmentColor, transform: "rotate(18deg)" }}
        />
        <div
          className="absolute right-[30px] top-[82px] h-[120px] w-[96px] rounded-[34px] border border-white/10"
          style={{ backgroundColor: garmentColor, transform: "rotate(-18deg)" }}
        />
        <div
          className={`absolute left-1/2 top-[138px] flex min-h-[160px] w-[180px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-[30px] border border-dashed ${
            frontActive && designImageUrl ? activePrintAreaClassName : emptyPrintAreaClassName
          } p-4 relative`}
        >
          {frontActive ? (
            <ArtworkLayer
              designImageUrl={designImageUrl}
              designSize={designSize}
              emptyLabel={emptyLabel || "Frente listo para arte"}
              imageAlt={imageAlt || "Diseño del producto"}
              interactive={interactive}
              offsetX={offsetX}
              offsetY={offsetY}
              onOffsetChange={onOffsetChange}
              rotation={rotation}
              scale={scale}
            />
          ) : (
            <span className="text-center text-xs uppercase tracking-[0.18em] text-slate-400">
              Frente listo para arte
            </span>
          )}
        </div>
        <div
          className={`absolute left-1/2 top-[138px] flex min-h-[160px] w-[180px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-[30px] border border-dashed ${
            backActive && designImageUrl ? activePrintAreaClassName : emptyPrintAreaClassName
          } p-4 relative`}
        >
          {backActive ? (
            <ArtworkLayer
              designImageUrl={designImageUrl}
              designSize={designSize}
              emptyLabel={emptyLabel || "Espalda lista para arte"}
              imageAlt={imageAlt || "Diseño del producto"}
              interactive={interactive}
              offsetX={offsetX}
              offsetY={offsetY}
              onOffsetChange={onOffsetChange}
              rotation={rotation}
              scale={scale}
            />
          ) : (
            <span className="text-center text-xs uppercase tracking-[0.18em] text-slate-400">
              Espalda lista para arte
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function StaticImageFallback({ alt, className, fallbackImageUrl, imageClassName }) {
  return (
    <div className={`flex h-full w-full items-center justify-center ${className}`.trim()}>
      <img
        alt={alt}
        className={`h-full w-full object-contain ${imageClassName}`.trim()}
        src={fallbackImageUrl}
      />
    </div>
  );
}

export default function ProductMockupPreview({
  alt = "Vista previa del producto",
  className = "",
  designImageUrl = "",
  designSize = null,
  emptyLabel = "Frente listo para arte",
  fallbackImageUrl = "",
  frameClassName = "max-w-[420px]",
  garmentColor = "#111827",
  imageAlt = "Diseño del producto",
  imageClassName = "",
  interactive = false,
  offsetX = 0,
  offsetY = 0,
  onOffsetChange,
  overlayOnTop = true,
  placement = "frente",
  printArea = null,
  rotation = 0,
  scale = 1,
  useStaticFallback = false,
}) {
  const hasPhotoMockup = Boolean(getPhotoMockup(garmentColor, placement));

  if (useStaticFallback && fallbackImageUrl) {
    return (
      <StaticImageFallback
        alt={alt}
        className={className}
        fallbackImageUrl={fallbackImageUrl}
        imageClassName={imageClassName}
      />
    );
  }

  if (hasPhotoMockup) {
    return (
      <PhotoMockupView
        alt={alt}
        className={className}
        designImageUrl={designImageUrl}
        designSize={designSize}
        emptyLabel={emptyLabel}
        frameClassName={frameClassName}
        garmentColor={garmentColor}
        imageAlt={imageAlt}
        interactive={interactive}
        offsetX={offsetX}
        offsetY={offsetY}
        overlayOnTop={overlayOnTop}
        onOffsetChange={onOffsetChange}
        placement={placement}
        printArea={printArea}
        rotation={rotation}
        scale={scale}
      />
    );
  }

  if (designImageUrl) {
    return (
      <FallbackMockup
        className={className}
        designImageUrl={designImageUrl}
        designSize={designSize}
        emptyLabel={emptyLabel}
        frameClassName={frameClassName}
        garmentColor={garmentColor}
        imageAlt={imageAlt}
        interactive={interactive}
        offsetX={offsetX}
        offsetY={offsetY}
        onOffsetChange={onOffsetChange}
        placement={placement}
        rotation={rotation}
        scale={scale}
      />
    );
  }

  if (fallbackImageUrl) {
    return (
      <StaticImageFallback
        alt={alt}
        className={className}
        fallbackImageUrl={fallbackImageUrl}
        imageClassName={imageClassName}
      />
    );
  }

  return (
    <div className={`flex h-full w-full items-center justify-center ${className}`.trim()}>
      <span className="text-center text-xs uppercase tracking-[0.18em] text-slate-400">
        Mockup pendiente de configuración
      </span>
    </div>
  );
}
