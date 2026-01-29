/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ЭТО КЛЮЧЕВАЯ НАСТРОЙКА!
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}