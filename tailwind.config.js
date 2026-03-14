/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB", // Blue-600
        secondary: "#10B981", // Emerald-500
        dark: "#1E293B", // Slate-800
        light: "#F8FAFC", // Slate-50
      }
    },
  },
  plugins: [],
}
