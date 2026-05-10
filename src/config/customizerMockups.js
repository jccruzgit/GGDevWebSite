const mockupBasePath = `${import.meta.env.BASE_URL}mockups/tshirtmockup`;

export const PHOTO_MOCKUP_COLORS = {
  black: "#111827",
  navy: "#13213B",
  white: "#F5F7FA",
};

const photoMockupColorEntries = [
  {
    aliases: ["black", "negro", "negro eclipse", PHOTO_MOCKUP_COLORS.black],
    hex: PHOTO_MOCKUP_COLORS.black,
    key: "black",
  },
  {
    aliases: ["navy", "blue", "azul", "azul midnight", PHOTO_MOCKUP_COLORS.navy],
    hex: PHOTO_MOCKUP_COLORS.navy,
    key: "navy",
  },
  {
    aliases: ["white", "blanco", "blanco polar", PHOTO_MOCKUP_COLORS.white],
    hex: PHOTO_MOCKUP_COLORS.white,
    key: "white",
  },
];

const baseMockup = {
  width: 1600,
  height: 2000,
  frameScale: 1,
  frameOffsetY: 0,
};

export const photoMockupsByColor = {
  [PHOTO_MOCKUP_COLORS.white]: {
    frente: {
      ...baseMockup,
      src: `${mockupBasePath}/front-base.png`,
      overlaySrc: `${mockupBasePath}/front-overlay.png`,
      overlayBlendMode: "multiply",
      alt: "Mockup frontal de camiseta blanca",
      printArea: {
        x: 497,
        y: 478,
        width: 605,
        height: 785,
      },
      emptyLabel: "Frente listo para arte",
      imageAlt: "Diseño cargado",
    },
    espalda: {
      ...baseMockup,
      src: `${mockupBasePath}/back-base.png`,
      overlaySrc: `${mockupBasePath}/back-overlay.png`,
      overlayBlendMode: "multiply",
      alt: "Mockup trasero de camiseta blanca",
      printArea: {
        x: 503,
        y: 362,
        width: 612,
        height: 996,
      },
      emptyLabel: "Espalda lista para arte",
      imageAlt: "Diseño cargado en la espalda",
    },
  },
  [PHOTO_MOCKUP_COLORS.black]: {
    frente: {
      ...baseMockup,
      src: `${mockupBasePath}/front-base-black.png`,
      overlaySrc: `${mockupBasePath}/front-overlay-black.png`,
      overlayBlendMode: "screen",
      alt: "Mockup frontal de camiseta negra",
      printArea: {
        x: 554,
        y: 540,
        width: 549,
        height: 903,
      },
      emptyLabel: "Frente listo para arte",
      imageAlt: "Diseño cargado",
    },
    espalda: {
      ...baseMockup,
      src: `${mockupBasePath}/back-base-black.png`,
      overlaySrc: `${mockupBasePath}/back-overlay-black.png`,
      overlayBlendMode: "screen",
      alt: "Mockup trasero de camiseta negra",
      printArea: {
        x: 487,
        y: 396,
        width: 606,
        height: 913,
      },
      emptyLabel: "Espalda lista para arte",
      imageAlt: "Diseño cargado en la espalda",
    },
  },
  [PHOTO_MOCKUP_COLORS.navy]: {
    frente: {
      ...baseMockup,
      src: `${mockupBasePath}/front-base-navy.png`,
      overlaySrc: `${mockupBasePath}/front-overlay-navy.png`,
      overlayBlendMode: "screen",
      alt: "Mockup frontal de camiseta azul",
      printArea: {
        x: 527,
        y: 510,
        width: 580,
        height: 861,
      },
      emptyLabel: "Frente listo para arte",
      imageAlt: "Diseño cargado",
    },
    espalda: {
      ...baseMockup,
      src: `${mockupBasePath}/back-base-navy.png`,
      overlaySrc: `${mockupBasePath}/back-overlay-navy.png`,
      overlayBlendMode: "screen",
      alt: "Mockup trasero de camiseta azul",
      printArea: {
        x: 483,
        y: 438,
        width: 622,
        height: 881,
      },
      emptyLabel: "Espalda lista para arte",
      imageAlt: "Diseño cargado en la espalda",
    },
  },
};

function normalizeColorToken(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

export function resolvePhotoMockupColor(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "object") {
    const explicitMockupColor = resolvePhotoMockupColor(
      value.mockupColor || value.mockupKey || value.mockupHex
    );

    if (explicitMockupColor) {
      return explicitMockupColor;
    }

    return resolvePhotoMockupColor(value.hex || value.name || "");
  }

  const normalizedValue = normalizeColorToken(value);
  const matchedEntry = photoMockupColorEntries.find(
    (entry) =>
      entry.key === normalizedValue ||
      entry.hex.toLowerCase() === normalizedValue ||
      entry.aliases.some((alias) => normalizeColorToken(alias) === normalizedValue)
  );

  return matchedEntry?.hex || null;
}

export function getPhotoMockup(garmentColor, placement) {
  const resolvedColor = resolvePhotoMockupColor(garmentColor);

  return photoMockupsByColor[resolvedColor]?.[placement] || null;
}
