// 사진 경량화 (2026-10-07, 모바일 속도) — public 의 jpg·png 를 화면 폭별 WebP 로 미리 만들어 public/_v/ 에 둔다.
// next/image 는 src/lib/img-loader.ts 가 이 목록(src/lib/img-manifest.json)을 보고 폭에 맞는 파일을 고른다.
// 파일 이름에 원본 내용의 해시가 들어가 1년 캐시해도 안전하다(사진을 바꾸면 이름이 바뀐다).
// 사진을 넣거나 바꾸면: node scripts/img-variants.mjs  → public/_v/ 와 manifest 를 같이 커밋.
// 목록에 없는 사진은 원본 그대로 나간다(깨지지 않음).
import {createHash} from 'node:crypto';
import {mkdir, readdir, readFile, rm, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import sharp from 'sharp';

const DIRS = ['hero', 'facility', 'pages', 'signature'];
const WIDTHS = [384, 640, 828, 1200, 1920];
const OUT = 'public/_v';

await rm(OUT, {recursive: true, force: true});
const manifest = {};
for (const d of DIRS) {
  for (const f of (await readdir(join('public', d))).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort()) {
    const key = `${d}/${f}`;
    const buf = await readFile(join('public', key));
    const v = createHash('sha1').update(buf).digest('hex').slice(0, 8);
    const {width} = await sharp(buf).metadata();
    const ws = [...new Set([...WIDTHS.filter((w) => w < width), Math.min(width, WIDTHS.at(-1))])].sort((a, b) => a - b);
    for (const w of ws) {
      const out = join(OUT, `${key.replace(/\.\w+$/, '')}.${v}.${w}.webp`);
      await mkdir(dirname(out), {recursive: true});
      await sharp(buf).resize({width: w}).webp({quality: 78}).toFile(out);
    }
    manifest[key] = {v, w: ws};
  }
}
await writeFile('src/lib/img-manifest.json', JSON.stringify(manifest, null, 1) + '\n');
console.log(`${Object.keys(manifest).length} images`);
