/** @type {import('tailwindcss').Config} */
module.exports ={
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      inter: "'Inter', sans-serif",
    },
    container: {
      center: true,
      padding: '1rem',
    },
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      white: '#FFFFFF',
      black: '#141420',
      'bg-color': '#2C2C39',
      stroke: '#4D4C5A',
      dark: '#1D2144',
      primary: '#5142FC',
      secondary: '#36B37E',
      yellow: '#FBB040',
      red:'#FF0000',
      blue:"#0000FF",
      green:"#00FF00",
      'gray-600':'#4b5563',
      'gray-500':'#6b7280',
      'gray-400':'#9ca3af',
      'gray-300':'#d1d5db',
      'gray-100':"#f3f4f6",
      'gray-700':'#374151',
      'gray-50':'#f9fafb',
      'indigo-600': '#4f46e5',
       'indigo-500':'#6366f1',  
      'indigo-200':'#c7d2fe',
      'indigo-300':'#a5b4fc',
      'body-color': '#A1A0AE',
      'gray-900':'#111827',
      'gray-200':'#e5e7eb',
      "green-50": "#f0fdf4",
      "green-500": "#22c55e",
      "green-600": "#16a34a",
      "green-700":"#15803d",
      "red-500": "#ef4444",
      "red-600":"#dc2626",
      "red-700":"#b91c1c",
      "red-50":"#fef2f2",
      "blue-500":"#3b82f6",
      "blue-600":"#2563eb",

      'blue-dark': '#0A2540', // Dark blue background color
      'blue-medium': '#1C4B75', // Medium blue color for circular lines
      'blue-light': '#3E92CC', // Light blue highlights on text and icons
      'green-light': '#32CD32', // Green color for globe continents
      'gold': '#FFD700', // Gold color for circular lines surrounding the globe
      gradient: 'linear-gradient(158.44deg, #EBC77A 7.17%, #CA3F8D 52.72%, #5142FC 91.26%)',
    },
    screens: {
      sm: '575px',
      // => @media (min-width: 576px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '992px',
      // => @media (min-width: 992px) { ... }

      xl: '1140px',
      // => @media (min-width: 1140px) { ... }

      '2xl': '1320px',
      // => @media (min-width: 1320px) { ... }
    },
    extend: {
      boxShadow: {
        signUp: '0px 5px 10px rgba(4, 10, 34, 0.2)',
        image: '0px 3px 30px rgba(9, 14, 52, 0.1)',
        pricing: '0px 7px 35px rgba(180, 189, 223, 0.4)',
        input: '0px 11px 10px -6px rgba(0, 0, 0, 0.2)',
        sticky: 'inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        '99999':'99999'
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
    },
  },
  plugins: [
    // ...
    require('@tailwindcss/forms')
  ],
}
