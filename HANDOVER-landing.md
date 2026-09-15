# Poolgress 正式首頁（landing）工作手冊 — 2026-09-16 深夜交接版

> 給下一個聊天室的 Claude：先把這份讀完再動手。第 1、2、10 節最重要。
> 記憶目錄（`~/.claude/projects/C--Users-User-Documents-Poolgress/memory/`）另有摘要，但以本檔為準。

---

## 1. 現況一句話

本機開發 repo 有約 45 個 commit **未 push**、**未部署**，正式站 poolgress.com 仍是 **9/11 版**。
另外還有一批**未 commit** 的改動（見 §2），使用者要求「先預覽、不要 commit」，等他說「OK」才 commit。
使用者明確指示：**「先不推，等我改好再一次推」**——在他說「推」之前，不要 push、不要打 Deploy Hook。

## 2. 目前未 commit 的一批（等使用者「OK」後一次 commit）

`git status` 會看到 15 個 M 檔＋2 個新檔（`PageIntro.tsx`、`page-intro.css`）。內容全部已在本機鏡像預覽過、量測過：

| 項目 | 檔案 |
|---|---|
| 頁尾三顆 CTA（首頁「洽談合作」、/app「尋找教練」「回到首頁」）改成與合作教練頁「加入我們」同規格：方框（radius 0）、40 高、min-width 136、左右 22、14px/500/.03em、1px 細框；**Hero 兩顆不動**（158×44 / 手機 150×42，radius 0 原本就是方框） | `landing-ia.css` 末段 |
| 標題去標點＋手機換行：教練頁「跟著教練／打出自己的節奏」、App 頁「從一場遊戲／開始喜歡撞球」、教練頁尾「和我們一起／讓撞球變得更好」、首頁頁尾「一起／讓撞球有更多可能」、/app 頁尾「讓每一局／都有新的挑戰與相遇」（桌機一行、兩段半字距 0.5em；手機 `\n` 處換行） | `landing.ts`、`partner-coaches.ts`、`PageIntro.tsx`、`CoachesApp.tsx`、`page-intro.css`、`coaches.css` |
| 分頁開場共用元件 `PageIntro`（眉標 → 大標 → 副標 → 1px 線，直排 editorial），教練頁與 App 頁共用 | `PageIntro.tsx`、`page-intro.css`、`CoachesApp.tsx`、`AppPlayApp.tsx` |
| 全站版心 token `--pg-page-max:1680px; --pg-page-pad:clamp(22px,5vw,96px)`（教練頁／預約頁／App 頁統一） | `page-intro.css`（token）、各頁 css |
| 教練詳細頁左欄重排：照片欄 336、區塊順序 教練介紹 → 教學方式（空狀態文案 `profilePage.methodEmpty`）→ 經歷與資格 | `CoachProfileApp.tsx`、`coach-profile.css`、`partner-coaches.ts` |
| 手機預約 Bottom Sheet：關閉鈕改向下 chevron（`M6 9l6 6 6-6`）、滑入／淡出 0.35s ease-in-out、底部固定條「查看可預約時段」＋向上 chevron、`aria-expanded` | `CoachProfileApp.tsx`、`coach-profile.css` |
| 手機教練卡連結文字「查看課程・預約　↗」（`coachLabels.ctaMobile`） | `CoachCard.tsx`、`partner-coaches.ts` |
| 手機 PLAY／LEARN 入口改 Navigation Card（16:10、底部漸層 rgba(0,0,0,.22)→透明 33%、名稱 19px／說明 14px、卡距 48） | `DualEntry.tsx`、`landing-ia.css` |
| 手機 01 THE APP Hero 標題兩行 `clamp(26px,8vw,30px)` nowrap | `AppHero.tsx`、`landing-ia.css` |
| 02 COACHING → 03 THE SPACE 之間 1px 分隔線 `.pg-section-divider`（#d8d3c9，上 14／下 48） | `LandingApp.tsx`、`landing-ia.css` |
| 首頁 THE APP／教練區底色回米白（Ivory）；/app 頁尾底色淺藍 | `landing.css`、`landing-ia.css` |
| 聯絡信箱 `poolgress@poolgress.com` | `landing.ts` |

**commit 建議切法**：可一次 commit，訊息列出上面各項；或依「copy / style / feat」拆 4–5 個。

## 3. 兩個 repo、一條部署鏈（使用者說「推」才做）

