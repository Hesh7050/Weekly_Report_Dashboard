/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        dark: "#111827",
        soft: "#F3F4F6",
      },
    },
  },
  plugins: [],
};