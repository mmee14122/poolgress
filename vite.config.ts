import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  // 相對路徑：放在網站根目錄或子資料夾（/course/）都能正常載入
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // 雙頁面：/ 是品牌首頁，/course.html 是課程詳情頁
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        course: fileURLToPath(new URL('./course.html', import.meta.url)),
      },
    },
  },
  server: {
    // 預設 5173；被佔用時可由 PORT 環境變數指定（多個預覽同時開）
    port: Number(process.env.PORT) || 5173,
  },
})
