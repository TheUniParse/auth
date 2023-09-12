/** @type {import('tailwindcss').Config} */

export default {
  darkMode: 'class',
  // bydefault its relay on OS theme by the css media feature prefers-color-scheme

  corePlugins: {
    preflight: false,
  },
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

