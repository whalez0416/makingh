export const THEMES = ['a', 'b', 'c'] as const;
export type Theme = (typeof THEMES)[number];

// 레이아웃은 셋이 같다. 색만 다르다.
export const THEME_META: Record<Theme, {name: string; mood: string}> = {
  a: {name: '앤틱골드', mood: '웜 베이지 + 골드'},
  b: {name: '딥그린', mood: '쿨 그레이 + 그린'},
  c: {name: '모카골드', mood: '포슬린 화이트 + 모카'}
};

export const DEFAULT_THEME: Theme = 'a';

export const isTheme = (v: string): v is Theme =>
  (THEMES as readonly string[]).includes(v);
