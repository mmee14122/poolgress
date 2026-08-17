# Poolgress 課程官網 — 工作手冊（Session 交接）

> 給下一個 Claude Code session 讀的完整交接文件。
> 使用者不寫程式：技術操作全部由你負責，用簡單中文溝通與回報。
> 最後更新：2026-08-17（本次 session 大改，請整份重讀）

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

### 交付目標只有 poolgress.com/ui/

- 原始碼仍在本 repo 開發、build、commit、push（這是程式碼的家，不能省）
- **不再等 GitHub Pages 部署綠燈、不再回報 mmee14122.github.io 網址**
- 每次改完照第 2 節流程把 `dist/` 同步到 `~/poolgress-website` 的 `ui/`
- 回報時只給 `https://www.poolgress.com/ui/xxx.html` 的網址
- poolgress.com 根網域在 Vercel 上跑另一個站，**絕對不要動它的 DNS**

---

## 1. ⭐ 使用者的工作方式（最重要，先讀這一節）

**使用者會在你工作到一半插入新指令。這是常態，不是打斷。**

處理原則：

1. **不要因為收到新指令就停下手上的工作**。把當前這一項做完、驗證、commit、部署，再依序處理新指令。
2. 新指令會以 `<system-reminder>` 的形式和工具結果一起出現。看到就記下來，接著做完手邊的事。
3. 一則訊息裡可能同時包含「上一個需求的修正」與「全新需求」，兩個都要做完。
4. 使用者常常**改完又改回來**（例如訂單詳情頁做好又要刪、CTA 文案改了又要還原）。照做即可，不用質疑，但要在回報時說清楚現在是哪一版。
5. 使用者會用**手繪標註截圖**表達需求（紅圈＝位置、箭頭＝移動方向），照圖改。
6. 使用者常貼**過期的快取畫面**當作 bug 回報。先確認是不是上一版的畫面，是的話直接說明並提醒 Ctrl+F5，不要瞎改。
7. 需求裡引用的舊文案不一定是最新的（他可能從更早的訊息複製）。**以最近一次明確指示為準**，並在回報時說明你保留了哪一版。

回報格式（使用者看得懂的中文）：
- 改了什麼 → 為什麼這樣改（真正的原因，他會問「為什麼」）→ 哪裡看（只給 /ui/ 網址）→ 快取提醒
- **實測數據要寫出來**（例如「按鈕高度 52px」「三個寬度皆無溢位」），不要只說「已完成」
- **沒測到的要誠實說**，不可把未驗證的說成通過

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
- cp 時會噴大量 CRLF warning，正常，不是錯誤
- commit 訊息用中文、結尾加 `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`

---

## 3. 頁面地圖（28 個 HTML）

| 網址 | 進入點 | App | 說明 |
|---|---|---|---|
| `/` | index.html | HomeApp | 首頁（**4 區塊**，見第 4 節） |
| `/about.html` | about-entry | AboutApp | 關於 Poolgress（Hero＋願景雙欄＋合作成果） |
| `/course.html` | course.tsx | App | 課程詳情／販售頁（主戰場） |
| `/learn.html?course=&lesson=` | learn-entry | LearnApp | 學習頁（播放器＋章節） |
| `/challenges.html[?id=]` | challenges-entry | ChallengesApp | App 四步驟流程＋下載入口（關卡列表已移除） |
| `/cart.html` | cart-entry | CartApp | 購物車 |
| `/checkout.html` | checkout-entry | CheckoutApp | 結帳（13 種交易狀態，見第 6 節） |
| `/purchase-success.html?order=` | purchase-success-entry | PurchaseSuccessApp | 購買完成 |
| `/login.html[?mode=][?redirect=][?auth=]` | auth-entry | AuthApp | 登入／註冊／忘記密碼 |
| `/register.html?email=` | register-entry | RegisterApp | 訪客訂單綁定帳號（驗證碼流程） |
| `/account.html` `/my-courses.html` `/stars.html` `/orders.html` `/invite.html` | account-entry | AccountApp | 個人中心五個分頁（`data-page` 區分） |
| `/friend.html?id=` | friend-entry | FriendProfileApp | **好友公開摘要**（本次新增） |
| `/status.html?state=` | status-entry | StatusApp | **系統狀態頁**（本次新增） |
| `/coach.html[?id=]` `/faq.html` `/contact.html` | info-entry | InfoApp | 教練群／個別教練頁／支援頁 |
| `/venues.html` | venues-entry | VenuesApp | 合作場館（本次大改，見第 5 節） |
| `/terms.html` `/privacy.html` `/service-agreement.html` `/join.html` `/partnership.html` | coming-soon-entry | ComingSoonApp | 條款與合作佔位頁 |
| `/games.html` | 純 HTML | — | 舊網址，meta refresh 轉到 challenges |
| `/404.html` | 純靜態 | — | GitHub Pages 自動使用（未經 build，風格與站內不同，**改寫需先確認**） |

