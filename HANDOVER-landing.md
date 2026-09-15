# Poolgress 正式首頁（landing）工作手冊 — 2026-09-16 交接版

給下一個工作 session 的人（或 AI）看的。舊站相關規範仍在 `HANDOVER.md`，這份只講 2026-09-06 之後的「正式首頁 + 合作教練」。

---

## 1. 現況一句話

`https://www.poolgress.com/` 的首頁 = 這個 repo 的 **landing**（一頁式、精品編輯調性）。
線上目前是 **9/11 的版本**（Hero → 場館 → App → 洽談合作）。
本機已完成但**尚未推送**的改版：Hero → **01 App → 02 合作教練 → 03 場館** → 洽談合作，外加合作教練分頁 `coaches.html`。使用者回來看預覽後才決定上線。

## 2. 兩個 repo、一條部署鏈

| 用途 | 位置 |
|---|---|
| 開發（原始碼） | `C:\Users\User\Documents\Poolgress`（main） |
| 部署（Vercel 抓這個） | `~/poolgress-website`（main）；`ui/` = 開發 repo 的 `dist/` 複本 |

每次上線的固定流程（順序不能少）：

```bash
# 1 開發 repo
npm run build
git add -A && git commit -m "…" && git push origin main

# 2 部署 repo：同步 ui/
cd ~/poolgress-website
git rm -rq ui/ && cp -r "C:/Users/User/Documents/Poolgress/dist/." ui/

# 3 重產根目錄首頁與教練頁（把 "./assets/ 換成 "/ui/assets/）
#    root/index.html   ← ui/landing.html
#    root/coaches.html ← ui/coaches.html
python -c "import io
for src,dst in [('landing.html','index.html'),('coaches.html','coaches.html')]:
    s=io.open('ui/'+src,encoding='utf-8').read().replace('\"./assets/','\"/ui/assets/')
    io.open(dst,'w',encoding='utf-8').write(s)"

# 4 推送＋打 Deploy Hook（GitHub→Vercel 通知曾失聯，一律手動打）
git add -A && git commit -m "…" && git push origin main
curl -s -X POST "$(cat ~/.poolgress-vercel-hook)"

# 5 驗證：線上 index.html 的 landing-*.js hash 是否等於本機 ui/landing.html 的
```

- Deploy Hook 網址只存在 `~/.poolgress-vercel-hook`，不要寫進 repo。
- 漏掉第 3 步，正式首頁會停在舊版（bundle hash 對不上）。
- 舊首頁（藍色版）備份在部署 repo 的 `home-old.html`，改名回 `index.html` 即可退回。

## 3. 檔案地圖（只動這些）

| 檔案 | 內容 |
|---|---|
| `landing.html` / `src/landing-entry.tsx` / `src/LandingApp.tsx` | 首頁版面（由 PremiumDemoApp 複製而來，已獨立） |
| `src/data/landing.ts` | 首頁文案、Hero CTA、導覽 `landingNav`、影片開關、聯絡信箱 |
| `src/styles/landing.css` | 首頁所有樣式，**選擇器一律 `.pg-landing-root …`** |
| `src/components/LandingFooter.tsx` | 精簡頁尾（Logo／Better Pool. Better Life.／信箱／版權） |
| `coaches.html` / `src/coaches-entry.tsx` / `src/CoachesApp.tsx` / `src/styles/coaches.css` | 合作教練分頁（`.pg-coaches-root …`） |
| `src/data/partner-coaches.ts` | **三位教練資料（目前全部示意）**；首頁區塊與分頁共用 |
| `public/assets/landing/`、`/hero/`、`/app/`、`/coaches/` | 圖片與影片；程式裡一律寫 **`/ui/assets/…` 絕對路徑** |
| `tools/shot.mjs` | 無頭 Chrome 截圖／量測工具（見 §7） |
| `backups/landing-v1-2026-09-16/` + git tag `landing-v1-2026-09-16` | 改版前完整備份 |

**不要動**：`index.html`（舊 premium 首頁）、`src/data/coaches.ts`（舊教練頁在用，**跟 partner-coaches.ts 不是同一份**）、`tokens.css / home.css / nav.css / buttons.css`（共用，會影響舊站）。共用元件 `Navbar.tsx`、`Logo.tsx` 只加過「有預設值的選用參數」（`links / minimal / logoHref / href`）。

