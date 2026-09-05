# Poolgress 課程官網 — 工作手冊（Session 交接）

> 給下一個 Claude Code session 讀的完整交接文件。
> 使用者不寫程式：技術操作全部由你負責，用簡單中文溝通與回報。
> 最後更新：2026-09-05（首頁全面重做為 premium-demo，本檔整份改寫）

---

## 0. ⚠️ 兩個不同的專案，交付目標只有一個

| | 本專案（這個資料夾） | 另一個專案 |
|---|---|---|
| Repo | `mmee14122/poolgress` | `poolgress/poolgress-website` |
| 內容 | 課程官網（Vite + React 19 + TS + Tailwind v4） | poolgress.com 正式站（純 HTML，別動） |
| 本機路徑 | `C:\Users\User\Documents\Poolgress` | `~/poolgress-website` |

- 原始碼在本 repo 開發、build、commit、push；**交付網址一律 `https://www.poolgress.com/ui/xxx.html`**
- 不要回報 mmee14122.github.io；poolgress.com 根網域在 Vercel，**絕不動它的 DNS**

## 1. ⭐ 使用者的工作方式（最重要，先讀）

1. **會在你工作到一半插入新需求（幾乎每一輪都會）**。做完手上這一項、驗證、部署，再依序處理新的，**絕不停下來問要不要繼續**。一則訊息常同時含「上一項的修正」＋「全新需求」，都要做完。
2. **常改完又改回來**（換色卡試完改回、按鈕改名又還原、hover 效果加了又取消）。照做，不質疑，回報時說清楚現在是哪一版。
3. 會給**超詳細的英文/中文動效規格書**（duration、easing、y-offset 都寫死）。照規格逐條實作、逐條回報；**規格內部矛盾時**（例如 padding 值與視覺間距衝突）選一個並明說取捨。
4. 會用「先跟我討論」開頭 → 那一輪只給分析與建議、不動工；說「好先製作」「直接完成」才動工。
5. 回報格式：**改了什麼 → 真正的原因 → 實測數據（px、秒數、opacity、對比度）→ /ui/ 網址 → Ctrl+F5 快取提醒**。沒測到的老實說（特別是動畫手感，見第 7 節）。
6. 使用者說「看不出效果」時，通常是**效果真的太淡**（規格給的透明度在實際底色上不可見）或快取。先檢查物理（亮度對比），再懷疑快取（可 curl 線上檔案驗證雜湊）。
7. 貼在聊天的圖片**你拿不到檔案**，請他存到指定路徑（如 `public/assets/hero/`）再接上；收到檔案先 `file` 檢查真實格式（曾遇到 .png 副檔名裝 WebP）。

## 2. 部署流程（每個需求做完就跑一次）

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run build     # 必須綠燈
git add -A && git commit -m "中文訊息" && git push origin main
cd ~/poolgress-website && git pull --rebase origin main
git rm -rq ui/ ; cp -r "C:/Users/User/Documents/Poolgress/dist/." ui/
git add ui/ && git commit -q -m "更新 ui/：說明" && git push origin main
```
- **推完 ui/ 之後一定要打 Vercel Deploy Hook**：`curl -s -X POST "$(cat ~/.poolgress-vercel-hook)"`（hook 網址存在本機 `~/.poolgress-vercel-hook`，不進 repo）。2026-09-05 發生過 GitHub→Vercel 通知失聯，連續 7 次推送都沒部署，靠這個 hook 才上線。驗證方式：`curl -s https://www.poolgress.com/ui/ | grep -o 'premium-demo-entry-[A-Za-z0-9_-]*\.js'` 要等於 `dist/index.html` 裡的檔名
- 多個小改動盡量**合併成一次 ui/ 推送**，不要每項推一次
- HTML 有 ~10 分鐘 CDN 快取；cp 噴大量 CRLF warning 是正常的
- commit 結尾加 `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`
- 只改文件（.md）不用同步 ui/

## 3. 🎯 目前的主戰場：premium-demo.html（新首頁定案版）

**2026-09-05 起 premium 版已是正式首頁 `index.html`（/ui/）**；`premium-demo.html` 仍存在、內容相同（noindex），舊首頁改名保留在 `home-legacy.html`（noindex，vite input `homeLegacy`），使用者確認不需要後可刪。
Header 已改用共用 `Navbar` 的 `glass` 變體（透明漸層／米白玻璃，功能與其他頁相同）。公司正式 logo 已接上 `Logo.tsx`（`public/assets/logo/logo-mark.png`／`-white.png`，白底 PNG 用 ffmpeg 去背，準星與內圓為鏤空）。

