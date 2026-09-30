import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {siteUrl} from '@/lib/site';

// 페이지·언어별 제목·설명·공유 카드(Open Graph)·정식 주소·언어별 짝(hreflang) — 브리프 §6-3·4.
// 2026-09-30 이전엔 전 페이지가 같은 제목·설명이었고 공유 이미지·정식 주소가 없었다.
// 문구는 messages 의 meta.<key>. 공유 이미지는 public/og.jpg 한 장(언어와 무관한 로고+사진).

export type MetaKey =
  | 'home'
  | 'signature'
  | 'antiAging'
  | 'stemCell'
  | 'about'
  | 'reviews'
  | 'notice'
  | 'consult'
  | 'reservation';

const OG_LOCALE: Record<string, string> = {ko: 'ko_KR', en: 'en_US', zh: 'zh_CN', 'zh-Hant': 'zh_TW', ja: 'ja_JP'};

// path 는 로케일 뒤 경로 (홈 '' · 'signature/' 처럼 끝에 / — trailingSlash 설정과 같게)
export async function pageMeta(locale: string, key: MetaKey, path: string): Promise<Metadata> {
  const t = await getTranslations({locale, namespace: 'meta'});
  const title = t(`${key}.title`);
  const description = t(`${key}.desc`);
  const url = `${siteUrl}/${locale}/${path}`;
  const image = {url: '/og.jpg', width: 1200, height: 630, alt: t('ogAlt')};

  return {
    // 홈은 제목 그대로, 나머지는 레이아웃 템플릿 "%s | 디토셀의원"
    title: key === 'home' ? {absolute: title} : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, `${siteUrl}/${l}/${path}`])),
        'x-default': `${siteUrl}/ko/${path}`
      }
    },
    openGraph: {
      type: 'website',
      url,
      siteName: t('siteName'),
      title,
      description,
      locale: OG_LOCALE[locale] ?? 'ko_KR',
      images: [image]
    },
    twitter: {card: 'summary_large_image', title, description, images: [image.url]}
  };
}
