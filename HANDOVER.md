# Poolgress 課程官網 — 工作手冊（Session 交接）

> 給下一個 Claude Code session 讀的完整交接文件。
> 使用者不寫程式：技術操作全部由你負責，用簡單中文溝通與回報。
> 最後更新：2026-08-17

---

## 0. ⚠️ 先分清楚：這裡有兩個不同的專案

| | 本專案（這個資料夾） | 另一個專案 |
|---|---|---|
| Repo | `mmee14122/poolgress` | `poolgress/poolgress-website` |
| 內容 | 課程官網（React 前端產品） | poolgress.com 正式站（table7 練習圖編輯器等） |
| 網址 | https://mmee14122.github.io/poolgress/ | https://poolgress.com |
| 技術 | Vite + React 19 + TS + Tailwind v4，有 build | 純 HTML/JS，無 build |
| 交接文件 | 本檔 | `C:\Users\User\Downloads\給員工Claude的交接說明.md` |

使用者說「網站」時先判斷是哪一個。**本資料夾（`C:\Users\User\Documents\Poolgress`）永遠是課程官網。**

### ⚠️ 2026-08-17 起：交付目標只有 poolgress.com/ui/

使用者指示「後續工作只修改 https://www.poolgress.com/ui/ 單一網站」。實務上：

- 原始碼仍在本 repo 開發、build、commit、push（這是程式碼的家，不能省）
- **不再等 GitHub Pages 部署綠燈、不再回報 mmee14122.github.io 網址**
- 每次改完照第 2 節流程把 `dist/` 同步到 `~/poolgress-website` 的 `ui/`
- 回報時只給 `https://www.poolgress.com/ui/xxx.html` 的網址
- poolgress.com 根網域在 Vercel 上跑另一個站，**絕對不要動它的 DNS**

---

## 1. 環境（已就緒，不用重裝）

- Node.js 24（winget 裝的）。Bash tool 內每次都要先設 PATH：
  ```bash
  export PATH="/c/Program Files/nodejs:$PATH"
  ```
- `gh` CLI 已登入 **mmee14122**（scopes 含 repo、workflow）
- git 身分：Poolgress / poolgresswork@gmail.com（repo local config）
- 另一個 repo 已 clone 在 `~/poolgress-website`
- Dev server：`preview_start` ＋ `.claude/launch.json` 的 `course-site`（autoPort 開啟）
- `.claude/settings.json` 已允許同步流程需要的指令（`git rm -rq ui/`、`cp -r` 等），
  不會再被權限攔截

---

## 2. 部署流程

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run build                    # 必須綠燈才能繼續

# ① 主 repo（原始碼）
git add -A && git commit -m "中文訊息" && git push origin main

