/**
 * 好友資料（我的好友分頁）。
 *
 * ⚠️ 尚未串接後端：真實好友關係、邀請接受狀態與公開資料範圍都由後端決定。
 * 這裡的 friends 刻意為空陣列 → 頁面顯示空狀態，不假造活躍好友。
 * 需要預覽列表與統計時，網址加 ?demo=friends 會改用 demoFriends。
 *
 * 後端接上後：
 *   friends      → GET /friends（只回公開摘要欄位）
 *   friendStats  → GET /friends/stats
 *   inviteLink   → GET /invite-link（帳號建立時產生）
 * privacy 欄位保留給後端控制公開範圍，前端只顯示 public-summary 允許的內容。
 */

export type Friend = {
  id: string
  name: string
  /** 頭像路徑；null＝顯示名稱首字的預設頭像 */
  avatar: string | null
  /** 等級；null＝尚未計算 */
  level: number | null
  stars: number
  /** 最近一則公開活動（不含私人預約與訂單） */
  recentActivity: string
  joinedAt: string
  /** 公開範圍：目前僅支援公開摘要 */
  privacy: 'public-summary'
}

/** 好友公開摘要頁用的延伸資料（同樣只含可公開內容） */
export type FriendProfile = Friend & {
  /** 完成的公開 Challenge 數 */
  challengesCompleted: number
  /** 最近完成的公開成就（最多三則） */
  recentAchievements: string[]
}

/** 真實好友清單（待後端串接；目前為空＝顯示空狀態） */
export const friends: Friend[] = []

/** 好友概覽統計；null＝資料待補，畫面顯示「＿＿」 */
export const friendStats: {
  friendCount: number | null
  monthlyChallenges: number | null
  sharedStars: number | null
} = {
  friendCount: null,
  monthlyChallenges: null,
  sharedStars: null,
}

/** 邀請連結（後端在帳號建立時產生）；null＝顯示「待產生」 */
export const inviteLink: string | null = null

/* ------------------------------------------------------------------ */

/** 預覽用示範好友（**不是真實好友**），僅在 ?demo=friends 時載入 */
export const demoFriends: FriendProfile[] = [
  {
    id: 'friend-1',
    name: '阿凱',
    avatar: null,
    level: 8,
    stars: 24,
    recentActivity: '完成「直球瞄準」Challenge',
    joinedAt: '2026-08-01',
    privacy: 'public-summary',
    challengesCompleted: 6,
    recentAchievements: ['完成「直球瞄準」Challenge', '連續練習 5 天', '取得第 20 顆星星'],
  },
  {
    id: 'friend-2',
    name: '小雨',
    avatar: null,
    level: 5,
    stars: 12,
    recentActivity: '正在學習：基本動作養成',
    joinedAt: '2026-08-05',
    privacy: 'public-summary',
    challengesCompleted: 3,
    recentAchievements: ['完成「穩定運桿」Challenge', '第一次三星通關'],
  },
  {
    id: 'friend-3',
    name: 'Wei',
    avatar: null,
    level: null,
    stars: 3,
    recentActivity: '最近獲得 3 顆星星',
    joinedAt: '2026-08-12',
    privacy: 'public-summary',
    challengesCompleted: 1,
    recentAchievements: ['完成第一關'],
  },
]

/** 預覽用統計（與 demoFriends 對應） */
export const demoFriendStats = {
  friendCount: demoFriends.length,
  monthlyChallenges: 7,
  sharedStars: demoFriends.reduce((sum, f) => sum + f.stars, 0),
}

/** 預覽用邀請連結 */
export const demoInviteLink = 'https://www.poolgress.com/ui/login.html?invite=DEMO1234'

export const friendById = (id: string) => demoFriends.find((f) => f.id === id)
