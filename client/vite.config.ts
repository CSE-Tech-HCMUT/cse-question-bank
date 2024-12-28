import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src'),
      "assets": path.resolve(__dirname, './src/assets'),
      "layouts": path.resolve(__dirname, './src/layouts'),
      "components": path.resolve(__dirname, './src/components'),
      "pages": path.resolve(__dirname, './src/pages'),
      "templates": path.resolve(__dirname, './src/templates'),
      "routes": path.resolve(__dirname, './src/routes'),
      "hooks": path.resolve(__dirname, './src/hooks'),
      "services": path.resolve(__dirname, './src/services'),  
      "stores": path.resolve(__dirname, './src/stores'),
      "const": path.resolve(__dirname, './src/const'),
      "i18n": path.resolve(__dirname, './src/i18n'),
      "styles": path.resolve(__dirname, './src/styles'),
      "types": path.resolve(__dirname,'./src/types'),
      "helper": path.resolve(__dirname,'./src/helper'),
    }
  }
})