**新增頁面**：建 `新頁.html` ＋ `src/新頁-entry.tsx`，**然後一定要在 `vite.config.ts` 的 `rollupOptions.input` 加一行**，否則 build 不會產生該頁。

**⚠️ 網址不可隨意改名**：`invite.html` 的分頁已改名為「我的好友」，但檔名刻意保留，避免既有連結與書籤失效。

---

## 4. 首頁現況（本次大幅重整）

順序：`S01Hero → S01bTableChoice → S05bAppTeaser → S05cAppFriends → S06Entry`

| 區塊 | 檔案 | 底色 | 說明 |
|---|---|---|---|
| Hero | S01Hero | `#0F1E33` | 捲動故事動畫，未改動。主 CTA 指向 `#table-choice` |
| **這顆球，你會怎麼打？** | S01bTableChoice | `#142C4A` | 互動球桌，見下方 |
| App 第一段（個人闖關） | S05bAppTeaser | 白 | 文字左／手機右 |
| App 第二段（好友與星星） | S05cAppFriends | `brand-50` | 手機左／文字右，與上段交錯 |
| 收尾 CTA | S06Entry | `brand-900` | **中央單欄**，首頁終章 |

### ⏸ 暫時隱藏的三區（元件與文案都保留）

`S02Struggle`（痛點）、`S03Viewpoint`（觀點對照）、`S05Pillars`（功能卡）
在 `HomeApp.tsx` 內以註解隱藏（**import 也要一起註解，否則 TS 會因未使用而 build 失敗**）。
使用者尚未決定是否永久刪除。要復原就把註解拿掉。

### 「這顆球，你會怎麼打？」互動（本次 session 最大的新功能）

**核心設計原則：先選、後揭曉。**

- 選擇前畫面上**只有**：標題、「選一條，看看球會怎麼走」、球桌上三條虛線與中性的 A／B／C 標記、右側「選一條你直覺會走的球路」＋三顆圓鈕
- **絕對不可提前公布**打法名稱、結果、Insight 或 CTA。提前公布 = 整段互動退化成產品導覽列
- 選完 → 其他球路淡出 → 球跑完 → 停頓 → 揭曉「B｜我已經在想下一桿」→ Insight → 最後才出現 CTA
- 三條都合理，沒有標準答案。**不可出現**「學習型／策略型／娛樂型」等人格標籤，也不可有對錯、得分、慶祝動畫

| 路線 | 動畫結果 | Insight | CTA |
|---|---|---|---|
| A 穩穩把球打進 | 進袋，母球跑遠離下一顆球 | 進球只是開始。 | 探索完整課程 → course.html |
| B 我已經在想下一桿 | 進袋，母球吃庫停在下一顆球旁 | 高手看的，往往不是這一桿。 | 進入球桌演練 → challenges.html |
| C 來點有趣的打法 | 母球借上庫、目標球借右庫進中袋 | 撞球，本來就可以很好玩。 | 看看好友闖關 → challenges.html |

**技術**：球用 CSS `offset-path` 沿 SVG 路徑移動（無物理引擎、無新套件）。所有球路、時序、文案、CTA 都在 `data/table-choice.ts`。

**固定舞台（別破壞）**：Section 桌機 `min-height: calc(100svh - 4rem)`、右欄有 min-height、副標用 opacity 保留空間、Closing Zone 空間永遠存在。目的是**初始／A／B／C 四種狀態下 Section 高度完全不變**（實測差 0px）。改動這一區時務必重測，不可讓下一區跳動。

**品牌收尾**：「沒有標準答案。只有你想怎麼打。／Poolgress，從你的下一桿開始。」
- 位置在球桌＋Result 兩欄的**正下方置中**，不屬於任何一欄
- 只有三條都體驗過才淡入（`sessionStorage: poolgress.tableChoice.v1`）
- 不可改成一開始就顯示

