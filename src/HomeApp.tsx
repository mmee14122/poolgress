import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { S01Hero } from './components/home/S01Hero'
import { S01bTableChoice } from './components/home/S01bTableChoice'
import { S05bAppTeaser } from './components/home/S05bAppTeaser'
import { S05cAppFriends } from './components/home/S05cAppFriends'
import { S06Entry } from './components/home/S06Entry'

/**
 * Poolgress 官網首頁。
 *
 * 首頁只回答「Poolgress 是什麼？為什麼跟我有關？」
 * 敘事順序：共鳴 → 選一條打法 → App 預告 → 課程入口
 *
 * 課程步驟、章節、闖關細節屬於課程簡介頁（course.html），不放這裡。
 *
 * 註：痛點、觀點對照、功能卡三區已於 2026-08-17 依使用者決定移除
 * （首頁將整體重新設計）。舊元件與文案可從 git 紀錄取回。
 */
export default function HomeApp() {
  return (
    <>
      {/* 首頁專用：導覽列跟著身後的深色區塊變色（見 Navbar 的 data-nav-dark） */}
      <Navbar theme="hero" />
      <main>
        <S01Hero />
        <S01bTableChoice />
        <S05bAppTeaser />
        <S05cAppFriends />
        <S06Entry />
      </main>
      <Footer theme="dark" />
    </>
  )
}