## 4. 設計系統（首頁與教練頁共用）

- 色：Ivory `#F2EEE6` 底、Charcoal `#252C30` 字、Walnut `#816B59` 眉標、Sand `#D2C2AD` 主按鈕；THE APP 區淡藍 = `--pg-app-world-bg`（Secondary 22% 混 Ivory）。
- 字：標題 Noto Serif TC 600；眉標 11px 寬字距 Walnut；內文 `--pg-text-body`。
- 媒體：圓角 3px、不加框線／陰影／卡片底色；圖片保留上緣往下裁（`object-position: 50% 0%`）。
- Hero CTA：158×44 直角方框、低透明深底＋半透白細框、細線 ↗；hover 米色由右往左填滿（前 0.05s 只填箭頭方塊），全長 0.8s。
- 02–04 圖文：同一組 grid（圖 1.65fr／文 0.75fr、欄距 clamp(64,5vw,88)、間距 40），圖 2:1；文字組在「照片旁到頁面邊緣的整片留白」置中，垂直補 −18px 光學修正（見 landing.css 註解）。
- 手機：單欄，文字左右 22、圖片左右 16、內文→圖 30、圖→下段標題 60。

## 5. 待使用者決定（2026-09-16 停在這裡）

1. **是否上線**新順序（App → 教練 → 場館）＋教練分頁。目前只在本機 commit。
2. **教練區塊版本**：`?coach=A|B|C`（A 精品雜誌 / B 學院型 / C 人物列）。定案後在 `LandingApp.tsx` 移除 `previewVariant`，並把 `landing.css` 裡另外兩個版本的規則刪掉。
3. **底色配置**：`?tone=a|b|c`（a App 淡藍 / b 教練淡藍 / c App 較深藍灰）。定案後同樣移除切換，把選定的顏色寫死。
4. 教練頁 `coaches.html` 目前用的是 A 版的資訊層級，選了 B/C 要一起改。
5. 三位教練真實資料：姓名／照片（直式、≥1200 寬）／角色／專長／年資／理念／簡介 → 只改 `partner-coaches.ts`，把 `placeholder` 改 false 標記就消失。
6. Hero 未來換成介紹影片；App 影片段落已用 `appChapter.video.show=false` 關掉，檔案仍在 `/ui/assets/app/intro.mp4`。
7. SEO：首頁 meta description / og:image / canonical / robots.txt / sitemap.xml 都還沒做（文案三組草稿見 9/9 對話：建議用「Poolgress｜讓撞球成為一家人的共同記憶」）。Google 目前還顯示舊站快取，要在 Search Console 要求重新索引。

## 6. 工作規則（使用者定的）

- 「先跟我討論」= 只分析不改碼；其他要求做完 → 建置 → 推 → 驗證線上 hash，再回報。
- 回報要有量測數字（px）、明說沒測到的東西（例：真機、hover 手感）。
- 使用者不會寫程式，文案改動只改他指定的字；示意資料要標「示意」，不得杜撰教練經歷。
- 每次改 landing 都要同步重產根目錄 `index.html`（§2 第 3 步）。

## 7. 驗證工具

```bash
# 建一個和正式站相同結構的本機鏡像（根目錄 index/coaches + /ui/）
mkdir -p site/ui && cp -r dist/. site/ui/ && (同 §2 第 3 步產 site/index.html、site/coaches.html)
python -m http.server 8088 --directory site
# 截圖／量測：node tools/shot.mjs jobs.json out.json（jobs 格式見 tools/shot-jobs-example.json）
```

本機 `vite` 開發伺服器（`preview_start course-site` / `npm run dev`，port 5173）會看到破圖，因為圖片路徑是 `/ui/assets/…`；要看圖請用上面的鏡像。

## 8. 已知小事

- Windows Bash heredoc 會把 `\n`、反斜線弄壞：改檔案請用 Write 工具或 python 腳本檔。
- `LandingApp.tsx` 是 CRLF；用 python 取代字串時先把 `\r\n` 正規化。
- 用 `.index()` 切區塊時要用整行精確比對，`'      </div>'` 這種子字串會誤中更深層的行（9/16 踩過）。