# ② 同步到 poolgress.com/ui/（唯一交付目標）
cd ~/poolgress-website
git pull --rebase origin main
git rm -rq ui/
cp -r "C:/Users/User/Documents/Poolgress/dist/." ui/
git add ui/ && git commit -q -m "更新 ui/：說明" && git push origin main
```

- **HTML 有 ~10 分鐘 CDN 快取**，剛部署抓到舊資產是正常的，提醒使用者 Ctrl+F5
- poolgress.com 會轉址到 www.poolgress.com（正常），驗證要用 `curl -sL`
- cp 時會噴大量 CRLF warning，是正常的，不是錯誤

---

## 3. 頁面地圖（24 個 HTML）

| 網址 | 進入點 | App | 說明 |
|---|---|---|---|
| `/` | index.html | HomeApp | 首頁（**5 區塊**，2026-08-17 精簡改版） |
| `/about.html` | about-entry | AboutApp | 關於 Poolgress（品牌願景，自首頁搬出） |
| `/course.html` | course.tsx | App | 課程詳情／販售頁（主戰場） |
| `/learn.html?course=&lesson=` | learn-entry | LearnApp | 學習頁（播放器＋章節） |
| `/challenges.html[?id=]` | challenges-entry | ChallengesApp | 實戰闖關列表／詳情 |
| `/cart.html` | cart-entry | CartApp | 購物車 |
| `/checkout.html` | checkout-entry | CheckoutApp | 結帳（`?demo=fail` 看失敗態） |
| `/purchase-success.html?order=` | purchase-success-entry | PurchaseSuccessApp | 購買完成 |
| `/login.html[?mode=][?redirect=]` | auth-entry | AuthApp | 登入；`redirect` 見第 5 節 |
| `/register.html` | register-entry | RegisterApp | 訪客訂單綁定帳號 |
| `/account.html` | account-entry | AccountApp | 個人檔案 |
| `/my-courses.html` `/stars.html` `/orders.html` `/invite.html` | 同上 | AccountApp | 個人區其他分頁（`data-page` 區分） |
| `/coach.html` | info-entry | InfoApp | 教練群（精選＋合作教練卡片） |
| `/coach.html?id=<coachId>` | 同上 | InfoApp | 個別教練頁（左介紹右預約，兩欄） |
| `/faq.html` `/contact.html` | info-entry | InfoApp | 支援頁（`data-page` 區分） |
| `/venues.html` | venues-entry | VenuesApp | 合作場館 |
| `/terms.html` `/privacy.html` `/service-agreement.html` `/join.html` `/partnership.html` | coming-soon-entry | ComingSoonApp | 條款與合作佔位頁（頁尾連結） |
| `/games.html` | 純 HTML | — | 舊網址，meta refresh 轉到 challenges |
| `/404.html` | coming-soon-entry | — | GitHub Pages 自動使用 |

※ 課程列表頁（courses.html）已刪除：只有一門課，導覽的「線上課程」直接連 course.html。

**新增頁面**：建 `新頁.html` ＋ `src/新頁-entry.tsx`，**然後一定要在 `vite.config.ts` 的 `rollupOptions.input` 加一行**，否則 build 不會產生該頁。

---

## 4. 資料層：全部集中在 `src/data/`

**這是本專案最重要的架構原則**：內容與畫面元件分離，改文案／換圖不用碰版面程式。

| 檔案 | 內容 |
|---|---|
| `site.ts` | 品牌名、主導覽、**頁尾全部資料**（地址、信箱、社群、App 下載、關於／支援欄）、促銷倒數、LINE 官方帳號 |
| `home.ts` | 首頁五區塊文案 ＋ **about 頁願景文案** |
| `courses.ts` | 課程目錄 ＋ `chaptersByCourse` 章節查表 ＋ `flatLessons()` |
| `course-detail.ts` | 主課程詳情：Hero、六段文案、章節單元、教練、評價、FAQ、購買卡、App QR |
| `catalog.ts` | 商品價格與優惠券 |
| `challenges.ts` | 闖關關卡；`appLinks` 改為引用 `site.appDownload`（單一來源） |
| `coaches.ts` | **教練群**：`featured`（精選）＋ `partners`（合作）＋ 預約時段／服務／場館／LINE |
| `venues.ts` | 合作場館（空陣列＝洽談中） |
| `user.ts` | 首次進站的預設值 |
| `index.ts` | 統一出口 |

素材放 `public/assets/{courses,challenges,coach,venues,hero,og}/`，尺寸見該資料夾的 README.md。

### coaches.ts 的 Coach 欄位（本次新增很多）

```
id / name / role（角色標籤）/ featured / photo / specialties
shortBio / philosophy / bio[] / stats[] / credentials[]
socialLinks: { line?, instagram?, youtube?, facebook?, website? }
courseIds[] / challengeIds[]
availability: { 'YYYY-MM-DD': ['19:00', ...] }   ← 預約開放時段
lessonPrice: number | null                        ← 單堂費用
venue: { name, address, mapUrl } | null           ← 場館＋Google 地圖
services: [{ id, name, durationMin, price }]      ← 預約服務項目
```

⚠️ 目前 `availability` 用 `demoAvailability()` 產生示範開放日（每週二四六），
`lessonPrice`／`durationMin`／`venue`／`socialLinks.line` 全部是 null 或待補。
**上線前必須換成真實資料**，檔內都有註解教怎麼填。

---

## 5. 狀態管理（`src/lib/`）

四個 store 都是同一套寫法：**localStorage + useSyncExternalStore + storage 事件跨分頁同步**。

| 檔案 | 負責 | 備註 |
|---|---|---|
| `cart.ts` | 購物車 | key `poolgress.cart.v1` |
| `session.ts` | 登入狀態 | key `poolgress.session.v1`，**不存密碼** |
| `library.ts` | **已購課程／進度／訂單／星星／教練課預約（bookings）** | key `poolgress.library.v1` |
| `auth.ts` | 認證介面 ＋ **redirect 工具**（見下） | 目前全部回 `not_configured` |
| `checkout.ts` | 結帳表單驗證、`paymentOptions` | 教練預約只取 card 與 atm |
| `validate.ts` | Email、統編、手機條碼、自然人憑證等 | |

### ⭐ 核心閉環（別弄壞它）
```
結帳成功 → library.completePurchase() → 我的課程 → 學習頁 → 進度回寫 → 訂單頁
預約付款成功 → library.addBooking() → 我的教練課（含 Google 行事曆＋聯絡教練）
```

**星星數只有一個來源**：`totalStarsOf(lib)`。

### 登入後回原頁（2026-08-17 新增）

`lib/auth.ts`：`loginUrlWithRedirect(target)`／`currentPageTarget()`／`afterLoginUrl()`。
未登入攔截頁的「前往登入」帶 `?redirect=./xxx.html`，登入成功回原頁。
**redirect 只接受站內相對頁面**（擋絕對網址／協定／`//`，防開放轉址）。

