/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#f3f4f6',
          DEFAULT: '#6366f1',
          dark: '#4338ca',
        }
      }
    },
  },
  plugins: [],
}
