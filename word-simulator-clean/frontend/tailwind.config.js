/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'word-blue': '#2B579A',
        'word-hover': '#1F4477',
        'ribbon-bg': '#F3F2F1',
        'ribbon-border': '#D1D1D1',
      },
      fontFamily: {
        'calibri': ['Calibri', 'sans-serif'],
        'arial': ['Arial', 'sans-serif'],
        'times': ['Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
