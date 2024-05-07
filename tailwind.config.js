/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {

    screens: {

      "xxs" : "290px" ,

      'xs' : "510px" ,

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },

    extend: {

      colors :{
        "themeColor" :  "#1d062f"
      } ,
      height : {
        'fullAk' : '100vh'
      },
      
      zIndex : {
        "5" : "5"
      }

    },
  },

  plugins: [
    require("@headlessui/react"),
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}

