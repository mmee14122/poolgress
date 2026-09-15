// Minimal CDP screenshot harness (no puppeteer). Usage: node shot.mjs jobs.json
// Each job: { name, url, width, height, dpr, mobile, css, fonts:[urls], clip:"js expr returning {x,y,width,height}", eval:"js expr", out }
import { spawn } from 'node:child_process'
import { writeFileSync, readFileSync } from 'node:fs'

const jobs = JSON.parse(readFileSync(process.argv[2], 'utf8'))
const PORT = 9333
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run', '--no-default-browser-check',
  '--hide-scrollbars', '--window-size=1440,900', '--user-data-dir=' + process.env.TEMP + '/pg-shot-profile', 'about:blank',
], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let wsUrl
for (let i = 0; i < 50; i++) {
  try { const list = await (await fetch(`http://localhost:${PORT}/json`)).json(); const p = list.find((t) => t.type === 'page'); if (p) { wsUrl = p.webSocketDebuggerUrl; break } } catch {}
  await sleep(200)
}
const ws = new WebSocket(wsUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0; const pending = new Map(); const events = []
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id) } else if (d.method) events.push(d) }
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, (d) => (d.error ? rej(new Error(method + ': ' + JSON.stringify(d.error))) : res(d.result))); ws.send(JSON.stringify({ id: i, method, params })) })
const evalJs = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value }
await send('Page.enable'); await send('Runtime.enable')
const results = {}
for (const job of jobs) {
  await send('Emulation.setDeviceMetricsOverride', { width: job.width, height: job.height, deviceScaleFactor: job.dpr ?? 2, mobile: !!job.mobile })
  events.length = 0
  await send('Page.navigate', { url: job.url })
  for (let i = 0; i < 100 && !events.some((e) => e.method === 'Page.loadEventFired'); i++) await sleep(100)
  const setup = `(async()=>{ ${(job.fonts || []).map((u) => `{const l=document.createElement('link');l.rel='stylesheet';l.href=${JSON.stringify(u)};document.head.appendChild(l)}`).join('')}
    const st=document.createElement('style'); st.id='pg-variant'; st.textContent=${JSON.stringify(job.css || '')}; document.head.appendChild(st);
    await document.fonts.ready; if(${job.rawWait?'true':'false'}){return []} await new Promise(r=>setTimeout(r,${job.wait ?? 900})); await document.fonts.ready; if(!${job.noscroll?'true':'false'}){for(let y=0;y<document.documentElement.scrollHeight;y+=300){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}} await new Promise(r=>setTimeout(r,2200)); window.scrollTo(0,0); await new Promise(r=>setTimeout(r,300)); return [...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight).filter((v,i,a)=>a.indexOf(v)===i) })()`
  const fonts = await evalJs(setup)
  if (job.eval) results[job.name] = await evalJs(`(async()=>{ ${job.eval} })()`)
  for (const c of (job.clips || (job.clip ? [{ out: job.out, clip: job.clip }] : []))) {
    const clip = await evalJs(`(async()=>{ ${c.clip} })()`)
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: clip.x, y: clip.y, width: clip.width, height: clip.height, scale: 1 } })
    writeFileSync(c.out, Buffer.from(shot.data, 'base64'))
    console.log('saved', c.out, JSON.stringify(clip))
  }
  console.log('done', job.name, 'fonts:', fonts.join(', '))
}
writeFileSync(process.argv[3] || 'results.json', JSON.stringify(results, null, 2))
ws.close(); chrome.kill()
