import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  return {
    // Dónde va a vivir el sitio. Por defecto la subcarpeta de GitHub Pages, que
    // es lo que compila el workflow. Para el hosting propio de Mayurlin se
    // compila con VITE_BASE, sin tocar este archivo:
    //   VITE_BASE=/ npm run build            -> raíz del dominio
    //   VITE_BASE=/portfolio/ npm run build  -> subcarpeta
    base: process.env.VITE_BASE || (command === 'build' ? '/New-Portafolio-2.0/' : '/'),
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