---

## 5. 資料層：全部集中在 `src/data/`

**這是本專案最重要的架構原則**：內容與畫面元件分離，改文案／換圖不用碰版面程式。

| 檔案 | 內容 |
|---|---|
| `site.ts` | 品牌名、主導覽、頁尾全部資料、促銷倒數、LINE、App 下載 |
| `home.ts` | 首頁全部文案（含 `appTeaser`、`appFriends`、`entry`）＋ about 頁文案 |
| `table-choice.ts` | **互動球桌**：三條路線的球路、時序、揭曉文案、CTA |
| `course-detail.ts` | 主課程詳情：Hero、章節、教練、評價、FAQ、購買卡 |
| `catalog.ts` | 商品、**優惠券驗證**（5 種失效原因）、**購物車例外**（下架／改價／優惠到期） |
| `challenges.ts` | App 四步驟流程（`appFlow`，含整圖與四張分圖） |
| `coaches.ts` | 教練群、預約時段／服務／場館／LINE |
| `friends.ts` | **好友**：friends／friendStats／inviteLink（真實資料為空）＋ demoFriends |
| `venues.ts` | 合作場館（真實為空）＋ demoVenues |
| `user.ts` `courses.ts` `index.ts` | 預設值、課程目錄、統一出口 |

素材放 `public/assets/{courses,challenges,coach,venues,hero,og}/`。

### 開發預覽參數（正式資料一律維持真實狀態）

| 網址參數 | 效果 |
|---|---|
| `checkout.html?pay=<情境>` | 模擬 13 種付款結果（見第 6 節） |
| `checkout.html?debug` | 顯示右下角付款情境切換面板（開發模式自動顯示） |
| `cart.html?cart=unavailable\|price_changed\|offer_expired` | 購物車三種例外 |
| `login.html?auth=<錯誤碼>` | 模擬登入失敗（invalid_credentials、email_not_found…） |
| `venues.html?demo=venues` | 載入示範場館，預覽卡片與篩選 |
| `venues.html?state=loading\|error` | 場館載入中／載入失敗 |
| `invite.html?demo=friends` | 載入示範好友，預覽列表與統計 |
| `friend.html?id=friend-1` | 好友公開摘要（示範資料） |
| `status.html?state=maintenance\|offline\|error\|not-found` | 系統狀態頁四種 |

**原則**：預覽資料只在帶參數時載入，正式網址永遠顯示真實狀態（多半是空狀態），並在畫面上明確標示「示範資料」。

---

## 6. 狀態管理（`src/lib/`）

| 檔案 | 負責 |
|---|---|
| `cart.ts` | 購物車（key `poolgress.cart.v1`） |
| `session.ts` | 登入狀態（`poolgress.session.v1`，**不存密碼**） |
| `library.ts` | 已購課程／進度／訂單／星星／教練課預約（`poolgress.library.v1`） |
| `payment.ts` | **交易狀態模型＋訂單鎖＋情境模擬**（本次新增） |
| `auth.ts` | 認證介面（全部回 `not_configured`）＋ redirect 工具＋ `mockAuthError()` |
| `checkout.ts` | 表單驗證、付款方式、訂單編號產生 |
| `validate.ts` | Email、統編、手機條碼、自然人憑證 |

四個 store 都是 **localStorage + useSyncExternalStore + storage 事件跨分頁同步**。

### ⭐ 核心閉環（別弄壞它）
```
結帳成功 → library.completePurchase() → 我的課程 → 學習頁 → 進度回寫 → 訂單頁
預約付款成功 → library.addBooking() → 我的教練課
訪客購買 → register.html 驗證碼 → session.signIn() → 我的課程
```

**星星數只有一個來源**：`totalStarsOf(lib)`。

### 交易狀態模型（`lib/payment.ts`）

13 種狀態：`idle / validating / processing / requires_action / succeeded / succeeded_provisioning / failed / cancelled / pending_confirmation / already_paid / already_owned / network_error / session_expired`

**最重要的設計**：`failed` 與 `pending_confirmation` **是兩種不同狀態，絕不可混為一談**。結果未確認時：
- 不可說「付款失敗」
- 必須寫「請先不要再次付款」
- 提供「重新確認付款狀態」與「前往我的訂單」

