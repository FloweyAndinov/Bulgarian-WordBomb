import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';



export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      }
    },
    define: {
      'process.env': env
    },
    server: {
      proxy: {
        '/api':'http://localhost:3000',
      },
    },
    plugins: [react()],
  }
})

