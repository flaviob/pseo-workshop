/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#faf5f0",
          100: "#f0e6d8",
          200: "#e0cab0",
          300: "#cda97e",
          400: "#c0905a",
          500: "#b27a42",
          600: "#9a6338",
          700: "#7d4d30",
          800: "#67402c",
          900: "#573728",
          950: "#301b13",
        },
        accent: {
          50: "#eef8f6",
          100: "#d5eeea",
          200: "#aeddd7",
          300: "#7fc5be",
          400: "#55a9a1",
          500: "#3b8e87",
          600: "#2e726d",
          700: "#295c59",
          800: "#254b49",
          900: "#223f3e",
          950: "#0f2524",
        },
        ink: {
          50: "#f6f6f7",
          100: "#e2e1e5",
          200: "#c4c3ca",
          300: "#a09ea8",
          400: "#7d7a86",
          500: "#63606c",
          600: "#4f4c56",
          700: "#413f47",
          800: "#37353c",
          900: "#2c2b30",
          950: "#1a191d",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