**訂單鎖（mock idempotency）**：`poolgress.orderLock.v1`。重新整理、按上一頁、另開分頁都讀得到同一筆訂單，因此處理中／已付款不會退回可再付款的表單。後端接上後改為 `GET /orders/:id`。

**6 種失敗原因**：card_declined／card_invalid／three_ds_failed／gateway_unavailable／network_timeout／method_unavailable，每種都有人類看得懂的說明。

### 擁有課程的判定（踩過的坑）

`ownsCourse(lib, courseId, signedIn)` — **必須同時已登入**。學習庫存在本機、訪客購買也會寫入，只看學習庫會讓未登入的人看到「開始學習」，點進去卻被登入攔截。

---

## 7. 共用元件

| 元件 | 用途 |
|---|---|
| `components/StatusIllustration.tsx` | **微型狀態插圖系統**（10 種狀態），極簡俯視球桌語言 |
| `components/checkout/StateViews.tsx` | 付款失敗／待確認／已付款／已擁有／開通中／網路中斷／需驗證／取消／逾時／空車 |
| `components/dev/PaymentDebugPanel.tsx` | 付款情境切換（開發模式或 `?debug`） |
| `components/account/FriendsPanel.tsx` | 我的好友（含邀請 modal） |
| `components/challenges/AppFlow.tsx` | App 四步驟流程（整圖＋手機垂直版） |
| `components/cart/CartItemIssue.tsx` | 購物車例外提示 |
| `ui/Button.tsx` `ui/Field.tsx` `ui/Toast.tsx` | 基礎元件 |

### 失敗畫面的語氣（品牌規範）

Poolgress 的失敗狀態要像「這一桿差一點，但你知道下一次怎麼調整」：
- **不用**紅色叉叉、哭臉、滿版紅底、電競風
- 提示色用低飽和磚紅 `#B5645A`、琥珀，只做球路與重點
- 成功用 `#5B9E8F`，等待用柔和藍
- 插圖寬 88–140px，克制，不搶過資訊與 CTA
- 標題像「這一桿差一點。」「球路暫時中斷了。」「這一球已經進了。」

---

## 8. 關鍵機制（動之前先讀）

1. **促銷倒數列**（PromoBar）：只掛課程頁；`--promo-h` 驅動全站 sticky 與錨點偏移。**整條文字區不可點**（`pointer-events-none`），唯一可點的是右上淺藍關閉鈕。
2. **首頁 Hero Scroll Story**：桌機 sticky＋200px spacer；手機不釘住。裝飾覆蓋層必須 `pointer-events-none`。
3. **課程頁 Hero 已改為靜態**：不再 sticky、不再有 spacer、不隨捲動淡出。桌機高度 `min(760px, 100svh - 導覽 - 促銷列)`。
4. **互動球桌固定舞台**：見第 4 節，四種狀態高度必須一致。
5. **結帳購買按鈕**：任何寬度下可見的「確認購買」恰好 1 個（桌機在明細卡、手機在底部固定列，互斥）。
6. **送出鎖**：`submitting` ref 同步生效，連點三次只會建立一筆訂單。
7. **表單驗證**：按下確認購買後（`attemptSeq`）未填欄位才顯示錯誤，並自動聚焦第一個錯誤欄位（用 effect，不能用 rAF——React 尚未提交）。
8. **導覽列深色模式**（首頁）：`<Navbar theme="hero" />`＋`#hero-end` sentinel。
9. **教練頁預約卡 sticky**：`top-[calc(var(--promo-h)+4.5rem)]`；sticky 放格線欄本身。
10. **未登入攔截**：個人區未登入直接 `location.replace` 到登入頁並帶 `?redirect=`，不再顯示「請先登入」中間頁。
11. **App 下載分流**：手機用 `smartUrl`，桌機露出 QR＋badge。連結未填時顯示停用，**絕不放假連結**。

---

## 9. 踩過的坑（重要！）

