import { getPhotoMockup } from "@/config/customizerMockups";

function clampScale(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.min(Math.max(parsed, 0.6), 2.4);
}

function clampOffset(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.min(Math.max(parsed, -40), 40);
}

function sanitizeFilePart(value) {
  return String(value || "preview")
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function roundedRectPath(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${src}`));
    image.src = src;
  });
}

function drawGridBackground(context, width, height) {
  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#0D1B33");
  gradient.addColorStop(1, "#050B17");

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(255, 255, 255, 0.05)";
  context.lineWidth = 1;

  for (let x = 0; x <= width; x += 48) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

  for (let y = 0; y <= height; y += 48) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  const glow = context.createRadialGradient(width / 2, 180, 80, width / 2, 180, 540);
  glow.addColorStop(0, "rgba(39, 228, 242, 0.22)");
  glow.addColorStop(1, "rgba(39, 228, 242, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);
}

function drawArtwork(context, artworkImage, printArea, scale, offsetX, offsetY) {
  if (!artworkImage) {
    return;
  }

  const fitScale = Math.min(
    printArea.width / artworkImage.naturalWidth,
    printArea.height / artworkImage.naturalHeight
  );
  const drawWidth = artworkImage.naturalWidth * fitScale * clampScale(scale);
  const drawHeight = artworkImage.naturalHeight * fitScale * clampScale(scale);
  const centerX = printArea.x + printArea.width / 2 + (printArea.width * clampOffset(offsetX)) / 100;
  const centerY = printArea.y + printArea.height / 2 + (printArea.height * clampOffset(offsetY)) / 100;

  context.save();
  roundedRectPath(context, printArea.x, printArea.y, printArea.width, printArea.height, 28);
  context.clip();
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    artworkImage,
    centerX - drawWidth / 2,
    centerY - drawHeight / 2,
    drawWidth,
    drawHeight
  );
  context.restore();
}

function drawBadge(context, text, x, y) {
  context.save();
  context.font = "600 34px 'Plus Jakarta Sans', sans-serif";
  const metrics = context.measureText(text);
  const width = metrics.width + 56;

  context.fillStyle = "rgba(255, 255, 255, 0.08)";
  context.strokeStyle = "rgba(255, 255, 255, 0.12)";
  context.lineWidth = 2;
  roundedRectPath(context, x, y, width, 66, 33);
  context.fill();
  context.stroke();

  context.fillStyle = "#E2E8F0";
  context.fillText(text, x + 28, y + 43);
  context.restore();
}

async function createPhotoPreviewCanvas({
  fileName,
  garmentColor,
  image,
  offsetX,
  offsetY,
  placement,
  scale,
}) {
  const mockup = getPhotoMockup(garmentColor, placement);

  if (!mockup) {
    return null;
  }

  const [baseImage, overlayImage, artworkImage] = await Promise.all([
    loadImage(mockup.src),
    mockup.overlaySrc ? loadImage(mockup.overlaySrc) : Promise.resolve(null),
    image ? loadImage(image) : Promise.resolve(null),
  ]);
  const canvas = document.createElement("canvas");

  canvas.width = mockup.width;
  canvas.height = mockup.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("No se pudo crear el lienzo de la vista previa.");
  }

  context.drawImage(baseImage, 0, 0, mockup.width, mockup.height);
  drawArtwork(context, artworkImage, mockup.printArea, scale, offsetX, offsetY);

  if (overlayImage) {
    context.save();
    context.globalCompositeOperation = mockup.overlayBlendMode || "source-over";
    context.drawImage(overlayImage, 0, 0, mockup.width, mockup.height);
    context.restore();
  }

  drawBadge(context, `GGDev ${placement}`, 56, 56);
  drawBadge(context, sanitizeFilePart(fileName || "sin-archivo"), 56, 142);

  return canvas;
}

function drawSleeve(context, x, y, width, height, rotation, color) {
  context.save();
  context.translate(x + width / 2, y + height / 2);
  context.rotate(rotation);
  context.fillStyle = color;
  context.shadowColor = "rgba(0, 0, 0, 0.26)";
  context.shadowBlur = 32;
  context.shadowOffsetY = 18;
  roundedRectPath(context, -width / 2, -height / 2, width, height, 48);
  context.fill();
  context.restore();
}

async function createFallbackPreviewCanvas({
  garmentColor,
  image,
  offsetX,
  offsetY,
  placement,
  scale,
}) {
  const canvas = document.createElement("canvas");

  canvas.width = 1400;
  canvas.height = 1600;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("No se pudo crear el lienzo de la vista previa.");
  }

  drawGridBackground(context, canvas.width, canvas.height);

  const printArea = {
    x: 475,
    y: 490,
    width: 450,
    height: 500,
  };
  const artworkImage = image ? await loadImage(image) : null;

  drawSleeve(context, 198, 362, 220, 360, (16 * Math.PI) / 180, garmentColor);
  drawSleeve(context, 982, 362, 220, 360, (-16 * Math.PI) / 180, garmentColor);

  context.save();
  context.fillStyle = garmentColor;
  context.shadowColor = "rgba(0, 0, 0, 0.26)";
  context.shadowBlur = 44;
  context.shadowOffsetY = 24;
  roundedRectPath(context, 330, 210, 740, 1080, 110);
  context.fill();
  context.restore();

  context.save();
  context.fillStyle = "#06111F";
  roundedRectPath(context, 520, 210, 360, 180, 88);
  context.fill();
  context.restore();

  context.save();
  context.strokeStyle = "rgba(39, 228, 242, 0.34)";
  context.setLineDash([18, 18]);
  context.lineWidth = 4;
  roundedRectPath(context, printArea.x, printArea.y, printArea.width, printArea.height, 32);
  context.stroke();
  context.restore();

  drawArtwork(context, artworkImage, printArea, scale, offsetX, offsetY);
  drawBadge(context, `GGDev ${placement}`, 56, 56);

  return canvas;
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("No se pudo exportar la imagen."));
        return;
      }

      resolve(blob);
    }, "image/png");
  });
}

function triggerDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}

export async function downloadCustomizerPreview(options) {
  const { fileName, garmentColor, placement } = options;
  const canvas =
    getPhotoMockup(garmentColor, placement)
      ? await createPhotoPreviewCanvas(options)
      : await createFallbackPreviewCanvas(options);
  const blob = await canvasToBlob(canvas);
  const safePlacement = sanitizeFilePart(placement || "frente");
  const safeName = sanitizeFilePart(fileName || "diseno-personalizado");
  const downloadName = `ggdev-preview-${safeName}-${safePlacement}.png`;

  triggerDownload(blob, downloadName);

  return downloadName;
}