檔案：`premium-demo.html`＋`src/premium-demo-entry.tsx`＋`src/PremiumDemoApp.tsx`＋`src/data/premium-demo.ts`（文案、色盤、時間表全在 data，改字不碰元件）。

### 頁面結構（四段價值階梯）

```
NAV（品牌字標＋常駐「開始學習」CTA）
HERO 滿屏：8 秒品牌影片插槽（暫深色佔位）＋宣言＋大標＋「探索 Poolgress」
  └ 首屏底部露出 56px 的下一章米白背景（LV 式 peek）
轉場區：01 / THE SPACE 眉標＋COMING SOON 徽章＋ YOUR TABLE. / YOUR SPACE. 大字
01 滿版橫幅（場館願景圖佔位）＋右側玻璃卡（高度 100svh-peek，底部再露 56px 給 02）
02 THE TABLE BECOMES THE GAME.（App 闖關）── 章節頭全寬先亮（兼任 01→02 接棒）
03 PLAY TOGETHER.（好友）
04 BEYOND（帶著進步連結更多人）
FINAL CTA 深底：你想怎麼玩？→ 開始玩(實心)｜線上課程｜預約教練(描邊)
FOOTER：全站共用 `<Footer theme="light" />`（2026-09-05 接上，桌機／手機皆同）
```

### ⚠️ 商業事實（不可虛構的底線）

- **場館確定要做，但約一年後才有；目前只有 App**。所以 01 是 COMING SOON＋未來式文案（「我們正在打造…」），不可寫成現在式
- 「探索場館」入口已移除（venues.html 是合作場館，跟自營場館是兩回事）
- 學員評價目前**刻意放假的**（使用者決定）；App 流程圖真人頭像**已取得同意**；客服信箱**全站統一 support@poolgress.com**

### 色盤（僅此頁，`data/premium-demo.ts` 的 `palette`）

Primary `#6F8FA3`(佔位圖/裝飾)｜Secondary `#AFC4CF`｜Bg `#F2EEE6`｜Sand `#D2C2AD`(主按鈕/徽章/深底眉標)｜Walnut `#816B59`(淺底眉標/編號)｜Charcoal `#252C30`(文字/深底)。
**對比度紀律**：新 Primary 偏淺，淺底小字一律 Walnut；主按鈕 Sand 底配 Charcoal 字（8.14:1）。改色後要重算 WCAG 並回報數字。標題字 Noto Serif TC（premium-demo.html 的 head 載入）。

### 動效語言（定稿，全部實測過）