1. **PowerShell 文字取代會弄壞 UTF-8 中文** → 批次取代用 Git Bash `sed` 或 node 腳本；改完 `grep -rl '�' src` 查亂碼。
2. **bash heredoc 傳中文＋反引號給 `node -e` 會被 shell 吃掉** → 用 `node - <<'EOF'` 或寫成 .mjs 檔。
3. **預覽分頁是隱藏的**，以下**都不會執行**：
   - CSS 動畫與 transition（`getComputedStyle` 會讀到中間值，不代表壞掉）
   - 平滑捲動（`scrollIntoView({behavior:'smooth'})`、`scroll-behavior: smooth`）→ 驗證錨點要用 `behavior:'instant'`
   - 截圖（`computer screenshot` 會 timeout）
   → 一律改用 DOM 量測（`getBoundingClientRect` / `getComputedStyle`），並在回報時**誠實說明哪些需要使用者親自看**（hover、動畫流暢度、瀏覽器縮放、iOS 安全區域、鍵盤彈出）。
4. **多寬度驗收用 iframe，不要一直 resize 視窗**：建立 `<iframe style="width:390px">` 載入頁面，iframe 寬度會驅動內部 media query。一次可測多頁多寬度，效率高很多。範例見本次 session 的 `runAudit()`／`readAudit()` 寫法。
5. **`querySelector` 會選到隱藏的桌機版元素** → 用 `offsetParent !== null` 過濾。
6. **購物車抽屜是常駐 `role="dialog"`** → 找 modal 要用文字或 `aria-modal` 過濾，否則會抓到購物車。
7. **`#partners ul > li` 會選到專長標籤的 li** → 用 `#partners > ul > li`。
8. **React onMouseEnter 靠 mouseover 委派** → dispatch `mouseover`（bubbles:true）。
9. **Tailwind 同類 utility 的勝負看產生順序** → 需要時加 `!`。
10. **sticky 要放在 grid 欄本身**；祖先 transform 會殺 sticky。
11. **註解掉元件時，import 也要一起註解**，否則 TS `noUnusedLocals` 會讓 build 失敗。
12. **手機順序需要交錯時用 `contents`**：外層 `className="contents lg:block"` 讓子元素在手機成為格線項目，再用 `order-1/2/3` 排出「文字 → 圖片 → CTA」。
13. **不要用 `hidden` 藏內容來解決窄螢幕**（曾讓手機只看得到一張 App 圖）→ 改成縮小尺寸。
14. **SVG `preserveAspectRatio="slice"` 內部形狀會超出容器**，量測溢位時要排除 `position:absolute` 與 SVG 內部節點，否則會誤判。
15. **同步 ui/ 時 git rm 曾被權限攔** → `.claude/settings.json` 已加 allow 規則。

---

## 10. 目前刻意留白的資料（不可自行虛構）

全站搜尋「待補」「＿＿」「【待確認】」可找到所有佔位。

| 項目 | 位置 |
|---|---|
| **學員評價（範例文案，上線前必須換真實）** | `data/course-detail.ts` `reviews` |
| 課程名稱、Chapter 03/04 單元、闖關條件 | `data/course-detail.ts` |
| 課程影片 `videoUrl`、課程頁 Hero 影片 | 各單元資料 |
| 教練姓名、經歷、照片、開放時段、單堂費用、場館、LINE | `data/coaches.ts` |
| **好友資料、統計、邀請連結** | `data/friends.ts`（真實為空） |
| **合作場館** | `data/venues.ts`（真實為空） |
| **App 好友／星星／共同挑戰截圖** | `data/home.ts` `appFriends.screenshots` |
| **about 合作成果背景照片、about Hero 主視覺** | `data/home.ts` `about.impact.background`、`about.heroMedia` |
| 公司地址、客服信箱、社群網址、App 下載連結 | `data/site.ts` |
| 星星規則與等級算法 | `data/user.ts`、星星頁 |
| 條款／服務契約／join／partnership 頁內容 | 各佔位頁 |

⚠️ **信箱不一致待使用者決定**：頁尾用 `support@poolgress.com`、聯絡頁與場館頁用 `hello@poolgress.com`。已多次提醒，尚無回覆。

⚠️ **App 流程圖第 3 張含真人頭像與名字「妮」**，會公開在網站上。已提醒使用者確認是否取得同意。

---

## 11. 尚未串接的 integration points

