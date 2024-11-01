import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Include all relevant file types
    './public/index.html', // Include your HTML files if any
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};
