import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
        react: path.resolve("./node_modules/react"),
    "react-dom": path.resolve("./node_modules/react-dom"),
      '~': path.resolve(__dirname, './src')
    }
  }
})
