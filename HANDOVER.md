# Poolgress 課程官網 — 工作手冊（Session 交接）

> 給下一個 Claude Code session 讀的完整交接文件。
> 使用者不寫程式：技術操作全部由你負責，用簡單中文溝通與回報。
> 最後更新：2026-08-16

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

⚠️ 本專案的產出會**同步部署到兩個地方**（見第 2 節），poolgress.com 根網域在 Vercel 上跑另一個站，**絕對不要動它的 DNS**。

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

---

## 2. 部署流程（**每次都要兩邊都推**）

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run build                    # 必須綠燈才能繼續

# ① 主 repo
git add -A && git commit -m "中文訊息" && git push origin main

# ② 同步到 poolgress.com/ui/
cd ~/poolgress-website
git pull --rebase origin main
git rm -rq ui/
cp -r "C:/Users/User/Documents/Poolgress/dist/." ui/
git add ui/ && git commit -q -m "更新 ui/：說明" && git push origin main
```

等綠燈：
```bash
gh run watch $(gh run list --repo mmee14122/poolgress --limit 1 --json databaseId --jq '.[0].databaseId') --repo mmee14122/poolgress --exit-status
```

- **HTML 有 ~10 分鐘 CDN 快取**，剛部署抓到舊資產是正常的，提醒使用者 Ctrl+F5
- poolgress.com 會轉址到 www.poolgress.com（正常），驗證要用 `curl -sL`
- 自訂網域 course.poolgress.com 目前解綁中（Namecheap CNAME 一直沒設成功）

---

## 3. 頁面地圖（22 個 HTML）

| 網址 | 進入點 | App | 說明 |
|---|---|---|---|
| `/` | index.html | HomeApp | 首頁（6 區塊） |
| `/course.html` | course.tsx | App | 課程詳情／販售頁（主戰場） |
| `/learn.html?course=&lesson=` | learn-entry | LearnApp | 學習頁（播放器＋章節） |
| `/challenges.html[?id=]` | challenges-entry | ChallengesApp | 實戰闖關列表／詳情 |
| `/cart.html` | cart-entry | CartApp | 購物車 |
| `/checkout.html` | checkout-entry | CheckoutApp | 結帳（`?demo=fail` 看失敗態） |
| `/purchase-success.html?order=` | purchase-success-entry | PurchaseSuccessApp | 購買完成 |
| `/login.html[?mode=register\|forgot]` | auth-entry | AuthApp | 登入／註冊／忘記密碼 |
| `/register.html` | register-entry | RegisterApp | 訪客訂單綁定帳號 |
| `/account.html` | account-entry | AccountApp | 個人檔案 |
| `/my-courses.html` `/stars.html` `/orders.html` `/invite.html` | 同上 | AccountApp | 個人區其他分頁（`data-page` 區分） |
| `/coach.html[?id=]` `/faq.html` `/contact.html` | info-entry | InfoApp | 支援頁（`data-page` 區分）；教練頁帶 `id` 即為個別教練頁 |
| `/venues.html` | venues-entry | VenuesApp | 合作場館 |
| `/terms.html` `/privacy.html` | coming-soon-entry | ComingSoonApp | 條款佔位頁 |
| `/games.html` | 純 HTML | — | 舊網址，meta refresh 轉到 challenges |
| `/404.html` | coming-soon-entry | — | GitHub Pages 自動使用 |

**新增頁面**：建 `新頁.html` ＋ `src/新頁-entry.tsx`，**然後一定要在 `vite.config.ts` 的 `rollupOptions.input` 加一行**，否則 build 不會產生該頁。

---

## 4. 資料層：全部集中在 `src/data/`

**這是本專案最重要的架構原則**：內容與畫面元件分離，改文案／換圖不用碰版面程式。
（原本散在 `src/content/`，2026-08 已整併過來，`src/content/` 已不存在）

| 檔案 | 內容 |
|---|---|
| `site.ts` | 品牌名、主導覽、頁尾連結、促銷倒數（`endsAt`）、聯絡信箱 |
| `home.ts` | 首頁全部文案 |
| `courses.ts` | 課程目錄（列表卡片）＋ `chaptersByCourse` 章節查表 ＋ `flatLessons()` |
| `course-detail.ts` | 主課程詳情：Hero、六段文案、章節單元、教練、評價、FAQ、購買卡 |
| `catalog.ts` | 商品價格與優惠券 |
| `challenges.ts` | 闖關關卡、App 商店連結 `appLinks` |
| `coaches.ts` | **教練群**：`featured`（精選）＋ `partners`（合作教練卡片）＋ `availability`（預約時段），加一筆就自動生效 |
| `venues.ts` | 合作場館（目前空陣列＝顯示洽談中） |
| `user.ts` | 首次進站的預設值（預設全空，購買後才有課程） |
| `index.ts` | 統一出口，含 `coaches`／`testimonials`／`faqs` 別名 |

素材放 `public/assets/{courses,challenges,coach,venues,hero,og}/`，尺寸見該資料夾的 README.md。

---

## 5. 狀態管理（`src/lib/`）

四個 store 都是同一套寫法：**localStorage + useSyncExternalStore + storage 事件跨分頁同步**。

| 檔案 | 負責 | 備註 |
|---|---|---|
| `cart.ts` | 購物車 | key `poolgress.cart.v1` |
| `session.ts` | 登入狀態（Email／名稱／頭像） | key `poolgress.session.v1`，**不存密碼** |
| `library.ts` | **已購課程／學習進度／訂單／星星** | key `poolgress.library.v1` |
| `auth.ts` | 認證 API 介面 | 目前全部回 `not_configured`，**不做假登入** |
| `checkout.ts` | 結帳表單驗證與 demo 訂單 | |
| `validate.ts` | Email、統編等驗證規則 | |

### ⭐ 核心閉環（別弄壞它）
```
結帳成功 → library.completePurchase()
        → 我的課程出現該課 → 學習頁 → 完成單元 → 進度回寫 → 訂單頁
