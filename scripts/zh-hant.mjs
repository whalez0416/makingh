// 간체(messages/zh.json) → 번체(messages/zh-Hant.json). 번체는 손으로 고치지 않고 이 스크립트로만 만든다.
// s2twp: 글자 + 대만식 어휘(软件→軟體). 홍콩 독자도 읽는 데 지장 없다. 홍콩식 어휘가 필요하면 s2hk 로 바꾼다.
import {readFileSync, writeFileSync} from 'node:fs';
import * as OpenCC from 'opencc-js';

const base = OpenCC.Converter({from: 'cn', to: 'twp'});
// twp 가 문맥을 모르고 바꾸는 단어만 되돌린다. 項目(시술 항목)을 專案(프로젝트)으로, 激活(세포 활성화)을 啟用(기능 켜기)으로 바꿔 버린다.
const FIX = [['專案', '項目'], ['啟用', '活化'], ['銷燬', '銷毀']];
const convert = (s) => FIX.reduce((acc, [a, b]) => acc.replaceAll(a, b), base(s));
const walk = (v) =>
  Array.isArray(v) ? v.map(walk)
  : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]))
  : typeof v === 'string' ? convert(v)
  : v;

const zh = JSON.parse(readFileSync('messages/zh.json', 'utf8'));
writeFileSync('messages/zh-Hant.json', JSON.stringify(walk(zh), null, 2) + '\n');
console.log('messages/zh-Hant.json 생성');