```bash
# 1 開發 repo（本專案）
npm run build            # 產 dist/（含 landing.html、coaches.html、coach-profile.html、app-play.html）
git push origin main

# 2 部署 repo（poolgress.com 那個，路徑見 ~/.claude/…/memory/project-handover.md）：同步 ui/
#    dist/. → <deploy>/ui/

# 3 重產根目錄頁（把 "./assets/ 換成 "/ui/assets/）
#    index.html         ← ui/landing.html
#    coaches.html       ← ui/coaches.html
#    coach-profile.html ← ui/coach-profile.html
#    app-play.html      ← ui/app-play.html
#    vercel.json 新增 {"rewrites":[{"source":"/app","destination":"/app-play.html"}]}   ← 對外網址 /app

# 4 推送＋打 Deploy Hook（GitHub→Vercel 通知曾失聯，一律手動打）
curl -X POST "$(cat ~/.poolgress-vercel-hook)"

# 5 驗證：線上 index.html 的 landing-*.js hash 是否等於本機 ui/landing.html 的；/app、/coaches.html、/coach-profile.html?id=coach-a 都要開一次
```

## 4. 網站結構（本機已完成的樣子）

**首頁 `/`**（`LandingApp.tsx`）
Hero（H3 版，兩顆 CTA：「探索 App 玩法」→ `/app`、「尋找教練」→ `/coaches.html`）
→ PLAY／LEARN 雙入口 `DualEntry`（Editorial Navigation 大圖 3:2，hover 遮罩＋「EXPLORE THE APP／FIND A COACH」，圖 `play-entry.webp`／`learn-entry.webp`；LEARN 圖仍是場館示意）
→ 01 / THE APP 章節 Image Hero `AppHero`（full-bleed，圖 `app-hero.webp`，整張連到 `/app`，眉標在圖內，標題兩行 `THE GAME／GOES WITH YOU.`）
→ 02 / COACHING（`LEARN AT／YOUR PACE.`，副標「專業 × 無菸。依照你的程度與步調，細心陪你練好每一步。」，三張教練卡 `CoachCard`，首頁不顯示層級標籤 `hideLevel`）
→ 分隔線 → 03 / THE SPACE（`spaceIntro` 副標）
→ 頁尾 `#contact`（「一起／讓撞球有更多可能」＋「洽談合作」）

**App 玩法頁 `/app`**（`AppPlayApp.tsx`，檔名 `app-play.html`）
Navbar → `PageIntro`（THE APP／「從一場遊戲／開始喜歡撞球」）→ 三段 `PillarBlock`（01 CHALLENGE／02 …／03 …，圖左右左）→ `#app-finale`（「讓每一局／都有新的挑戰與相遇」＋「尋找教練」「回到首頁」）→ 頁尾。

**合作教練列表 `/coaches.html`**（`CoachesApp.tsx`）
`PageIntro`（COACHING／「跟著教練／打出自己的節奏」／「專業 × 無菸，預約舒適的撞球學習體驗。」）→ 三張卡（≥1200 三欄 1fr、gap 40、照片 1:1、層級 START／IMPROVE／COMPETE）→ 頁尾「和我們一起／讓撞球變得更好」＋「加入我們」（JOIN US，= 全站 CTA 基準規格）。

**教練詳細／預約 `/coach-profile.html?id=coach-a|b|c`**（`CoachProfileApp.tsx`）
左欄 `.pg-pf-main`（照片 260×325 P260、介紹／教學方式／經歷）、右欄 `.pg-pf-side` 預約面板 `ProfileBooking`（服務 → 球館 select ＋「查看球館位置」→ 月曆 → 時段 → 摘要 → 前端模擬登入／付款；底 `#FDFCF9`、品牌藍 `#2B66B4`、選中 `#eef4fc`／框 `#b7d3f2`、綠勾 `#3f7a0e`、月份裸 chevron）。桌機 grid `minmax(0,1fr) min(40%,560px)`、右欄 sticky；手機右欄變 Bottom Sheet（`data-sheet`，背景鎖捲、Esc、焦點管理）。

**共用導覽 `landingNav`**（`landing.ts`）：App 玩法 `/app`、合作教練 `/coaches.html`、場館 `/#space`、聯絡 `/#contact`。三個分頁都吃這份（之前各頁寫死 `/#app` 造成「App 玩法跳回首頁」bug，已修）。

## 5. 檔案地圖（只動這些）

