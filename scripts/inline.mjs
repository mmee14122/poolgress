/**
 * 把 dist/ 的 CSS 與 JS 內嵌進單一 HTML，輸出到 dist-single/index.html。
 * 用途：只想上傳一個檔案的情境（虛擬主機、GitHub 網頁版拖拉上傳）。
 * 代價是失去快取切分，整頁改一個字就要重新下載全部。
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const out = resolve(root, 'dist-single')

let html = readFileSync(resolve(dist, 'index.html'), 'utf8')

/** 內容裡若出現 </script> 會提前結束標籤，必須拆開 */
const escapeClosingTag = (code) => code.replaceAll('</script', '<\\/script')

const readAsset = (src) => readFileSync(resolve(dist, src.replace(/^\.?\//, '')), 'utf8')

// <link rel="stylesheet" href="./assets/x.css"> -> <style>
html = html.replace(
  /<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,
  (_, href) => `<style>\n${readAsset(href)}\n</style>`,
)

// <script type="module" src="./assets/x.js"></script> -> 內嵌
html = html.replace(
  /<script[^>]*src="([^"]+)"[^>]*><\/script>/g,
  (_, src) => `<script type="module">\n${escapeClosingTag(readAsset(src))}\n</script>`,
)

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
writeFileSync(resolve(out, 'index.html'), html)

const kb = (Buffer.byteLength(html) / 1024).toFixed(1)
console.log(`dist-single/index.html  ${kb} kB（單一檔案，可直接上傳）`)
