// 브리프 §3 반응형: 375 / 768 / 1440 세 폭 확인용. 설치된 Edge·Chrome 을 그대로 쓴다.
// 사용: npm run dev 를 띄운 뒤  npm run shots  [-- <baseUrl>]
import {mkdir, access} from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] ?? 'http://localhost:3000/ko';
const WIDTHS = [375, 768, 1440];
const THEMES = ['a', 'b', 'c'];
const CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe'
];

const exists = async (p) => access(p).then(() => true, () => false);
const executablePath = (
  await Promise.all(CANDIDATES.map(async (p) => ((await exists(p)) ? p : null)))
).find(Boolean);
if (!executablePath) throw new Error('Edge/Chrome 을 찾지 못했습니다');

await mkdir('shots', {recursive: true});
const browser = await puppeteer.launch({executablePath, headless: true});

for (const theme of THEMES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({width, height: width < 768 ? 812 : 900});
    // 검증 촬영은 모션을 끈 최종 상태로 — 진입 애니메이션 때문에 안 본 섹션이 비어 찍힌다
    await page.emulateMediaFeatures([
      {name: 'prefers-reduced-motion', value: 'reduce'}
    ]);
    await page.goto(`${BASE}?vi=${theme}`, {waitUntil: 'networkidle0'});
    // next/image 는 지연 로딩이라 끝까지 훑어야 뷰포트 밖 사진이 들어온다
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 150));
      }
      scrollTo(0, 0);
    });
    await page.waitForNetworkIdle({idleTime: 500, timeout: 15000}).catch(() => {});
    await new Promise((r) => setTimeout(r, 400));
    const file = `shots/${theme}-${width}.png`;
    await page.screenshot({path: file, fullPage: true});
    console.log(file);
    await page.close();
  }
}
await browser.close();
