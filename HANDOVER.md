# Poolgress 課程官網 — 工作手冊（Session 交接）

> 給下一個 Claude Code session 讀的完整交接文件。
> 使用者不寫程式：技術操作全部由你負責，用簡單中文溝通與回報。

---

## 0. ⚠️ 先分清楚：這裡有兩個不同的專案

| | 本專案（這個資料夾） | 另一個專案 |
|---|---|---|
| Repo | `mmee14122/poolgress` | `poolgress/poolgress-website` |
| 內容 | 課程官網（React 前端原型） | poolgress.com 正式站（table7 練習圖編輯器等） |
| 網址 | https://mmee14122.github.io/poolgress/ | https://poolgress.com |
| 技術 | Vite + React + TS + Tailwind v4，有 build | 純 HTML/JS，無 build |
| 交接文件 | 本檔 | `C:\Users\User\Downloads\給員工Claude的交接說明.md` |

使用者說「網站」時先判斷是哪一個。**本資料夾（`C:\Users\User\Documents\Poolgress`）永遠是課程官網。**

---

## 1. 環境（已就緒，不用重裝）

- Node.js 24（winget 裝的，PATH 可能要 `$env:Path = "$env:ProgramFiles\nodejs;" + $env:Path`）
- `gh` CLI 已登入帳號 **mmee14122**（scopes 含 repo、workflow）
- git 身分：Poolgress / poolgresswork@gmail.com（repo local config）
- Dev server：用 `preview_start`＋`.claude/launch.json` 的 `course-site` 設定（autoPort 開啟，5173 被占會自動換埠；vite.config 支援 `PORT` 環境變數）

## 2. 部署流程

```
npm run build          # tsc + vite build，必須先過
git add -A && git commit -m "中文訊息" && git push origin main
```

push 到 main 即觸發 GitHub Actions（`.github/workflows/deploy.yml`）自動部署到 GitHub Pages。用 `gh run watch <id> --repo mmee14122/poolgress --exit-status` 等綠燈。

- **HTML 有 ~10 分鐘 CDN 快取**：剛部署完抓到舊資產名是正常的，等或 Ctrl+F5
- 自訂網域 **course.poolgress.com 目前解綁中**（使用者 Namecheap 的 CNAME 一直沒設成功）。要綁回：建 `public/CNAME` 寫入網域＋`gh api -X PUT repos/mmee14122/poolgress/pages -f cname=course.poolgress.com`。DNS 需要：CNAME `course` → `mmee14122.github.io.`
- **poolgress.com 根網域在 Vercel 上跑另一個站，絕對不要動它的 DNS**

## 3. 頁面地圖（Vite 多頁）

| 頁面 | 進入點 | App |
|---|---|---|
| 首頁（品牌敘事） | `index.html` → `src/home.tsx` | `HomeApp.tsx` |
| 課程簡介（主戰場） | `course.html` → `src/course.tsx` | `App.tsx` |
| 購物車 | `cart.html` | `CartApp.tsx` |
| 結帳 | `checkout.html` | `CheckoutApp.tsx` |
| 建立帳號（訪客綁定） | `register.html` | `RegisterApp.tsx` |

## 4. 內容層（改文案只動這些檔）

- `src/content/home.ts` — 首頁七區塊全部文案（含 Hero 五幕的句子）
- `src/content/course.ts` — 課程頁全部資料：hero、`intro`（課程資訊列＋六區塊文案）、chapters（章節/單元/試看/闖關）、reviews、coach、faqs、purchase；`courseStats` 自動從 chapters 計算單元數/時數/練習題數（Hero、購買卡、課程內容標題列三處同源）
- `src/content/site.ts` — 導覽、promo（倒數結束時間 `endsAt`）、頁尾
- `src/content/catalog.ts` — 商品與價格（**已確認：預購 NT$2,940／原價 NT$4,900**）、示範優惠券（DEMO100、DEMO10）

**設計 token**：`src/styles/index.css` 的 `@theme`。品牌色（2026-08 定稿）：主色流暢藍 #387ED9（brand-*，logo 深藍 brand-900 #1F3C6A）、脈動綠 pulse（遊戲闖關標記）、火花紅 spark（備用）、銅金 brass（星等/優惠）。球檯視覺是藍色檯布。字標用 Poppins（各 html head 載入）。

## 5. 關鍵機制（動之前先讀）

