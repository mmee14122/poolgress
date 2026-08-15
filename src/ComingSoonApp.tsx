import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Button } from './ui/Button'

/**
 * 尚未建置頁面的「敬請期待」佔位頁（遊戲闖關／關於教練／合作場館共用）。
 * 頁名由各 html 進入點的 root data-page-title 帶入，之後正式頁面完成即整頁替換。
 */
export default function ComingSoonApp({ title }: { title: string }) {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[60vh] items-center justify-center px-4 py-20">
        <div className="text-center">
          <p className="inline-flex rounded-full bg-brand-50 px-3.5 py-1 text-sm font-semibold text-brand-700 ring-1 ring-brand-200">
            {title}
          </p>
          <h1 className="mt-6 text-4xl sm:text-5xl">敬請期待</h1>
          <p className="mt-4 text-ink-500">這個頁面正在準備中，完成後會在這裡與你見面。</p>
          <div className="mt-8">
            <Button href="./index.html" size="lg">
              回首頁
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
