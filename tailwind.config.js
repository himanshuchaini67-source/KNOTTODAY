/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core Theme Palette (User Defined)
        forest: {
          DEFAULT: '#3E5F4D',
          dark: '#1B2D23',
          deep: '#2D4738',
        },
        sage: {
          DEFAULT: '#6F8F7B',
          light: '#AFC8B4',
          dark: '#3E5F4D',
          50: '#F6F9F7',
          100: '#E7EFE9',
          200: '#D0DFD4',
          300: '#AFC8B4', // #AFC8B4
          400: '#8EAE97',
          500: '#6F8F7B', // #6F8F7B
          600: '#587764',
          700: '#486653',
          800: '#3E5F4D', // #3E5F4D
          900: '#2A4335',
          950: '#17281F',
        },
        sand: {
          DEFAULT: '#D8C7A6', // #D8C7A6
          light: '#F4EBDD',   // #F4EBDD
          50: '#FAF6F0',
          100: '#F4EBDD',     // #F4EBDD
          200: '#E9DEC9',
          300: '#D8C7A6',     // #D8C7A6
          400: '#C7B18A',
          500: '#B69B6F',
          600: '#9B8156',
          700: '#7B6541',
          800: '#5C4B30',
          900: '#413522',
        },
        cream: '#F4EBDD',      // #F4EBDD

        // Semantic mapping to burgundy scale so all existing classes transform seamlessly
        burgundy: {
          50: '#F6F9F7',
          100: '#E7EFE9',
          200: '#D0DFD4',
          300: '#AFC8B4',     // #AFC8B4
          400: '#8EAE97',
          500: '#6F8F7B',     // #6F8F7B
          600: '#587764',
          700: '#486653',
          800: '#3E5F4D',     // #3E5F4D
          900: '#2A4335',
          950: '#17281F',
        },

        // Semantic mapping to champagne scale
        champagne: {
          50: '#FAF6F0',
          100: '#F4EBDD',     // #F4EBDD
          200: '#E9DEC9',
          300: '#D8C7A6',     // #D8C7A6
          400: '#C7B18A',
          500: '#B69B6F',
          600: '#9B8156',
          700: '#7B6541',
          800: '#5C4B30',
          900: '#413522',
        },

        // Base App canvas colors
        ivory: '#F4EBDD',      // #F4EBDD (Alabaster Cream Canvas)
        charcoal: '#1F2E25',   // Deep Forest Charcoal text
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
