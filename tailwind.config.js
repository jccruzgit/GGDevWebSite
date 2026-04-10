/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: "#030B1A",
        surface: {
          1: "#081327",
          2: "#0B1730",
          3: "#10213F",
          4: "#16305A",
        },
        line: "rgba(92, 130, 255, 0.18)",
        mint: "#7CF8D2",
        aqua: "#27E4F2",
        cyan: "#3AA6FF",
        glow: "#8AF6E0",
      },
      fontFamily: {
        display: ["Space Grotesk", "Segoe UI", "sans-serif"],
        body: ["Plus Jakarta Sans", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124, 248, 210, 0.14), 0 20px 60px rgba(39, 228, 242, 0.12)",
        card: "0 18px 48px rgba(3, 11, 26, 0.42)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7CF8D2 0%, #27E4F2 52%, #3AA6FF 100%)",
        "hero-grid":
          "radial-gradient(circle at top, rgba(58, 166, 255, 0.18), transparent 28%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "hero-grid": "auto, 44px 44px, 44px 44px",
      },
    },
  },
  plugins: [],
};
