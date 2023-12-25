import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';



export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
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