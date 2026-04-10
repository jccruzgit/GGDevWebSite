function encodeSvg(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildSvg({ title, tag, accent, glow, garment }) {
  return `
    <svg width="1200" height="1400" viewBox="0 0 1200 1400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="1400" rx="56" fill="#07111F"/>
      <rect x="32" y="32" width="1136" height="1336" rx="42" stroke="${glow}" stroke-opacity="0.35"/>
      <rect x="80" y="84" width="1040" height="1232" rx="38" fill="url(#panel)"/>
      <circle cx="950" cy="250" r="180" fill="${glow}" fill-opacity="0.18"/>
      <circle cx="300" cy="1120" r="190" fill="${accent}" fill-opacity="0.16"/>
      <path d="M350 290L500 210H700L850 290L930 470L820 520V1050C820 1078 798 1100 770 1100H430C402 1100 380 1078 380 1050V520L270 470L350 290Z" fill="${garment}" stroke="${glow}" stroke-opacity="0.22" stroke-width="16"/>
      <rect x="455" y="480" width="290" height="350" rx="28" fill="url(#art)"/>
      <rect x="480" y="520" width="240" height="10" rx="5" fill="white" fill-opacity="0.72"/>
      <rect x="480" y="555" width="170" height="10" rx="5" fill="white" fill-opacity="0.45"/>
      <rect x="480" y="690" width="220" height="12" rx="6" fill="white" fill-opacity="0.72"/>
      <rect x="480" y="730" width="180" height="12" rx="6" fill="white" fill-opacity="0.38"/>
      <text x="120" y="180" fill="white" fill-opacity="0.92" font-size="52" font-family="Space Grotesk, sans-serif" font-weight="700">${title}</text>
      <text x="120" y="244" fill="${accent}" font-size="26" letter-spacing="8" font-family="Plus Jakarta Sans, sans-serif" font-weight="700">${tag}</text>
      <rect x="120" y="1180" width="320" height="76" rx="38" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)"/>
      <text x="170" y="1228" fill="white" font-size="24" font-family="Plus Jakarta Sans, sans-serif">DTF premium / corte urbano</text>
      <defs>
        <linearGradient id="panel" x1="120" y1="110" x2="1060" y2="1300" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0B1730"/>
          <stop offset="1" stop-color="#10213F"/>
        </linearGradient>
        <linearGradient id="art" x1="465" y1="480" x2="770" y2="830" gradientUnits="userSpaceOnUse">
          <stop stop-color="${accent}"/>
          <stop offset="1" stop-color="${glow}"/>
        </linearGradient>
      </defs>
    </svg>
  `;
}

export function createMockGallery({ title, accent, glow }) {
  return [
    encodeSvg(
      buildSvg({
        title,
        tag: "FIRMA GGDEV",
        accent,
        glow,
        garment: "#111827",
      })
    ),
    encodeSvg(
      buildSvg({
        title,
        tag: "EDICION VISUAL",
        accent: glow,
        glow: accent,
        garment: "#F5F7FA",
      })
    ),
    encodeSvg(
      buildSvg({
        title,
        tag: "ENERGIA NOCTURNA",
        accent,
        glow,
        garment: "#13213B",
      })
    ),
  ];
}
