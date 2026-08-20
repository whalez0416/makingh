import assert from 'node:assert/strict';
import {fillFromKo} from '../src/i18n/fallback.mjs';

const ko = {nav: {a: '가', b: '나'}, hero: {t: '제목'}};

// 부분 번역: 번역된 키만 갈아끼우고 형제 키는 ko 로 남는다
assert.deepEqual(fillFromKo(ko, {nav: {a: 'A'}}), {
  nav: {a: 'A', b: '나'},
  hero: {t: '제목'}
});

// 빈 파일이면 전부 ko
assert.deepEqual(fillFromKo(ko, {}), ko);

// 원본은 건드리지 않는다
fillFromKo(ko, {nav: {a: 'A'}});
assert.equal(ko.nav.a, '가');

console.log('i18n fallback OK');
