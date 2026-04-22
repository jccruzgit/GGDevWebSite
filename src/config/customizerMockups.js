const mockupBasePath = `${import.meta.env.BASE_URL}mockups/tshirtmockup`;

export const PHOTO_MOCKUP_COLOR = "#F5F7FA";

export const photoMockups = {
  frente: {
    src: `${mockupBasePath}/front-base.png`,
    overlaySrc: `${mockupBasePath}/front-overlay.png`,
    overlayBlendMode: "multiply",
    width: 1600,
    height: 2000,
    alt: "Mockup frontal de camiseta",
    frameScale: 1,
    frameOffsetY: 0,
    printArea: {
      x: 497,
      y: 478,
      width: 605,
      height: 785,
    },
    emptyLabel: "Frente listo para arte",
    imageAlt: "Diseno cargado",
  },
  espalda: {
    src: `${mockupBasePath}/back-base.png`,
    overlaySrc: `${mockupBasePath}/back-overlay.png`,
    overlayBlendMode: "multiply",
    width: 1600,
    height: 2000,
    alt: "Mockup trasero de camiseta",
    frameScale: 1,
    frameOffsetY: 0,
    printArea: {
      x: 503,
      y: 362,
      width: 612,
      height: 996,
    },
    emptyLabel: "Espalda lista para arte",
    imageAlt: "Diseno cargado en la espalda",
  },
};
