# Poolgress 官方網站（前端）

撞球教育平台官網：線上課程 × 真實球桌 App 實戰闖關 × 學習進度紀錄。

技術：Vite + React 19 + TypeScript + Tailwind CSS v4。**目前沒有後端**——
登入、金流、學習進度都是前端模擬（存在瀏覽器），所有 integration point 都已標註，
未來接上 API 時 UI 不需要改。

---

## 一、如何啟動

需要 Node.js 20 以上。

```bash
npm install      # 第一次才需要
npm run dev      # 開發伺服器，預設 http://localhost:5173
npm run build    # 產生 dist/（部署用），會先跑 TypeScript 檢查
npm run preview  # 預覽 build 後的結果
```

`npm run build` 必須是綠燈才可以部署。

---

## 二、頁面路由

本站是 **Vite 多頁面**架構：每個頁面就是一個 `.html`，網址即檔名。
（GitHub Pages 無法做路徑改寫，所以用 query string 傳參數。）

| 網址 | 頁面 | 說明 |
|---|---|---|
| `/` | 首頁 | 品牌敘事、精選課程、實戰闖關、教練 |
| `/courses.html` | 線上課程列表 | 難度篩選＋搜尋 |
| `/course.html` | 課程詳情／販售頁 | 主課程完整介紹與購買 |
| `/learn.html?course=<id>&lesson=<章-單元>` | 課程學習頁 | 播放器＋章節清單＋進度 |
| `/challenges.html` | 實戰闖關列表 | App 實戰任務 |
| `/challenges.html?id=<id>` | 闖關詳情 | 目標、條件、App 開啟 |
| `/cart.html` | 購物車 | |
| `/checkout.html` | 結帳 | 加 `?demo=fail` 可看付款失敗態 |
| `/purchase-success.html?order=<訂單號>` | 購買完成 | 獨立網址、可重整 |
| `/login.html` | 登入 | 加 `?mode=register` 註冊、`?mode=forgot` 忘記密碼 |
| `/register.html` | 訪客訂單綁定帳號 | 從購買成功頁進入 |
| `/account.html` | 個人檔案 | |
| `/my-courses.html` | 我的課程 | 進度與繼續學習 |
| `/stars.html` | 我的星星 | 星星紀錄 |
| `/orders.html` | 我的訂單 | |
| `/coach.html` | 關於教練 | |
| `/challenges.html` ← `/games.html` | 舊網址 | 自動轉址 |
| `/venues.html` | 合作場館 | |
| `/faq.html` | 常見問題 | |
| `/contact.html` | 聯絡我們 | |
| `/terms.html`、`/privacy.html` | 服務條款、隱私權政策 | 內容待補 |
| `/404.html` | 找不到頁面 | GitHub Pages 自動使用 |

**新增頁面時**：建立 `新頁.html` 與 `src/新頁-entry.tsx`，然後在
`vite.config.ts` 的 `rollupOptions.input` 加一行，否則 build 不會產生該頁。

---

## 三、內容都在 `src/data/`

**要改網站內容，只需要動這個資料夾**，不用碰版面程式。

| 檔案 | 內容 |
|---|---|
| `site.ts` | 品牌名、主導覽、頁尾連結、促銷倒數列、聯絡信箱 |
| `home.ts` | 首頁七個區塊的全部文案 |
| `courses.ts` | **課程目錄**（列表頁卡片）＋ 章節查表 |
| `course-detail.ts` | 主課程詳情：Hero、六段文案、章節單元、教練、學員評價、FAQ |
| `catalog.ts` | 商品價格與優惠券 |
| `challenges.ts` | 實戰闖關關卡、App Store／Google Play 連結 |
| `venues.ts` | 合作場館 |
| `user.ts` | 使用者示範資料（等級、初始進度、星星） |
| `index.ts` | 統一出口（也可直接 import 個別檔案） |

### 如何新增一堂課程

1. **加到課程目錄** — `src/data/courses.ts` 的 `courseCatalog` 加一筆：

   ```ts
   {
     id: 'course-2',                  // 需與 catalog.ts 的商品 id 一致
     title: '進階走位課程',
     cover: '/assets/courses/course-2.jpg',   // 沒圖填 null
     level: '進階',
     category: '花式撞球',
     summary: '一句話說明這堂課解決什麼。',
     units: 12,
     hours: 2.5,
     price: 3600,                     // 填 null＝顯示「即將推出」
     originalPrice: 4800,
     href: './course.html?id=course-2',
   }
   ```

2. **加價格** — `src/data/catalog.ts` 的 `products` 加同 id 的商品（購物車與結帳用）。

3. **加章節單元**（要能上課才需要）— 在 `src/data/courses.ts` 的
   `chaptersByCourse` 加入 `'course-2': [...]`，格式參考 `course-detail.ts` 的 `chapters`。

只做第 1 步，課程就會出現在列表頁；三步都做完，才能購買並進入學習頁。

### 如何替換圖片與影片

圖片放 `public/assets/`，各資料夾的建議尺寸見
[`public/assets/README.md`](public/assets/README.md)。放好之後在資料檔填路徑
（**開頭要有斜線**，例如 `/assets/courses/course-2.jpg`）。

- 課程封面 → `courses.ts` 的 `cover`
- Challenge 情境圖 → `challenges.ts` 的 `image`
- 場館照片 → `venues.ts` 的 `image`
- 教練照片 → 目前是漸層佔位，素材備妥後在 `src/InfoApp.tsx` 的 `CoachPage` 換成 `<img>`（已標註位置）

