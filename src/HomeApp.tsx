import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { S01Hero } from './components/home/S01Hero'
import { S02Struggle } from './components/home/S02Struggle'
import { S03Viewpoint } from './components/home/S03Viewpoint'
import { S05Pillars } from './components/home/S05Pillars'
import { S06Entry } from './components/home/S06Entry'

/**
 * Poolgress 官網首頁：五個區塊（2026-08 精簡改版）。
 *
 * S1 Hero → S2 痛點 → S3 四張功能卡 → S4 對照圖 → S5 CTA
 * 願景區已移至 about.html；「One」敘事區整段移除。
 *
 * 課程步驟、章節、闖關細節屬於課程簡介頁（course.html），不放這裡。
 */
export default function HomeApp() {
  return (
    <>
      {/* 首頁專用：Hero 範圍內導覽列為深色，離開 Hero 後切回淺色 */}
      <Navbar theme="hero" />
      <main>
        <S01Hero />
        <S02Struggle />
        <S05Pillars />
        <S03Viewpoint />
        <S06Entry />
      </main>
      <Footer theme="dark" />
    </>
  )
}