| 檔案 | 內容 |
|---|---|
| `src/LandingApp.tsx` | 首頁；匯出 `useLandingReveal`、`PillarBlock`、`ChapterTransition`、`fadeUp`、`reveal`、`EASE*` 給 /app 重用 |
| `src/AppPlayApp.tsx` / `app-play.html` / `src/app-play-entry.tsx` | App 玩法頁（`.pg-app-play-root`） |
| `src/CoachesApp.tsx` / `coaches.html` / `src/coaches-entry.tsx` / `src/styles/coaches.css` | 列表頁（`.pg-coaches-root`） |
| `src/CoachProfileApp.tsx` / `coach-profile.html` / `src/coach-profile-entry.tsx` / `src/styles/coach-profile.css` | 詳細頁（`.pg-profile-root`） |
| `src/components/landing/` `AppHero.tsx`、`DualEntry.tsx`、`CoachCard.tsx`、`PageIntro.tsx`、`ProfileBooking.tsx`、`AppPreview.tsx`（已不用但保留） | 首頁／分頁元件 |
| `src/styles/landing.css`、`landing-ia.css`、`coach-card.css`、`page-intro.css` | 首頁與共用樣式；**選擇器一律帶根 class** |
| `src/data/landing.ts` | 首頁／App 頁全部文案、`landingNav`、Hero CTA、`dualEntry`、`appChapter`、`appPlayPage`、`spaceIntro`、`finale`、信箱 |
| `src/data/partner-coaches.ts` | **三位教練資料（全部示意）**＋`coachLabels`／`coachesSection`／`coachesPage`／`profilePage` 文案 |
| `public/assets/landing/`（`app-hero.webp`、`play-entry.webp`、`learn-entry.webp`、`play.webp`…）、`/hero/`、`/app/`、`/coaches/` | 圖片；程式裡一律 `/ui/assets/…` 絕對路徑 |
| `tools/shot.mjs`、`tools/shot-jobs-example.json` | 無頭 Chrome 截圖／量測 |
| `.claude/launch.json` → `site-mirror` | `python -m http.server 8088 --directory site` |
| `backups/landing-v1-2026-09-16/`、git tag `landing-v1-2026-09-16` | 改版前備份 |

**不要動**：`index.html`（舊 premium 首頁）、`app.html`（舊 App 頁）、`src/data/coaches.ts`（舊教練頁用，與 partner-coaches.ts 不同份）、`tokens.css / home.css / nav.css / buttons.css`（共用，會影響舊站）。共用元件 `Navbar.tsx`、`Logo.tsx` 只加過有預設值的選用參數。

## 6. 設計系統與本輪定案數值

- 色：Ivory `#F2EEE6`、Charcoal `#252C30`、Walnut `#816B59`（眉標）、Sand `#D2C2AD`（主按鈕）、淺藍 `--pg-app-world-bg`（#afc4cf 22% 混 Ivory）、品牌藍 `#2B66B4`（預約）、米白 `#F8F4EC`、預約面板底 `#FDFCF9`。
- 首頁三章標題統一 `--pg-fs-chapter-unified: clamp(30px,3.6vw,52px)`；兩行大標第二行錯位 `--pg-display-indent` 桌機 140／平板 80／手機 32（使用者：「我喜歡這個錯位」）。
- 三章標題區塊：左緣 50、頂到眉標 32、眉標到大標 24、大標到副標 20、副標行高 1.7。
- PLAY／LEARN 名稱字級 N24（24px）。
- CTA 基準 = JOIN US：40 高、min-width 136、padding 0 22、radius 0、14px/500/.03em、1px 框。Hero CTA 維持 158×44（手機 150×42），方框。
- 教練詳細頁：標頭照片 P260（260×325）；列表卡照片 1:1；卡欄距 40（列表）。
- 03 THE SPACE 開場：上 32／下 40。
- 分頁 `PageIntro`：副標 margin-top 20、max-width 44em、底線後 padding 40。

## 7. 本輪使用者決策紀錄（按時間，方便理解「為什麼長這樣」）

