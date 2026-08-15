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
        cart: fileURLToPath(new URL('./cart.html', import.meta.url)),
        checkout: fileURLToPath(new URL('./checkout.html', import.meta.url)),
        register: fileURLToPath(new URL('./register.html', import.meta.url)),
        // 登入／註冊／忘記密碼（同頁切換狀態）
        login: fileURLToPath(new URL('./login.html', import.meta.url)),
        // 登入後的個人頁面
        account: fileURLToPath(new URL('./account.html', import.meta.url)),
        myCourses: fileURLToPath(new URL('./my-courses.html', import.meta.url)),
        stars: fileURLToPath(new URL('./stars.html', import.meta.url)),
        orders: fileURLToPath(new URL('./orders.html', import.meta.url)),
        invite: fileURLToPath(new URL('./invite.html', import.meta.url)),
        // 尚未建置頁面的「敬請期待」佔位頁
        games: fileURLToPath(new URL('./games.html', import.meta.url)),
        coach: fileURLToPath(new URL('./coach.html', import.meta.url)),
        venues: fileURLToPath(new URL('./venues.html', import.meta.url)),
        terms: fileURLToPath(new URL('./terms.html', import.meta.url)),
        privacy: fileURLToPath(new URL('./privacy.html', import.meta.url)),
      },
    },
  },
  server: {
    // 預設 5173；被佔用時可由 PORT 環境變數指定（多個預覽同時開）
    port: Number(process.env.PORT) || 5173,
  },
})
