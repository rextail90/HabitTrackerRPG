/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rpg: {
          dark: '#1a1a2e',
          blue: '#16213e',
          orange: '#e94560',
          light: '#f1f1f1',
        }
      }
    },
  },
  plugins: [],
}
