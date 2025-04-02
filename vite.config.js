import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dotenv from 'dotenv';
dotenv.config();
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/extentionSettings/background.js'),
        content: resolve(__dirname, 'src/extentionSettings/content.js'),
        inject: resolve(__dirname, 'src/extentionSettings/inject.js')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  plugins: [react()],
  optimizeDeps: {
    include: ['react-bootstrap']
  }
});
