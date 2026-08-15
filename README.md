# Poolgress 官方網站（純 UI）

Vite + React + TypeScript + Tailwind v4，雙頁面站台，**不含後端**。

## 資訊架構（層級分工）

| 頁面 | 回答的問題 | 入口 |
|---|---|---|
| 官網首頁 | Poolgress 是什麼？為什麼跟我有關？ | `/`（7 個品牌區塊） |
| 課程簡介 | 這堂課解決什麼？我會得到什麼？ | `/course.html`（6 段模板） |

首頁敘事：共鳴 → 問題 → 觀點 → One → 產品價值 → 適合誰 → 願景＋課程入口。
課程模板：卡在哪 → 怎麼學 → 得到什麼 → 適合誰 → 這堂的特色 → 章節。

**去重規則**：課程步驟、章節、闖關細節只放課程頁，不回流首頁。
品牌金句「靠，我居然做到了」首頁只完整出現兩次（Hero、The One）。

## 改內容不改版面

| 檔案 | 內容 |
|---|---|
| `src/content/home.ts` | 首頁七區塊全部文案 |
| `src/content/course.ts` | 課程簡介資料（型別即後端介面） |
| `src/content/site.ts` | 導覽、購物車、語言、頁尾連結 |

**新增課程**：複製一份 `CourseIntro` 資料 + 一個 HTML 進入點即可。

## 資料限制

課程名稱、章節、闖關條件、價格、會員方案等尚未確認的資訊，
一律顯示「待補」，**禁止虛構**。填入真實資料時搜尋「待補」逐一替換。

## 開發

```bash
npm install
npm run dev
```

風格 token 在 `src/styles/index.css` 的 `@theme` 區塊（撞球檯綠 + 銅金）。

## 部署

推到 `main` 自動部署 GitHub Pages（`.github/workflows/deploy.yml`）。
自訂網域目前解綁中；要綁 `course.poolgress.com` 時新增 `public/CNAME` 寫入網域即可。

## 還沒做的事

- [ ] 填入真實課程資料（搜尋「待補」）
- [ ] Hero／The One 的實拍素材（目前為 SVG 圖形語言）
- [ ] `/games`、`/coach`、`/cart`、`/login` 等佔位路徑的實際頁面
- [ ] i18n（語言切換目前只切 UI 狀態）
- [ ] schema.org 結構化資料
