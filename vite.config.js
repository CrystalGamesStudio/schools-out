import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    publicDir: 'public'
  },
  base: '/schools-out/'
}); 