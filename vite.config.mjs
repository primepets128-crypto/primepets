import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Plugin: Make Vite-injected CSS non-render-blocking
// This allows the inline HTML loader to paint immediately (FCP ~300ms)
// instead of waiting for the full 17.7 KiB CSS bundle to download.
// The CSS still loads fully — it just doesn't block the first paint.
const asyncCssPlugin = {
  name: 'async-css',
  transformIndexHtml(html) {
    return html.replace(
      /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
      (_, href) =>
        `<link rel="preload" as="style" href="${href}" onload="this.rel='stylesheet'" crossorigin>` +
        `<noscript><link rel="stylesheet" crossorigin href="${href}"></noscript>`
    );
  }
};

export default defineConfig({
  plugins: [react(), tailwindcss(), asyncCssPlugin],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor-libs';
          }
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true
  }
})