---

## 6. 各頁面現況（本次 session 大量改動）

### 6-1 首頁（5 區塊，2026-08-17 精簡改版）

順序：`S01Hero → S02Struggle → S05Pillars(功能卡) → S03Viewpoint(對照圖) → S06Entry(CTA)`

- 正文約 300 字（含按鈕 455 字）；「靠，我居然做到了」只在 Hero 出現一次
- **「One」一詞全站消失，不要寫回來**；S04One／S07VisionEntry 元件已刪除
- Hero 球路動畫保留為背景，敘事覆蓋層（sceneHint/sceneQuote）已移除
- Hero spacer 300→200px，讓功能卡在第二屏內出現
- `html { scroll-padding-top: 96px }` 已加（styles/index.css）
- CTA 下方有「關於 Poolgress」小字入口

### 6-2 關於 Poolgress（about.html）

願景四段文案自首頁搬來（`home.ts` 的 `about`），一字不改。深藍置中版型＋CTA。
導覽列（`site.nav`）已加「關於 Poolgress」。

### 6-3 課程頁（course.html）

- Hero 次要按鈕「查看課程資訊」→ `#info`
- 課程資訊／課程簡介／課程章節三個標題同一字體規格
- 球桌 Challenge 區：桌機露出智慧 QR＋雙商店 badge；手機只有一顆智慧下載按鈕
  （`site.appDownload.smartUrl` 未建立時停用，不放假連結）

### 6-4 教練（coach.html）

- 列表：精選教練橫式卡＋合作教練 3 欄卡（桌機一頁可看完）
- 個別頁：桌機左教練（53%）右預約卡（sticky，top 用 --promo-h），
  平板手機單欄：返回→摘要→**預約**→關於→經歷→課程／場館
- 預約卡：服務選單→月曆（綠勾＝開放）→時段→摘要→前往確認與付款
  →付款（Email＋信用卡/ATM＋**發票載具**）→處理中→成功
  （成功畫面有「前往我的教練課」＋「再預約一堂」）
- ⚠️ 付款／寄信／時段保留全是前端示範，畫面有明確標示；串接點 `CoachBooking.tsx` 的 `handlePay()`

### 6-5 我的課程（my-courses.html）

兩張卡：線上課程＋**我的教練課**。教練課每筆：
- 左：課程名（＋已確認/已結束膠囊）、教練、時段（品牌深藍粗體）、地點
- 右（相對左側資訊**垂直置中**）：加入 Google 行事曆（藍底白字）＋
  聯絡教練（白底藍框，單色訊息 icon，不用 LINE 官方綠）
- Google 行事曆連結帶標題／起訖／Asia/Taipei／地點；時長未定以 60 分鐘估算並註明
- 聯絡教練用 `coach.socialLinks.line` → 退 `site.lineUrl` → 都沒有就停用

### 6-6 頁尾（全站單一元件，Footer.tsx）

四欄：品牌聯絡（Logo→地址→信箱→社群）｜關於｜支援與條款｜App 下載（QR＋badge＋唯一標語）。
- theme：首頁與 about 用 `dark`，其餘 `light`；結構完全相同
- 中間兩欄 `lg:pt-15` 對齊「公司地址」小標
- 唯一標語「讓我們一起把撞球變得好玩！」在「下載 Poolgress App」標題下方
- 對比度已全數過 WCAG AA

