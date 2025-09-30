import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Optional safeguard to prevent "process is not defined" errors in the browser.
  // Your app code should use `import.meta.env.VITE_GEMINI_API_KEY`.
  define: {
    'process.env': {},
  },
});