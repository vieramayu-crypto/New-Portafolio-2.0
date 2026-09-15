/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './App.tsx', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fbfaf6',
        'cream-light': '#ffffff',
        'cream-dark': '#eeebe3',
        charcoal: '#1a1918',
        'charcoal-muted': '#5a5854',
      },
      /* Toda la escala de lectura sube un punto: los textos pequeños se leían
         con dificultad. Sube entera para que la jerarquía se conserve — si
         solo subiera el cuerpo, empataría con el nivel de encima. De 2xl
         hacia arriba no se toca: son titulares y no compiten con nada. */
      fontSize: {
        xs: ['13px', { lineHeight: '17px' }],
        sm: ['15px', { lineHeight: '21px' }],
        base: ['17px', { lineHeight: '25px' }],
        lg: ['19px', { lineHeight: '29px' }],
        xl: ['21px', { lineHeight: '29px' }],
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