```
這是整個產品最先被試的動線。改結帳或學習頁時務必回歸測試這條線。

**星星數只有一個來源**：`totalStarsOf(lib)`。選單、個人頁、星星頁都讀它，不要各自寫死。

---

## 6. 關鍵機制（動之前先讀）

1. **促銷倒數列**（`PromoBar`）：只掛課程頁；掛載時對 `<html>` 加 `has-promo` → CSS 變數 `--promo-h: 2rem`。**全站 sticky 與錨點偏移都用 `calc(var(--promo-h)+…)`**，改 sticky top 務必沿用。

2. **首頁 Hero Scroll Story**（`S01Hero` + `--story-p`）：
   - 桌機 sticky 舞台 ＋ **300px** spacer（滾輪約三下完成）
   - 手機**不釘住**（普通 Hero），效果在最初 40vh 內完成
   - 進度由 CSS scroll timeline 驅動（`html.home-hero-scroll`），不支援時 JS 後援（rAF 節流）
   - ⚠️ **所有裝飾覆蓋層都必須 `pointer-events-none`**——曾發生金句容器（opacity 0）蓋住 CTA 按鈕，手機完全點不到

3. **課程頁 Hero**（`CourseHero` + `--hero-p`）：
   - 桌機 sticky ＋ 22vh spacer；**淡出效果限定桌機**
   - ⚠️ 手機**不可**加淡出：手機不釘住，內容淡出後區塊仍占同高度，會留一大片空白
   - `.hero-next` 不可加 transform（內含 sticky 側欄，祖先 transform 會殺 sticky）

4. **The One 動畫**（`S04One`）：6 秒無限循環，只在 IntersectionObserver 判定進入視窗時掛 `.one-play`，離開即移除（不在畫面外空轉）。

5. **Scroll spy**（`useScrollSpy`）：
   - 判定線**用各區段自己的 `scroll-margin-top`**，不可寫死數值
     （曾寫死 140px，但手機 scroll-mt 是 160px → 點索引後高亮跳回前一項）
   - 點擊錨點後鎖定高亮 900ms，避免平滑捲動過程索引閃動

6. **購買卡**（`CourseCard` + `App.tsx` 右欄）：
   - `max-h: calc(100dvh - …)` ＋ 內部捲動 ＋ **底部固定購買區**
   - 這是為了瀏覽器縮放 110%/125% 時按鈕不被裁切
   - ⚠️ **不可加 scroll-snap**：曾用 proximity 吸附，會把捲動位置拉走導致寬螢幕按鈕搆不到

7. **結帳購買按鈕**：桌機只在明細卡、手機只在底部固定列，**互斥且共用同一個 `confirm()`**。
   `submitting` ref 同步上鎖防連點。任何寬度下可見的「確認購買」都必須恰好 1 個。

8. **導覽列深色模式**（首頁）：`<Navbar theme="hero" />` ＋ Hero 底部 16px sentinel ＋ IntersectionObserver。
   深色態用 `.nav-hero` 的 CSS 覆寫子元件顏色，**彈出面板（role=menu／region／dialog、#mobile-menu）以 reset 排除**。

---

## 7. 踩過的坑（重要！）

1. **PowerShell 文字取代會弄壞 UTF-8 中文** → 批次取代用 Git Bash `sed`；改完 `grep -rl '�' src` 查亂碼。
2. **sed／perl 無法正確寫入 `\n` 跳脫字元**（會變成真的換行，造成 TS 語法錯誤）。
   需要在字串裡放 `\n` 時，**改用 Edit 工具或改成字串陣列**（如 `nudgeLines`、`titleLines`）。
3. **Vite dev server 模組圖會卡死**（大量增刪檔後頁面空白／渲染舊版、console 出現不存在的變數錯誤）
   → `preview_stop` 再 `preview_start`。**production build 不受影響**，要判斷真假錯誤就跑 `npx vite preview` 開 dist 驗證。
4. **預覽分頁是隱藏的**：不產生畫格 → CSS 動畫／transition／rAF／**IntersectionObserver 不跑**、截圖常失敗或空白、`:hover` 無法模擬。
   - 動畫類與 IO 類改動要老實告訴使用者「請你實際滑一下確認」
   - 截圖失敗時改用 DOM 量測（`getBoundingClientRect`、`getComputedStyle`）驗證
5. **對比度掃描**：Tailwind v4 輸出 oklab，解析要用 1×1 canvas `getImageData` 取樣。掃描時**排除 `aria-hidden` 的裝飾元素**。全站 13 頁目前 WCAG AA 0 失敗，改色後要重掃。
6. **雙元件同名陷阱**：購物車抽屜是常駐 DOM 的 `role="dialog"`；`div.fixed.bottom-0` 也可能選到它。測底部購買列要用文字內容過濾。
7. **`querySelector` 會選到隱藏的桌機版元素**：桌機與手機各有一份（`hidden lg:flex` / `lg:hidden`），要用 `offsetParent !== null` 過濾。
8. **Tailwind 同類 utility 的勝負看產生順序，不是 class 屬性順序**：`text-brass-300` 可能輸給元件變體的 `text-ink-700` → 加 `!`（如 `text-brass-300!`）。
9. **`sticky` 要放在 grid 欄本身**（`items-start` 會讓內層失效）；祖先 transform 會殺 sticky。
10. **手機模擬器的 `window.innerHeight` 可能失真**，以 CSS px 幾何為準。
11. **React 的 `onMouseEnter` 靠 mouseover 委派**：測 hover 要 `dispatchEvent(new MouseEvent('mouseover', {bubbles:true}))`，dispatch `mouseenter` 無效。

---

## 8. 目前刻意留白的資料（不可自行虛構）

全站搜尋「待補」「＿＿」「【待確認】」可找到所有佔位。

| 項目 | 位置 |
|---|---|
| **學員評價（範例文案，上線前必須換真實）** | `data/course-detail.ts` `reviews` |
| 課程名稱、Chapter 03/04 單元、闖關條件 | `data/course-detail.ts` |
| 教練姓名、經歷、IG、照片 | `data/coaches.ts` ＋ `course-detail.ts` `coach` |
| 教練可預約時段（目前為示範資料） | `data/coaches.ts` `availability` |
| 教練單堂費用 | `data/coaches.ts` `lessonPrice`（目前 null） |
| 教練場館名稱、地址、Google 地圖連結 | `data/coaches.ts` `venue` |
| 星星規則與等級算法 | `data/user.ts`、星星頁 |
| 開課日期、預購截止日 | `course-detail.ts` `info.startDate`、`purchase.priceDeadline` |
| App 商店連結、deep link、下載 QR code | `data/challenges.ts`、`course-detail.ts` `challenge.qrCode` |
| 合作場館 | `data/venues.ts`（空陣列） |
| 服務條款、隱私權政策條文 | terms/privacy 頁 |
| 課程影片 `videoUrl` | 各單元資料 |

---

## 9. 尚未串接的 integration points

| 要接什麼 | 改哪裡 |
|---|---|
| 登入／註冊／忘記密碼 | `lib/auth.ts` 四個函式（介面已定義好，UI 不用改） |
| 登入後導向 | `lib/auth.ts` `AFTER_LOGIN_URL` |
| Apple／Google 登入 | `lib/auth.ts` `signInWithProvider` |
| 金流 | `CheckoutApp.tsx` 的 `confirm()`（目前 setTimeout 模擬） |
| 教練預約付款與寄確認信 | `components/coach/CoachBooking.tsx` 的 `handlePay()`（目前 setTimeout 模擬，成功畫面明確標示未扣款、未寄信） |
| 已購課程／進度／訂單 | `lib/library.ts` 整支換成 API，函式簽名可不變 |
| App deep link | `data/challenges.ts` |
| 課程影片（外部平台） | `LearnApp.tsx` 播放區改 iframe（位置已標註） |

⚠️ 登入頁底部有明確標示的**「示範登入」**入口（後端串接前用來預覽個人頁面），接上真實 Auth 後移除。

---

## 10. 工作習慣（沿用）

- 改前先讀相關檔案；改後 `npm run build` ＋ 瀏覽器 DOM 驗證再 commit
- 每個需求：做完 → build → 驗證 → commit（中文訊息，結尾 Co-Authored-By）→ **兩個 repo 都推** → 等綠燈 → 回報「改了什麼、哪裡看、快取提醒」
- 使用者常在你工作到一半插入新需求（system-reminder 形式）→ **先做完手上的，再依序處理**，最後一起 commit 或分批 commit 都可以
- 資料紀律：使用者沒給的數字／名稱／政策一律「待補」，不虛構（尤其學員見證與價格）
- 使用者的圖片訊息通常就是需求本體（貼截圖＝改成這樣／修這裡）
- 回報時避免過度技術術語，但**要說出真正的原因**（使用者會問「為什麼」）

---

## 11. 本次 session（2026-08-15～16）做了什麼

大型改造，從「幾個頁面的原型」變成「可展示、可延續開發的完整前端產品」：

1. **補齊頁面**：課程列表、實戰闖關（列表＋詳情）、學習頁、教練群、FAQ、聯絡、合作場館、購買完成、404
2. **打通核心閉環**：新增 `lib/library.ts`，結帳成功真的寫入已購課程與訂單
3. **資料層統一**：`src/content/` → `src/data/`，新增 `index.ts` 單一出口
4. **重寫 README.md**：繁中操作手冊（新增課程／換圖換影片／新增 Challenge／串接點）
5. **建立 `public/assets/`** 素材資料夾與尺寸規範
6. **登入系統**：login.html（登入／註冊／忘記密碼同頁切換）＋ session store ＋ 頭像選單
7. **大量 UI 修正**：見 git log（Hero 動畫縮短、對比度、手機版各種修正）

---

## 12. 給下一個 session 的第一步

```bash
cd C:/Users/User/Documents/Poolgress
export PATH="/c/Program Files/nodejs:$PATH"
npm run build          # 確認綠燈
git log --oneline -10  # 看最近做了什麼
```

然後讀 `README.md`（使用者導向的操作手冊）與本檔（工程細節）。
