import type {MetadataRoute} from 'next';
import {routing} from '@/i18n/routing';
import {regionAlternates, siteUrl} from '@/lib/site';

// 3개 언어(한국어·간체·번체) × 전 페이지. 언어별 짝(hreflang)도 같이 실어 검색엔진이 언어판을 묶어 보게 한다.
// ponytail: 소식 상세(/notice/[id])는 뺐다 — 빌드 때 DB 가 비어 있어 목록을 못 뽑는다. 소식이 쌓이면 추가.
export const dynamic = 'force-static';

const pages = ['', 'signature/', 'anti-aging/', 'stem-cell/', 'about/', 'reviews/', 'notice/', 'consult/', 'reservation/'];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) => {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, `${siteUrl}/${l}/${page}`])
    );
    return routing.locales.map((l) => ({
      url: `${siteUrl}/${l}/${page}`,
      changeFrequency: page === '' || page === 'notice/' ? 'weekly' : 'monthly',
      priority: page === '' ? 1 : 0.7,
      alternates: {languages: {...languages, ...regionAlternates(page), 'x-default': `${siteUrl}/ko/${page}`}}
    }));
  });
}
