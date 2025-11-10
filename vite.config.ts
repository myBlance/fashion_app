import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000, // Tăng từ 500kb lên 2000kb (2MB)
    rollupOptions: {
      output: {
        manualChunks: {
          // Chia nhỏ các thư viện lớn
          'react-vendor': ['react', 'react-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'chart-vendor': ['recharts'], // Nếu bạn vẫn dùng recharts
        }
      }
    }
},
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