**影片**：在單元資料填 `videoUrl` 就會自動從佔位換成播放器。
自架檔案填 `/assets/xxx.mp4`；若要用 Vimeo／YouTube 等外部平台，
需把 `src/LearnApp.tsx` 的 `<video>` 改成 iframe（已標註位置）。

沒填路徑或圖片載入失敗時，畫面自動顯示品牌漸層佔位，**版面不會壞掉**。

### 如何新增 Challenge

`src/data/challenges.ts` 的 `challenges` 加一筆即可，列表與詳情頁自動更新：

```ts
{
  id: 'challenge-5',
  name: '關卡名稱',
  image: '/assets/challenges/challenge-5.jpg',
  level: '進階',
  stars: 3,                    // 填 null 顯示「？」
  goal: '任務目標一句話',
  scenario: '球桌情境說明',
  conditions: ['完成條件 1', '完成條件 2'],
  prep: ['需要準備的東西'],
  appUrl: 'poolgress://challenge/5',   // App 未上架填 null
}
```

App 商店連結填在同一檔案的 `appLinks`。

### 如何改教練、評價、FAQ

都在 `src/data/course-detail.ts`：`coach`、`reviews`、`faqs`。
課程頁、教練頁、FAQ 頁共用同一份資料。

---

## 四、目前哪些是 mock（上線前必須處理）

| 項目 | 現況 | 上線前 |
|---|---|---|
| **學員評價** | `course-detail.ts` 的 `reviews` 是**範例文案** | ⚠️ **必須換成真實回饋**，否則有不實廣告疑慮 |
| 登入／註冊 | 前端模擬（`lib/session.ts`），登入頁底部有「示範登入」入口 | 接真實 Auth 後移除示範入口 |
| 金流 | 完全模擬，成功頁明確標示「未實際完成付款」 | 接金流商 |
| 已購課程／進度／訂單 | 存在瀏覽器（`lib/library.ts`） | 換成 API |
| 星星與等級 | 規則【待確認】，數字來自本機紀錄 | 需要你定義規則 |
| 課程名稱、章節、價格 | 部分為「待補」佔位 | 填入真實內容 |
| 教練資料 | 經歷、年資皆為「＿＿」 | 填入真實資料 |
| 服務條款、隱私權政策 | 佔位頁 | 補上正式條文 |

「待補」「＿＿」「【待確認】」都是刻意留的佔位，代表**尚未取得真實資料**，
不是遺漏。全站搜尋這幾個字就能找到所有待補處。

---

## 五、未來串接時要改哪裡（integration points）

| 要接什麼 | 改哪個檔案 | 說明 |
|---|---|---|
| **登入／註冊／忘記密碼** | `src/lib/auth.ts` | 四個函式都已定義好介面，目前一律回傳 `not_configured`。把 TODO 區塊換成 API 呼叫即可，UI 完全不用改 |
| **登入後導向** | `src/lib/auth.ts` 的 `AFTER_LOGIN_URL` | |
| **登入狀態保存** | `src/lib/session.ts` | 目前用 localStorage；正式版應改為後端 httpOnly cookie |
| **Apple／Google 登入** | `src/lib/auth.ts` 的 `signInWithProvider` | 需要 Apple Services ID、Google OAuth Client ID |
| **金流** | `src/CheckoutApp.tsx` 的 `confirm()` | 目前是 setTimeout 模擬；改為導向金流商並在回呼後寫入訂單 |
| **已購課程／學習進度／訂單** | `src/lib/library.ts` | 整支換成 API 呼叫，函式簽名可保持不變 |
| **App deep link 與商店連結** | `src/data/challenges.ts` | `appUrl` 與 `appLinks` |
| **課程影片** | 單元資料的 `videoUrl` ＋ `src/LearnApp.tsx` 播放區 | 外部平台需改成 iframe |
| **星星／等級規則** | `src/data/user.ts` 與 `lib/library.ts` 的 `addStars` | 需要先定義商業規則 |

**密碼安全**：前端不儲存密碼、不寫入 localStorage，只在送出當下存在於記憶體。
接後端時請走 HTTPS，由後端簽發 httpOnly cookie。

---

## 六、程式結構

```
src/
├── data/          ← 所有可替換內容（見上方第三節）
├── lib/           ← 狀態與邏輯：cart 購物車、library 學習庫、
│                    session 登入、auth 認證介面、checkout 結帳驗證
├── ui/            ← 共用元件：Button、Field、Section、Toast、SafeImage…
├── components/    ← 版面元件（Navbar、Footer、課程頁區塊、首頁區塊…）
├── styles/        ← index.css：設計 token（顏色、字體、圓角）與動畫
└── *App.tsx       ← 各頁面主體，搭配 *-entry.tsx 進入點
public/assets/     ← 圖片與影片素材（見該資料夾 README）
```

**設計 token 集中在 `src/styles/index.css` 的 `@theme`**：
品牌藍 `brand-*`、脈動綠 `pulse-*`、銅金 `brass-*`、中性 `ink-*`／`ivory-*`。
改配色只需要動這一段，全站自動套用。

---

## 七、部署

推上 `main` 分支即由 GitHub Actions 自動部署到 GitHub Pages。

```bash
npm run build
git add -A && git commit -m "說明改了什麼"
git push origin main
```

- 網址：https://mmee14122.github.io/poolgress/
- 另有一份同步部署在 poolgress.com/ui/（把 `dist/` 內容複製到
  `poolgress-website` repo 的 `ui/` 資料夾）
- **HTML 有約 10 分鐘 CDN 快取**，剛部署完看到舊版屬正常，按 Ctrl+F5 強制重整