1. **促銷倒數列**（`PromoBar.tsx`）：只掛在課程頁；掛載時對 `<html>` 加 `has-promo` class → CSS 變數 `--promo-h` 變 2rem。**全站所有 sticky/錨點偏移都是 `calc(var(--promo-h)+…)`**，按右側黑 X 關閉後變數歸零、版面自動收合。改任何 sticky top 時務必沿用這套變數。
2. **首頁 Hero 五幕 Scroll Story**（`S01Hero.tsx` + index.css `--story-p`）：sticky 舞台＋spacer（桌機 200vh/手機 140vh），進度由 CSS scroll timeline 驅動（`html.home-hero-scroll`），不支援時 JS 後援；幕界 18/38/62/80%。reduced-motion 時渲染 `StaticHero`。`?debug` 顯示進度徽章。
3. **課程頁 Hero sticky 過渡**（`CourseHero.tsx` + `--hero-p`，`html.course-hero-scroll`）：桌機 sticky＋60vh spacer、效果只動 transform/opacity；手機不釘住（自然捲動）。`.hero-next` 不可加 transform（內含 sticky 側欄，祖先 transform 會弄壞 sticky）。
4. **購物車**（`src/lib/cart.ts`）：localStorage（key `poolgress.cart.v1`）＋useSyncExternalStore，跨頁/跨分頁同步。導覽列 mini cart：桌機 hover＋點擊切換浮層、手機點擊開右側抽屜。
5. **結帳**（`CheckoutApp` + `src/lib/checkout.ts`）：會員（示範登入）/非會員、四種付款（分期選銀行期數、ATM/超商產繳費代碼）、三種發票（統編有官方檢核）、優惠券、缺漏摘要即時顯示。金流是前端模擬——`?demo=fail` 看失敗態。訪客購買成功 → `register.html?email=…` 驗證碼綁定（模擬）。
6. **課程內容**（`sections/Chapters.tsx`）：互斥 accordion（一次一章）、單元點擊開三種彈窗（付費鎖定/試看播放器佔位/闖關目標）。「立即購買」按鈕都是 加入購物車→跳 checkout。

## 6. 待補資料（搜尋「待補」與【待確認】）

課程名稱與 tagline、Chapter 03/04 單元名稱、各單元內容重點、Challenge 名稱與確認方式、App 商店連結（Challenge 區 CTA `href:'#'`）、試看影片 `videoUrl`、教練全部資料＋IG、學員評價（現為範例，**上線前必須換真實**）、課程學員數、優惠券正式資料、`/games` `/coach` `/cart→login` 等佔位路徑頁面、FAQ 觀看期限句、金流與課程平台串接（`startUrl`）。

## 7. 踩過的坑（重要！）

1. **PowerShell 文字取代會弄壞 UTF-8 中文** → 批次取代一律用 Git Bash `sed`（ASCII pattern 對 UTF-8 是 byte-safe），改完 `grep -rl '�' src` 查亂碼。
2. **Vite dev server 模組圖會卡死**（大量刪檔/新增檔後頁面空白或渲染舊版）→ `preview_stop` 再 `preview_start` 重啟就好；production build 不受影響。瀏覽器分頁也可能抱著舊 HMR 模組 → 先 `location.reload()` 排除。
3. **預覽分頁是隱藏的**：不產生畫格 → CSS 動畫/transition/rAF/IntersectionObserver 不跑、無法截圖、scroll 事件不觸發（測 scroll spy 要手動 `window.dispatchEvent(new Event('scroll'))`）、`:hover` 無法模擬。動畫類改動要老實告訴使用者「請你實際滑一下確認手感」。
4. **對比度掃描**：Tailwind v4 輸出 oklab 色，解析要用 1×1 canvas `getImageData` 取樣（過去對話有現成腳本模式）。全站已維持 WCAG AA 0 失敗，改色後要重掃。
5. **雙元件同名陷阱**：購物車抽屜是常駐 DOM 的 `role="dialog"`，測課程彈窗時要排除 `aria-label="購物車"`。
6. **`sticky` 要放在 grid 欄本身**（`items-start` 會讓內層失效）；祖先 transform 會殺 sticky。
7. 手機版驗證時模擬器的 `window.innerHeight` 讀值可能失真（如 812 視窗讀到 1503），以 CSS px 幾何為準。

## 8. 工作習慣（沿用）

- 改前先讀相關檔案；改後 `npm run build` ＋ 瀏覽器 DOM 驗證（結構/行為/對比）再 commit
- 每個需求：做完 → build → 驗證 → commit（中文訊息，結尾 Co-Authored-By: Claude）→ push → `gh run watch` 等綠燈 → 回報「改了什麼、哪裡看、快取提醒」
- 資料紀律：使用者沒給的數字/名稱/政策一律「待補」或【待確認】，不虛構（尤其學員見證與價格）
- 使用者的圖片訊息通常就是需求本體（貼截圖＝改成這樣/修這裡）
