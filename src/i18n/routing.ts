import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ko', 'en', 'zh', 'zh-Hant', 'ja'],
  defaultLocale: 'ko'
});

export type Locale = (typeof routing.locales)[number];
