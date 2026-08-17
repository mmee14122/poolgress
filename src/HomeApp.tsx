import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { S01Hero } from './components/home/S01Hero'
import { S01bTableChoice } from './components/home/S01bTableChoice'
/* ⏸ 暫時隱藏的三區（元件與文案都保留，復原時把這裡與下方 main 內的註解一起解開） */
// import { S02Struggle } from './components/home/S02Struggle'
// import { S03Viewpoint } from './components/home/S03Viewpoint'
// import { S05Pillars } from './components/home/S05Pillars'
import { S05bAppTeaser } from './components/home/S05bAppTeaser'
import { S06Entry } from './components/home/S06Entry'

/**
 * Poolgress 官網首頁。
 *
 * 首頁只回答「Poolgress 是什麼？為什麼跟我有關？」
 * 敘事順序：共鳴 → 選一條打法 → App 預告 → 課程入口
 * （問題／觀點／功能卡三區暫時隱藏，元件與文案都保留）
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
        <S01bTableChoice />
        <S05bAppTeaser />
        {/* ⏸ 暫時隱藏（2026-08-17，待使用者決定是否保留）：
            痛點、觀點對照、功能卡三區。元件與文案都完整保留，
            要復原就把下面三行的註解拿掉即可。 */}
        {/* <S02Struggle /> */}
        {/* <S03Viewpoint /> */}
        {/* <S05Pillars /> */}
        <S06Entry />
      </main>
      <Footer theme="dark" />
    </>
  )
}
