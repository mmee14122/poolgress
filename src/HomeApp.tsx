import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { S01Hero } from './components/home/S01Hero'
import { S02Struggle } from './components/home/S02Struggle'
import { S03Viewpoint } from './components/home/S03Viewpoint'
import { S04One } from './components/home/S04One'
import { S05Steps } from './components/home/S05Steps'
import { S06Gains } from './components/home/S06Gains'
import { S07Fit } from './components/home/S07Fit'
import { S08Why } from './components/home/S08Why'
import { S09Bridge } from './components/home/S09Bridge'
import { S10Courses } from './components/home/S10Courses'
import { Vision } from './components/home/Vision'

/**
 * Poolgress 官網首頁：十個區塊的敘事流。
 *
 * 心理路徑：共鳴 → 好奇 → 理解 → 想像成功 → 看懂產品
 *          → 確認適合自己 → 建立信任 → 開始課程
 *
 * 第一幕｜這就是我        S01 品牌核心 → S02 困境 → S03 觀點 → S04 轉折
 * 第二幕｜Poolgress 怎麼幫我 S05 步驟 → S06 成果 → S07 適合誰 → S08 特色
 * 第三幕｜我要開始了      S09 銜接 → S10 課程 →（願景）
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
        <S05Steps />
        <S06Gains />
        <S07Fit />
        <S08Why />
        <S09Bridge />
        <S10Courses />
        <Vision />
      </main>
      <Footer />
    </>
  )
}
