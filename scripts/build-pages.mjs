// GitHub Pages 용 정적 빌드.
// Payload 관리자·API 는 서버가 있어야 도는 라우트라 output:'export' 가 거부한다.
// 그래서 이 빌드 동안만 (payload) 그룹을 치웠다가 반드시 되돌린다.
// 사이트 페이지의 CMS 조회는 cms.ts 의 안전 래퍼가 DB 없이도 빈 값으로 넘어간다.
import {rename, access, rm} from 'node:fs/promises';
import {spawn} from 'node:child_process';

const SRC = 'src/app/(payload)';
const HIDDEN = 'src/app/_payload.hidden';

const exists = (p) => access(p).then(() => true, () => false);

const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, {stdio: 'inherit', shell: process.platform === 'win32'});
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`exit ${code}`))));
  });

let moved = false;
try {
  if (await exists(SRC)) {
    await rename(SRC, HIDDEN);
    moved = true;
  }
  // 직전 개발 서버가 남긴 라우트 타입이 (payload) 를 참조해 타입 검사가 깨진다.
  await rm('.next', {recursive: true, force: true});
  await run('npx', ['next', 'build']);
} finally {
  // 빌드가 깨져도 원래 자리로 — 안 돌리면 다음 개발 서버에 관리자가 없다.
  if (moved && (await exists(HIDDEN))) await rename(HIDDEN, SRC);
}
