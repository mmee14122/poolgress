import fs from 'node:fs'

const source = fs.readFileSync('src/components/sections/ChallengeSection.tsx', 'utf8')

const checks = [
  ['舊 QR 彈窗已移除', !source.includes('QrDialog') && !source.includes('qrOpen')],
  ['桌機下載區直接顯示', source.includes('data-download-layout="desktop"')],
  ['手機只有智慧下載按鈕', source.includes('data-download-layout="mobile"')],
  [
    '手機下載按鈕使用智慧網址',
    source.includes('appDownload.smartUrl') && source.includes('href={appDownload.smartUrl}'),
  ],
]

const failed = checks.filter(([, passed]) => !passed)
for (const [label, passed] of checks) {
  console.log(`${passed ? 'PASS' : 'FAIL'}  ${label}`)
}

if (failed.length) process.exit(1)
