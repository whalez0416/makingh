import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ko', 'zh', 'zh-Hant'], // 2026-10-01 영어·일본어 제거(병원 지시) — 한국 상담 + 중화권(위챗) 상담
  defaultLocale: 'ko'
});

export type Locale = (typeof routing.locales)[number];