- **Hero 平行 master timeline**：宣言逐字接力 0–0.75s（SPACE 0/箭0.07/PLAY 0.12/箭0.2/TOGETHER 0.27/箭0.38/PROGRESS 0.45，各 0.3s）＋CTA outline→米杏填色 0.03–0.79s（clip-path 左→右，同速同向）＋大標 0.12s 起（1.15s）。三段 overlap，不是接力
- **THE SPACE 大字**：垂直 reveal（opacity＋8px 上浮、0.52s、第二行晚 80ms、line-mask 保留）。曾是左→右 clip＋水平慣性，**已廢棄**
- **01→02 章節接棒**：02 的英文句是全寬章節頭、獨立早觸發（進視窗即亮，02 進場 ~15vh），主內容延後到 68% 線；03/04 同款章節頭（觸發 90%）
- **02–04 圖片**：本體全程靜態（opacity 1、無 transform）；上面一層**薄紗遮罩**（半透明底色 tint 上0.38/中0.48/下0.55）隨捲動溶解（95%→62% 區間、0.18s 平滑、雙向）
- **CTA hover 定稿（無任何流光/glow/sheen）**：Primary＝底色暖亮4%(#DACCB9)＋按鈕-1px；Secondary＝rgba(210,194,173,.07)填色＋邊框.55→.8＋文字微亮＋-1px；in 320ms/out 480ms、cubic-bezier(0.22,1,0.36,1)；**hover 文字不位移**
- **進場流光（entrance 專屬，非 hover）**：頁尾兩顆描邊鈕右上＋左下兩段定點流光，峰值 0.55、0.45s/0.6s 接力、只播一次（CSS `.pg-cta-sweep`）
- **Progress Point chapter marker**（`components/ProgressPoint.tsx`，2026-09-05 取代球路曲線）：眉標列「01 / THE SPACE ─ ● COMING SOON」——48px 1px 短線＋9px Primary 實心點＋22px 12% 外圈；動線由左而右一次性（文字 reveal→點滑入 20px→外圈→徽章→大標），無 glow／pulse／曲線。禁止再用跨區大曲線
- **Navbar hover system（locked，2026-09-05）**：`.pg-nav-link`——hover／active 文字 Secondary `#AFC4CF`＋1.5px 線（文字寬 55%）scaleX 由左展開＋5.5px 球沿線滑到末端右 3.5px，線與球共用 250ms ease-out（若真機看不出球在動，只把共同 duration 改 280ms，不加 delay）。色階：Logo＝Primary `#6F8FA3`（brand）／導覽預設＝首頁透明態 Sand（可讀性靠 Hero 頂部 scrim，Logo 字仍白）、首頁玻璃淺色態 Charcoal、其他頁 ink-700／互動＝Secondary。**後續不要因其他頁修改而動它**
- **prefers-reduced-motion**：全部退成靜態（revealed 預填）
- 觸發機制：自寫 scroll listener（單向鎖存 revealed Set），觸發線 lineFor() 依 id 分檔。**專案沒有 GSAP，使用者規格提到 GSAP 時一律用 CSS 等效實作、不加套件**

### peek 構圖（曾出過事故，小心）

`--pg-peek`（styles/tokens.css 的 `:root`：桌機 56/平板 44/手機 32px）驅動 Hero 與 01 橫幅高度 `calc(100svh - var(--pg-peek, 56px))`。
**⚠️ 事故紀錄**：曾用「從標記刪到檔尾」清 CSS 把這段誤刪 → Hero 塌版。現在有 `, 56px` 預設值防呆，但**清 CSS 區塊時務必確認範圍、改完重驗整頁**。

### 等使用者的素材（全部平面圖，不分層、圖裡不放字）

| 素材 | 規格 | 插槽 |
|---|---|---|
| 8 秒品牌影片 | 1600×900 MP4 循環 | `hero.video`（data）；目前先放 `hero.poster` 靜態圖（外→內場館圖，已到） |
| 01 場館願景圖 | 3200×1800 | `pillarSections[0].image`（已到，s01-venue.webp）；手機直式圖可另填 `imageMobile` |
| 02 App 闖關圖 | 3200×1800 | 同上 [1] |
| 03 好友圖 | 3200×1800 | [2] |
| 04 BEYOND 圖 | 3200×1800（概念圖已給過聊天版，待存檔 `public/assets/hero/s04-beyond.png`） | [3] |

檔案到 `public/assets/hero/`，填 data 路徑即接上。素材規格詳見 `DESIGN-BRIEF.md`（**使用者親自產圖**，無外部設計師）。

## 4. 已淘汰但保留的演示頁

`motion-demo.html`（捲動動畫版，含 S05 出竿草圖 `s05-strike.webp`）與 `comic-demo.html`（漫畫分鏡版）——方向已被 premium-demo 取代，留著沒刪。使用者確認不要後可清（連 vite.config.ts input 一起）。

## 5. 舊站（course.html 等 28 頁）仍然有效

第 3 節以外的全部頁面照舊：資料層 `src/data/`、狀態 `src/lib/`（交易 13 態、failed≠pending_confirmation、ownsCourse 要已登入）、預覽參數（`checkout.html?pay=`、`?demo=` 等）。細節看 README.md 與 git 歷史。首頁互動球桌已確定移出首頁、未來另行設計。`CONTENT-TODO.md` 是全站待補資料清單（課程名、教練、Chapter 03/04 單元等仍空）。

## 6. 部署以外的既有紀律

- **水平 grid 只有一套**：`.site-container`（styles/tokens.css，max 1680px、gutter `--site-gutter`＝手機 20px／≥768 clamp(32px,3.5vw,64px)）。Navbar 內容、Hero 文字、01／02 各段、Footer、course 頁都用它；**不要再各自寫 max-w-*／px-* 當容器**，Logo 與內容左緣會對不齊。照片要手機出血加 `site-container--bleed-sm`
- 新頁面：html＋entry＋**vite.config.ts input 加一行**
- 新 CSS 一律 `.pg-` 前綴；首頁放 styles/home.css、Navbar 放 nav.css、數值先進 tokens.css（見 §6a）；PowerShell 別碰中文檔（用 Git Bash / node 腳本），改完 `grep -rl '�' src`
- 全站樣式表有 h1/h2 顏色規則，**深底標題要 inline 指定 color** 否則被蓋掉
- 滿版元素做 scale 動畫會水平溢位 → reveal 放內層、外層 overflow-hidden

### 6a. Design System Phase 1（2026-09-05 Safe Refactor，已上線）

CSS 拆成四檔（index.css 只留 Tailwind @theme／base／課程頁 Hero 動畫／reduced-motion）：
- `styles/tokens.css`：`--pg-*` design tokens＝重構前的實際數值，**只命名不改值**（色彩、gutter、字級／行高／字距、各段 padding、media 比例／圓角、easing／duration）＋ `.site-container`
- `styles/nav.css`：Navbar state architecture——`header.pg-nav[data-nav-state]`＝`transparent-light｜transparent-dark｜solid-light｜solid-dark`，`[data-nav-surface]`＝`none｜floating｜page`；顏色全走 `--nav-fg／--nav-fg-hover／--nav-indicator／--nav-logo／--nav-icon／--nav-burger`。Logo 品牌字讀 `--logo-color`（`.pg-logo` Primary、`.pg-logo--on-dark` 白、Navbar 內接 `--nav-logo`）。觸發鈕加 `.pg-nav-trigger` 才吃 nav 顏色，popover／手機選單自己白底深字，**不再有 revert-layer**
- `styles/home.css`：首頁 typography roles（`.pg-t-h1／display／chapter／feature-h2／finale-h2／manifesto／eyebrow／eyebrow-feature／badge／body／cta`）與各段 spacing class，全部讀 tokens
- `styles/legacy-home.css`：舊首頁 `.hs-*／.one-*／.pg-illus-*／.pg-route`
- 已知歷史差異（Phase 2 再收斂）：page surface 連結色 ink-700／hover Secondary，floating 是 Charcoal／hover Primary；眉標 10／11／12／14px 四種；Footer charcoal 主題仍寫 hex
- 斷點統一：mobile <768、tablet ≥768（自訂 CSS 不再用 768/769）
- `index.html` 字體改載 Serif 500+700、Sans 400/500/600（01／02 大標終於是真 500，字寬窄 2.3%；內文各 OS 一致）
- 手機 01 文字左右 12px 是 intentional exception，token `--venue-mobile-copy-inset`
- Phase 2（Visual Normalization，未做、需使用者批准）：typography scale 收斂、vertical rhythm、Section primitive、PillarBlock 拆分、04→CTA 段距

## 7. ⚠️ 驗證環境的真相（本 session 實測確認，比舊手冊更嚴重）

預覽分頁是 `visibilityState: hidden`，以下**全部不會執行**：
- IntersectionObserver（連初始回呼都沒有）、requestAnimationFrame、CSS transition/animation 的實際播放、**scroll 事件（連程式 scrollTo 都不觸發）**、截圖（timeout）
- `getComputedStyle` 會讀到 transition 凍結前的**舊值** → 驗證一律讀 `getAttribute('style')` 的目標值
- 驗證手法：`window.scrollTo(...instant)` 後 **手動 `window.dispatchEvent(new Event('scroll'))`** 觸發自寫 listener，再讀 style 屬性。多寬度用 `resize_window`（注意面板縮小時 vh 可能為 0，先設 1440×900）
- dev server HMR 偶爾模組快取卡死（畫面全空、報不存在的 export）→ preview_stop 再 preview_start
- **因此動畫「手感」永遠要使用者親自看**，回報時明說哪些只驗了數值

## 8. 給下一個 session 的第一步

```bash
cd C:/Users/User/Documents/Poolgress
export PATH="/c/Program Files/nodejs:$PATH"
npm run build && git log --oneline -15
```

然後讀本檔。交付網址一律 https://www.poolgress.com/ui/ 開頭，目前主戰場是 **premium-demo.html**。

**最後再提醒**：使用者會在你工作到一半丟新需求。**做完手上的、驗證、部署，再依序處理，不要停下來問。**
