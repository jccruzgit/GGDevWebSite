const mockupBasePath = `${import.meta.env.BASE_URL}mockups`;

const productMockupRegistry = {
  "legacy-code": ["main.png"],
  "machine-learning": ["main.png"],
  "senor-developer": ["main.png"],
  github: ["main.png"],
  "vaporwave-8-bit": [],
  "mango-fortnite": ["main.png"],
  "mainframe-soul": [],
  "glitch-geist-01": [],
  "async-await-ghost": [],
  "tokyo-midnight-run": [],
  "cyber-ronin-v04": [],
};

export function resolveProductGallery({ slug, category, fallbackImages }) {
  const filenames = productMockupRegistry[slug];

  if (!Array.isArray(filenames) || filenames.length === 0) {
    return fallbackImages;
  }

  return filenames.map((filename) => `${mockupBasePath}/${category}/${slug}/${filename}`);
}

export { productMockupRegistry };
