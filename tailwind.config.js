/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1f2a48",              // sfondo principale
        accent: "#253866",            // colore scuro per testi e grafici
        soft: "#dcdfff",              // sfondo secondario chiaro
        primary: "#4a5ba7",           // pulsanti / elementi attivi
      },
      fontFamily: {
        inout: ["Poppins", "sans-serif"], // useremo questa (molto simile al logo)
      },
    },
  },
  plugins: [],
};