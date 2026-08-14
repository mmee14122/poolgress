import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // 相對路徑：放在網站根目錄或子資料夾（/course/）都能正常載入
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
})