1. 先討論 → 決定教練卡與詳細頁重設計；預約表單照舊站格式，不正式上線但功能看起來相同。
2. 標籤改淺色底＋淺藍框；預約面板更淺米色 → 最後 `#FDFCF9`；主色品牌藍 `#2B66B4`；日曆白底按鈕、綠勾在下方統一層級。
3. 首頁：刪 01/02/03 小資訊三行、刪「查看全部教練」、刪課程與理念欄；教練卡整卡 hover 可點。
4. 教練詳細頁 2/3＋1/3 → 右欄改 `min(40%,560px)`；日曆「先不加寬」；左側配比＋教學方式預留。
5. App 敘事整段搬到 `/app`（不刪內容），首頁改 PLAY／LEARN 雙入口 Editorial Navigation；Hero CTA 導頁。
6. 曾試「雙入口加編號、Hero 移到 /app」→ 使用者「還原上一步」，已還原（Hero 留在首頁）。
7. 02 文案定案「LEARN AT／YOUR PACE.」；03 T2；三章 52px；縮排 140；02→03 Divider。
8. 手機：卡片「查看課程・預約　↗」、入口 Navigation Card、Hero 兩行、Bottom Sheet chevron＋動畫、底部展開條。
9. 標題全部去標點、以 `\n` 定手機換行。
10. CTA：先誤做「全站 4px 圓角」→ 使用者更正：**Hero 不動，只改頁尾三顆，比照「加入我們」方框同尺寸**（已照做，未 commit）。

## 8. 待使用者決定／待補

1. **「OK」** → commit §2 那批。
2. **「推」** → §3 完整部署鏈。
3. 首頁手機版 01 THE APP full Hero 太高：縮矮／搬回 /app／維持——尚未決定。
4. 素材：LEARN 入口「教練指導學生」照片（現用場館圖示意）；三位真實教練資料（只改 `partner-coaches.ts`，`placeholder:false` 標記就消失）。
5. SEO（meta description／og:image／canonical／robots／sitemap）未做；Google 仍顯示舊站快取。
6. Hero 未來換影片；App 影片段落 `appChapter.video.show=false` 關著，檔案在 `/ui/assets/app/intro.mp4`。

## 9. 工作規則（使用者定的）

- 「先跟我討論」= 只分析不改碼。其他要求 → 做完 → 建置 → 鏡像預覽 → 量測回報 px → 明說沒測到的（真機、hover 手感）。
- 最近常說「先讓我預覽，不要 commit」→ 預覽截圖給他，等「OK」。
- 使用者不會寫程式；文案只改他指定的字；示意資料標「示意」，不得杜撰教練經歷。
- 給選項時做成 A/B/C 或 1/2/3 版本讓他選，選定後移除切換把數值寫死。
- 不動舊站與共用 CSS（§5）。

## 10. 驗證流程（每次改完都跑）

```bash
npm run build
rm -rf site && mkdir -p site/ui && cp -r dist/. site/ui/ && python "$TEMP/mk.py"   # mk.py 內容見下
rm -rf "$TEMP/pg-shot-profile"        # 一定要清，舊快取會截到舊版
node tools/shot.mjs jobs.json out.json
```

`mk.py`（若 `$TEMP` 被清掉就重建）：讀 `site/ui/{landing,coaches,coach-profile,app-play}.html`，把 `"./assets/` 換成 `"/ui/assets/` 寫到 `site/{index,coaches,coach-profile,app-play}.html`，另複製 app-play 到 `site/app/index.html` 模擬 `/app` rewrite。`site/` 已在 .gitignore。
預覽：`preview_start site-mirror`（port 8088）。`npm run dev`（5173）會破圖，因圖片路徑是 `/ui/assets/`。

shot.mjs jobs 要點：每個 job 必加 `"css":"html{scroll-behavior:auto!important}"`（smooth scroll＋隱藏分頁會讓 reveal 不觸發、截到空白）；`eval` 裡先整頁捲一遍再量；手機用 `width 375 / dpr 2 / mobile true`。

## 11. 已知坑

- Windows Bash heredoc 會弄壞 `\n`、反斜線、中文：改檔用 Write 工具寫 python 腳本再執行。
- 檔案有的 CRLF 有的 LF（`landing-ia.css` 是 LF、`LandingApp.tsx`／`landing.ts` 是 CRLF）：python 取代前先正規化 `\r\n`→`\n`，寫回時還原。
- `python -c` 裡帶 Windows 路徑會被 `\U` 咬掉：用 `.replace(chr(92),'/')` 或腳本檔。
- CSS 覆寫優先權：手機 sheet 要用 `[data-sheet]` 選擇器才壓得過 `[data-on='1'] .pg-pf-side`；sticky 的 `top` 在手機要 `top:auto`；flex column 內的日曆要 `width:100%`。
- 共用 `.pg-t-cta` 尺寸在 `home.css`（不能改），要覆寫請在 `landing-ia.css` 用 `.pg-landing-root #contact …` 提高特異度。
- 切區塊用 `.index()` 時整行精確比對，`'      </div>'` 會誤中深層。
