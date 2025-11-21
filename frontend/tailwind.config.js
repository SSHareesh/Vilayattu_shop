/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // This is what we need Vite to see
  theme: {
    extend: {
      colors: {
        primary: { light: '#007BFF', dark: '#3498DB' },
        secondary: { light: '#28A745', dark: '#2ECC71' },
        bg: { light: '#FFFFFF', dark: '#121212' },
        text: { light: '#333333', dark: '#E0E0E0' }
      },
    },
  },
  plugins: [],
}