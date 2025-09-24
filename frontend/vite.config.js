import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  // If deploying to Render (flavornestx.onrender.com), no special proxy needed since API calls use absolute URL.
});
