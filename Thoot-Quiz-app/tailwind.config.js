/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // You can set it to 'media' or 'class' if needed
  theme: {
    extend: {
      colors: {
        primary: '#FBE9CC',
        secondary: {
          100: '#294533',
          200: '#11999E',
          300: '#16c6cc',
          400: '#576d69',
        },
      },
    },
  },
  plugins: [],
};