| 要接什麼 | 改哪裡 | 後端需回傳 |
|---|---|---|
| 登入／註冊／忘記密碼／OAuth | `lib/auth.ts` 四個函式 | 401 對應 invalid_credentials 等錯誤碼 |
| 金流（課程） | `CheckoutApp.tsx` 的 `confirm()` | orderId、status、failureReason、redirectUrl |
| 付款狀態輪詢 | `recheck()` | `GET /orders/:id` 回 pending/paid/failed |
| 課程權限開通 | `refreshEntitlement()` | `entitlementReady` |
| 優惠碼驗證 | `data/catalog.ts` `validateCoupon()` | 同一組 `CouponIssue` 代碼 |
| 購物車例外 | `data/catalog.ts` `cartIssueOf()` | 下架／改價／優惠到期三種 kind |
| 已購課程／進度／訂單／預約 | `lib/library.ts` 整支換成 API | |
| 好友關係／邀請 | `data/friends.ts` | 只回公開摘要欄位 |
| 場館（或 Google Maps API） | `data/venues.ts` + `VenuesApp` | |
| 金流＋預約＋確認信（教練課） | `components/coach/CoachBooking.tsx` `handlePay()` | |
| App 智慧下載頁 | 建 UA 分流頁，填入 `site.appDownload.smartUrl` | |

⚠️ 登入頁底部有「示範登入」入口，接上真實 Auth 後移除。
⚠️ `register.html` 的驗證碼目前任意 6 位數字都通過。

---

## 12. 本次 session（2026-08-17）做了什麼

1. **首頁還原**：退回 08-17 精簡改版前的六區塊，後續又依需求逐步調整
2. **刪除首頁 One 敘事區、願景區**（願景保留在 about 頁）
3. **關於頁改版**：Hero 主視覺欄位、願景雙欄排版、合作成果區
4. **實戰闖關頁**：接上 App 四步驟實機畫面（自簡報圖去背切出）、改用連續整圖並移到頁面最上方、移除關卡列表
5. **課程頁 Hero 靜態化**：移除 sticky／spacer／捲動淡出，修正「文字淡出但 Hero 還占著高度」
6. **促銷倒數列**：移除點擊捲動、文字區完全不可點、關閉鈕改淺藍
7. **交易狀態模型**：13 種狀態、6 種失敗原因、訂單鎖、debug 面板、10 個狀態畫面、微型狀態插圖系統
8. **補齊**：登入 10 種錯誤＋下一步、優惠碼 5 種失效、購物車 3 種例外、錯誤欄位自動聚焦
9. **修正多個 bug**：未登入顯示「開始學習」、訪客註冊後未登入、Hero 未反映購物車狀態、手機只看得到一張 App 圖、Hero 錨點失效
10. **訂單**：列表改為點擊展開（下單時間／付款方式／發票載具），訂單詳情頁做完又依需求刪除
11. **合作球館頁強化**：地圖 placeholder、卡片、篩選、五種狀態
12. **新增系統狀態頁** `status.html`（維護中／連線中斷／載入失敗／找不到頁面）
13. **邀請好友 → 我的好友**：重新設計＋好友公開摘要頁 `friend.html`
14. **首頁互動球桌**「這顆球，你會怎麼打？」：三條打法、先選後揭曉、固定舞台、品牌收尾
15. **首頁重整**：三區暫時隱藏、App 區拆成兩段、收尾 CTA 改中央單欄、背景三層次

---

## 13. 工作習慣（沿用）

- 改前先讀相關檔案；改後 `npm run build` ＋ DOM 驗證再 commit
- 每個需求：做完 → build → 驗證 → commit → 兩個 repo 都推 → 回報
- **驗證要有數字**：寬度、高度、對比度、元素數量、是否溢位
- 多寬度驗收用 iframe（第 9 節第 4 點）
- 測試用假資料（session、library、cart、orderLock）**測完一定要清掉**
- 資料紀律：使用者沒給的數字／名稱／政策一律「待補」，不虛構
- 預覽資料只在帶參數時載入，正式網址顯示真實狀態
- 新增頁面要沿用既有 Navbar／Footer／Button／Card 與色彩 token，不新增全域 CSS
- 新增的 CSS 一律加 `.pg-` 前綴或 scope，避免污染既有頁面

---

## 14. 給下一個 session 的第一步

```bash
cd C:/Users/User/Documents/Poolgress
export PATH="/c/Program Files/nodejs:$PATH"
npm run build          # 確認綠燈
git log --oneline -15  # 看最近做了什麼
```

然後讀 `README.md`（使用者導向）與本檔（工程細節）。
交付網址一律用 https://www.poolgress.com/ui/ 開頭。

**最後再提醒一次**：使用者會在你工作到一半丟新需求進來。**做完手上的，再依序處理，不要停下來問要不要繼續。**
