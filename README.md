# 線上課程銷售官網（純 UI）

Vite + React + TypeScript + Tailwind v4。單門課程的長頁式銷售頁，**不含後端**：
所有購買、試看、聯絡行為都是導向外部連結。

## 開始

```bash
npm install
npm run dev
```

## 改內容不改版面

日常維護只會動到這兩個檔：

| 檔案 | 內容 |
|---|---|
| `src/content/course.ts` | 課名、大綱、見證、方案價格、FAQ |
| `src/content/site.ts` | CTA 連結、導覽項目、社群、法遵連結 |

**換金流平台**：只改 `site.checkoutUrl` 一行，UI 完全不動。

## 改風格

設計 token 全在 `src/styles/index.css` 的 `@theme` 區塊：品牌色、中性色、
區塊間距、圓角。改那一段就能換掉整站視覺，不需要進元件檔。

## 區塊順序

`src/App.tsx` 由上到下就是轉換動線：

```
Hero → 痛點 → 成果 → 大綱 → 講師 → 見證 → 方案 → FAQ → 保證 → 收尾 CTA
```

CTA 全頁共出現 6 次，手機另有底部常駐購買列（`StickyBar`，Hero 捲出後才顯示）。

## 交接給後端時

`src/content/course.ts` 最上方的型別（`Course`、`Plan`、`Testimonial`、`Faq`）
就是資料介面。API 回傳符合這些型別，把 `course` 常數換成 fetch 結果即可，
元件一行都不用改。

## 部署

推到 `main` 就會自動部署到 GitHub Pages（`.github/workflows/deploy.yml`）。

- 自訂網域寫在 `public/CNAME`，build 時會複製到 `dist/`
- Pages 的 source 必須設為 **GitHub Actions**（不是 Deploy from a branch）
- 換網域時同時改 `public/CNAME` 與 repo 設定裡的 Custom domain

備用：`npm run build:single` 會產生 `dist-single/index.html` 單一檔案，
適合只能上傳一個檔案的虛擬主機。

## 還沒做的事

- [ ] 換掉 Hero 的預覽影片佔位（保留 `aspect-video` 以免 CLS）
- [ ] 換掉講師照片與學員頭像佔位
- [ ] 補 `Course` / `FAQPage` schema.org 結構化資料
- [ ] `/terms`、`/privacy`、`/refund` 三頁（目前是連結佔位）
- [ ] 圖片轉 WebP 並對首屏圖片加 `fetchpriority="high"`