---

## 7. 關鍵機制（動之前先讀）

1. **促銷倒數列**（PromoBar）：只掛課程頁；`--promo-h` 驅動全站 sticky 與錨點偏移。
2. **首頁 Hero Scroll Story**：桌機 sticky＋200px spacer；手機不釘住。
   所有裝飾覆蓋層必須 `pointer-events-none`。
3. **課程頁 Hero**：手機不可加淡出；`.hero-next` 不可加 transform。
4. **Scroll spy**：判定線用各區段自己的 `scroll-margin-top`，不可寫死。
5. **購買卡**：max-h＋內部捲動＋底部固定購買區；不可加 scroll-snap。
6. **結帳購買按鈕**：任何寬度下可見的「確認購買」恰好 1 個。
7. **導覽列深色模式**（首頁）：`<Navbar theme="hero" />`＋#hero-end sentinel。
8. **教練頁預約卡 sticky**：`top-[calc(var(--promo-h)+4.5rem)]`＋max-h 內部捲動；
   sticky 放格線欄本身。
9. **App 下載分流**：手機直接用 `smartUrl`（由下載頁判斷 iOS/Android）；
   桌機露出 QR＋badge。所有連結未填時顯示停用，**絕不放假連結**。

---

## 8. 踩過的坑（重要！）

1. **PowerShell 文字取代會弄壞 UTF-8 中文** → 批次取代用 Git Bash `sed` 或 node 腳本；改完 `grep -rl '�' src` 查亂碼。
2. **sed／perl 無法正確寫入 `\n` 跳脫字元** → 需要 `\n` 時改用 Edit 工具或字串陣列。
3. **bash heredoc 傳中文＋反引號給 node -e 會被 shell 吃掉** → 複雜取代寫成 .mjs 檔（放 scratchpad）再 node 執行。
4. **Vite dev server 模組圖會卡死**（大量增刪檔後）→ `preview_stop` 再 `preview_start`。
5. **預覽分頁是隱藏的**：動畫／IO／平滑捲動（含錨點點擊）不跑、截圖常 timeout。
   - 驗證錨點改用 `scrollIntoView({behavior:'instant'})`
   - hover／動畫類改動要老實請使用者實際滑一下
   - 截圖失敗改用 DOM 量測（getBoundingClientRect / getComputedStyle）
6. **對比度掃描**：Tailwind v4 輸出 oklab，用 1×1 canvas getImageData 取樣。
   箭頭函式在 javascript_tool 有時報怪錯，改傳統 function 寫法較穩。
7. **雙元件同名陷阱**：購物車抽屜是常駐 `role="dialog"`；測底部購買列用文字過濾。
8. **`querySelector` 會選到隱藏的桌機版元素** → 用 `offsetParent !== null` 過濾。
9. **Tailwind 同類 utility 的勝負看產生順序** → 需要時加 `!`。
10. **sticky 要放在 grid 欄本身**；祖先 transform 會殺 sticky。
11. **`#partners ul > li` 會選到專長標籤的 li** → 量卡片要用 `#partners > ul > li`。
12. **React onMouseEnter 靠 mouseover 委派** → dispatch `mouseover`（bubbles:true）。
13. **同步 ui/ 時 git rm 曾被權限攔** → `.claude/settings.json` 已加 allow 規則。

---

## 9. 目前刻意留白的資料（不可自行虛構）

全站搜尋「待補」「＿＿」「【待確認】」可找到所有佔位。

| 項目 | 位置 |
|---|---|
| **學員評價（範例文案，上線前必須換真實）** | `data/course-detail.ts` `reviews` |
| 課程名稱、Chapter 03/04 單元、闖關條件 | `data/course-detail.ts` |
| 教練姓名、經歷、IG、照片 | `data/coaches.ts` ＋ `course-detail.ts` `coach` |
| 教練預約：開放時段（示範產生）、單堂費用、服務時長 | `data/coaches.ts` `availability`/`lessonPrice`/`services` |
| 教練場館名稱、地址、Google 地圖連結 | `data/coaches.ts` `venue` |
| 教練／官方 LINE | `data/coaches.ts` `socialLinks.line`、`site.ts` `lineUrl` |
| 公司地址、客服信箱（support@ 待確認） | `data/site.ts` |
| 社群網址（IG/FB/YT） | `data/site.ts` `social` |
| App：智慧下載頁、QR 圖、商店連結 | `data/site.ts` `appDownload` |
| 星星規則與等級算法 | `data/user.ts`、星星頁 |
| 開課日期、預購截止日 | `course-detail.ts` |
| 合作場館 | `data/venues.ts` |
| 條款／服務契約／join／partnership 頁內容 | 各佔位頁 |
| 課程影片 `videoUrl` | 各單元資料 |

