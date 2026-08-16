import { site } from './site'

/**
 * 實戰闖關（Challenge）資料：真實球桌上的 App 實戰任務。
 *
 * ⚠️ 集中管理的 mock data：新增 Challenge 在 challenges 加一筆即可，
 * 列表頁（challenges.html）與詳情（challenges.html?id=…）自動更新。
 * 名稱、規則、星星數等標示【待確認】者為尚未定案的內容，禁止虛構。
 *
 * 可替換欄位說明：
 *   id         識別碼（詳情頁網址用：challenges.html?id=xxx）
 *   name       Challenge 名稱
 *   image      情境圖路徑（建議 16:9；放 public/assets/challenges/）；null＝漸層佔位
 *   level      難度
 *   stars      完成可獲得星星數；null＝【待確認】
 *   goal       任務目標（一句話）
 *   scenario   球桌情境說明
 *   conditions 完成條件（條列）
 *   prep       準備事項（條列）
 *   lessonHint 對應的課程單元提示（可省略）
 *   appUrl     App 開啟連結（deep link）；null＝尚未串接，顯示佔位按鈕
 *              未來格式例：poolgress://challenge/xxx 或 universal link
 */

export type Challenge = {
  id: string
  name: string
  image: string | null
  level: '新手入門' | '進階' | '高階'
  stars: number | null
  goal: string
  scenario: string
  conditions: string[]
  prep: string[]
  lessonHint?: string
  appUrl: string | null
}

export const challenges: Challenge[] = [
  {
    id: 'challenge-1',
    name: 'Challenge 名稱待補（第一關）',
    image: null,
    level: '新手入門',
    stars: null,
    goal: '闖關目標待補',
    scenario: '球桌情境說明待補：課程單元完成後，依 App 指示在真實球桌上擺球練習。',
    conditions: ['完成條件待補'],
    prep: ['一張標準球桌', '手機安裝 Poolgress App（上架後提供連結）'],
    lessonHint: '對應課程單元待補',
    appUrl: null,
  },
  {
    id: 'challenge-2',
    name: 'Challenge 名稱待補（第二關）',
    image: null,
    level: '新手入門',
    stars: null,
    goal: '闖關目標待補',
    scenario: '球桌情境說明待補。',
    conditions: ['完成條件待補'],
    prep: ['一張標準球桌', '手機安裝 Poolgress App（上架後提供連結）'],
    appUrl: null,
  },
  {
    id: 'challenge-3',
    name: 'Challenge 名稱待補（第三關）',
    image: null,
    level: '新手入門',
    stars: null,
    goal: '闖關目標待補',
    scenario: '球桌情境說明待補。',
    conditions: ['完成條件待補'],
    prep: ['一張標準球桌', '手機安裝 Poolgress App（上架後提供連結）'],
    appUrl: null,
  },
  {
    id: 'challenge-4',
    name: 'Challenge 名稱待補（第四關）',
    image: null,
    level: '新手入門',
    stars: null,
    goal: '闖關目標待補',
    scenario: '球桌情境說明待補。',
    conditions: ['完成條件待補'],
    prep: ['一張標準球桌', '手機安裝 Poolgress App（上架後提供連結）'],
    appUrl: null,
  },
]

export const challengeById = (id: string) => challenges.find((c) => c.id === id)

/**
 * App 商店連結（上架後填入正式網址；null＝顯示「即將上架」）。
 * 首頁與 Challenge 頁共用。
 */
export const appLinks = {
  appStore: site.appDownload.appStore,
  googlePlay: site.appDownload.googlePlay,
}

/**
 * App 學習流程（實戰闖關頁）：四個步驟串成「從一關到下一關」的成長路徑。
 *
 * ⚠️ image 為 App 實機畫面截圖，目前待補。放進
 * public/assets/challenges/ 後，把檔名填進 image 即可（版面不用改）：
 *   image: './assets/challenges/flow-01.png'
 * 截圖請維持原始比例（直式手機畫面），不要事先加背景或箭頭——
 * 箭頭由網頁繪製，背景沿用頁面本身的暖白底。
 */
export const appFlow = {
  eyebrow: 'POOLGRESS APP',
  /** 桌機用的連續整圖（四張畫面＋箭頭，已去除簡報綠底與手機黑框） */
  fullImage: './assets/challenges/flow-full.png' as string | null,
  fullImageAlt: '四步驟 App 流程：選擇關卡、看懂目標並開始挑戰、查看闖關結算、解鎖下一個學習地圖',
  title: '接住初生的興趣，用遊戲闖關引導學習',
  body: '從「我只是來玩」到「這是我能學會的運動」。撞球可以透過理解、練習，而持續進步。',
  steps: [
    { no: '01', name: '選擇關卡', image: './assets/challenges/flow-01.png' as string | null, alt: 'App 關卡地圖畫面' },
    { no: '02', name: '看懂目標並開始挑戰', image: './assets/challenges/flow-02.png' as string | null, alt: 'App 關卡說明與開始遊戲畫面' },
    { no: '03', name: '查看闖關結算', image: './assets/challenges/flow-03.png' as string | null, alt: 'App 通關結算與星星畫面' },
    { no: '04', name: '解鎖下一個學習地圖', image: './assets/challenges/flow-04.png' as string | null, alt: 'App 解鎖下一關的地圖畫面' },
  ],
}
