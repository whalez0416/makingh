import type {Field} from 'payload';

// 접수 경로 = 신청서를 보낸 페이지의 언어(2026-10-07). 국내(한국어) 상담과 중화권(간체·번체) 상담을 관리자·슬랙에서 나눠 본다.
export const INTAKE_LANGS = [
  {value: 'ko', label: '국내 (한국어)', badge: '🇰🇷 국내'},
  {value: 'zh', label: '중국 (간체)', badge: '🇨🇳 중국(간체)'},
  {value: 'zh-Hant', label: '중화권 (번체)', badge: '🇭🇰 중화권(번체)'}
] as const;

export const intakeLangField: Field = {
  name: 'lang',
  type: 'select',
  label: '접수 경로',
  defaultValue: 'ko',
  options: INTAKE_LANGS.map(({value, label}) => ({value, label})),
  admin: {position: 'sidebar', readOnly: true}
};

// 폼이 보낸 값이 목록에 없으면 국내로 (빈 값·조작된 값 방지)
export const normalizeLang = (v: unknown) => (INTAKE_LANGS.some((l) => l.value === v) ? (v as string) : 'ko');
export const intakeBadge = (v: unknown) => INTAKE_LANGS.find((l) => l.value === v)?.badge ?? '🇰🇷 국내';
