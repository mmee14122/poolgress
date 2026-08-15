import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { S01Hero } from './components/home/S01Hero'
import { S02Struggle } from './components/home/S02Struggle'
import { S03Viewpoint } from './components/home/S03Viewpoint'
import { S04One } from './components/home/S04One'
import { S05Pillars } from './components/home/S05Pillars'
import { S07VisionEntry } from './components/home/S07VisionEntry'

/**
 * Poolgress 官網首頁：七個品牌區塊。
 *
 * 首頁只回答「Poolgress 是什麼？為什麼跟我有關？」
 * 敘事順序：共鳴 → 問題 → 觀點 → One → 產品價值 → 適合誰 → 願景＋課程入口
 *
 * 課程步驟、章節、闖關細節屬於課程簡介頁（course.html），不放這裡。
 */
export default function HomeApp() {
  return (
    <>
      <Navbar />
      <main>
        <S01Hero />
        <S02Struggle />
        <S03Viewpoint />
        <S04One />
        <S05Pillars />
        <S07VisionEntry />
      </main>
      <Footer />
    </>
  )
}
