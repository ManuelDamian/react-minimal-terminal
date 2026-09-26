import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src']
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactMinimalTerminal',
      fileName: 'index',
      formats: ['es'] // Solo ESM para evitar conflictos de UMD
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'], // Añadimos jsx-runtime como externo
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
