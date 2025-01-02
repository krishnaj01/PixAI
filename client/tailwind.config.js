/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'customScreen': '860px',
        'customScreen2': '1460px',
        'customScreen3': '1350px',
        'customScreen4': '900px',
        'customScreen5': '430px',
      },
    },
  },
  plugins: [],
}