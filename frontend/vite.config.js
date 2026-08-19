import { defineConfig } from 'vite'

export default defineConfig({
  // Tối ưu cho Vanilla JS cũ không dùng ES modules
  optimizeDeps: {
    exclude: [],
    // Bỏ qua việc scan dependencies trong main.js
    // vì nó dùng HTML template strings
    entries: []
  },
  build: {
    rollupOptions: {
      // Không bundle, chỉ serve file như static
      input: 'index.html'
    }
  },
  server: {
    port: 5173,
    open: false
  },
  // Bảo Vite không transform script tags này
  html: {
    // Không thêm module polyfill
  }
})