⚠️ **信箱不一致待使用者決定**：頁尾用 `support@poolgress.com`（待確認）、
聯絡頁用 `hello@poolgress.com`。已兩次提醒使用者統一，尚無回覆。

---

## 10. 尚未串接的 integration points

| 要接什麼 | 改哪裡 |
|---|---|
| 登入／註冊／忘記密碼 | `lib/auth.ts` 四個函式（介面已定義，UI 不用改） |
| 登入後導向 | `lib/auth.ts`：預設 `AFTER_LOGIN_URL`；有 `?redirect=` 時回原頁 |
| Apple／Google 登入 | `lib/auth.ts` `signInWithProvider` |
| 金流（課程） | `CheckoutApp.tsx` 的 `confirm()` |
| 金流＋預約＋確認信（教練課） | `components/coach/CoachBooking.tsx` `handlePay()`（成功畫面明確標示未扣款未寄信） |
| 已購課程／進度／訂單／預約 | `lib/library.ts` 整支換成 API |
| App 智慧下載頁 | 建一個依 UA 分流的頁面，網址填入 `site.appDownload.smartUrl` |
| 課程影片 | `LearnApp.tsx` 播放區改 iframe（位置已標註） |

⚠️ 登入頁底部有「示範登入」入口，接上真實 Auth 後移除。

---

## 11. 本次 session（2026-08-16～17）做了什麼

1. **刪除課程列表頁**：只有一門課，導覽直接連 course.html
2. **教練系統大改**：精選＋合作教練、個別教練頁（兩欄＋sticky 預約卡）、
   預約流程（日曆→時段→付款→成功）、發票載具、場館＋地圖、LINE 聯絡
3. **我的教練課**：預約寫入 library、Google 行事曆連結、聯絡教練按鈕、卡片多次改版
4. **登入 redirect**：未登入預約後登入可回到我的教練課（含防開放轉址）
5. **頁尾多次改版**：最終為四欄資訊型（品牌聯絡｜關於｜支援條款｜App 下載）＋深/淺 theme
6. **App 下載**：資料集中 `site.appDownload`、單一智慧 QR、依裝置分流
7. **首頁精簡改版**：6→5 區塊、正文減半、One 移除、願景搬到新的 about.html
8. **新增頁面**：about / service-agreement / join / partnership
9. **字體統一**：課程資訊＝課程簡介＝課程章節同規格
10. **Button 元件**支援 aria-label／title

---

## 12. 工作習慣（沿用）

- 改前先讀相關檔案；改後 `npm run build` ＋ DOM 驗證再 commit
- 每個需求：做完 → build → 驗證 → commit（中文訊息，結尾 Co-Authored-By）
  → 兩個 repo 都推 → 回報「改了什麼、哪裡看（**只給 /ui/ 網址**）、快取提醒」
- 使用者常在你工作到一半插入新需求 → **先做完手上的，再依序處理**
- 使用者會用**手繪標註截圖**表達版面需求（紅圈＝位置、箭頭＝移動方向），照圖改
- 資料紀律：使用者沒給的數字／名稱／政策一律「待補」，不虛構
- 假資料測完**一定要還原**（測試 LINE 網址、地圖連結等都測完即還原）
- 回報時避免過度技術術語，但**要說出真正的原因**（使用者會問「為什麼」）

---

## 13. 給下一個 session 的第一步

```bash
cd C:/Users/User/Documents/Poolgress
export PATH="/c/Program Files/nodejs:$PATH"
npm run build          # 確認綠燈
git log --oneline -15  # 看最近做了什麼
```

然後讀 `README.md`（使用者導向的操作手冊）與本檔（工程細節）。
交付網址一律用 https://www.poolgress.com/ui/ 開頭。
