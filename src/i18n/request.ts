import {hasLocale} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import ko from '../../messages/ko.json';
import {fillFromKo} from './fallback.mjs';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages =
    locale === 'ko'
      ? ko
      : fillFromKo(ko, (await import(`../../messages/${locale}.json`)).default);

  return {locale, messages};
});
