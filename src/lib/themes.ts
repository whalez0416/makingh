export const THEMES = ['a', 'b', 'c'] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_META: Record<Theme, {name: string; mood: string}> = {
  a: {name: 'Ditto Mark 〃', mood: '에디토리얼 · 다시, 그때의 피부'},
  b: {name: 'Bio Modern', mood: '바이오테크 정밀'},
  c: {name: 'Porcelain Gallery', mood: '사진 주도 미니멀'}
};

export const DEFAULT_THEME: Theme = 'a';

export const isTheme = (v: string): v is Theme =>
  (THEMES as readonly string[]).includes(v);
