import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/proxy/identity': {
          target: env.VITE_IDENTITY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy\/identity/, ''),
        },
        '/proxy/payment': {
          target: env.VITE_PAYMENT_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy\/payment/, ''),
        },
        '/proxy/catalog': {
          target: env.VITE_CATALOG_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy\/catalog/, ''),
        },
        '/proxy/order': {
          target: env.VITE_ORDER_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy\/order/, ''),
        },
        '/proxy/notification': {
          target: env.VITE_NOTIFICATION_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy\/notification/, ''),
        },
      },
    },
  };
})
