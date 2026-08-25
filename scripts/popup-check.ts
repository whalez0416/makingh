// 팝업 기간 판정 확인. 실행: npm run check:popup
import assert from 'node:assert/strict';
import {isLive} from '../src/lib/popup';

const p = {startAt: '2026-09-01T00:00:00.000Z', endAt: '2026-09-30T00:00:00.000Z'};
const at = (s: string) => Date.parse(s);

assert.equal(isLive(p, at('2026-08-31T23:59:59Z')), false, '시작 전에는 안 뜬다');
assert.equal(isLive(p, at('2026-09-01T00:00:00Z')), true, '시작일 0시부터 뜬다');
assert.equal(isLive(p, at('2026-09-15T12:00:00Z')), true, '기간 중에는 뜬다');
assert.equal(isLive(p, at('2026-09-30T23:59:59Z')), true, '종료일 당일까지 뜬다');
assert.equal(isLive(p, at('2026-10-01T00:00:00Z')), false, '다음 날부터 사라진다');

console.log('팝업 기간 판정 5가지 통과');
