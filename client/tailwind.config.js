/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAF9F6",
        raised: "#F3F1EA",
        ink: "#1F1F1F",
        inksoft: "#5C5A53",
        inkfaint: "#8B8880",
        gold: "#B68C3A",
        goldsoft: "rgba(182,140,58,0.1)",
        line: "rgba(31,31,31,0.1)",
        linesoft: "rgba(31,31,31,0.05)",
      },
      fontFamily: {
        heading: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        num: ['"Space Grotesk"', "monospace"],
      },
      boxShadow: {
        soft: "0 30px 70px -30px rgba(31,31,31,0.18)",
        card: "0 20px 40px -28px rgba(31,31,31,0.3)",
        gold: "0 20px 40px -25px rgba(182,140,58,0.35)",
      },
    },
  },
  plugins: [],
};
