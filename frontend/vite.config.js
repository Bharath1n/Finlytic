import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    proxy: {
      '/authgear-proxy': {
        target: 'https://finylytic.authgear.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/authgear-proxy/, ''),
        secure: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Add any necessary headers
            proxyReq.setHeader('Origin', 'https://finylytic.authgear.cloud');
          });
        },
      },
    },
  },
})
