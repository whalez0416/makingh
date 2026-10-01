import {cache} from 'react';
import {getCms} from './payload';
import {site} from './site';
import type {Locale} from '@/i18n/routing';

// 병원 기본정보의 단일 출처. CMS 값이 있으면 그것, 없으면 site.ts 상수로 떨어진다.
// 폴백을 두는 이유: DB 가 아직 비어 있어도(첫 셋업·정적 빌드) 화면에 빈 칸이 나오면 안 된다.
export type Settings = {
  tel: string;
  fax: string;
  address: string;
  mapUrl: string;
  instagram: string;
  kakao: string;
  hours: {days: string; time: string}[];
  telHref: string;
  wechatId?: string; // 중국어 상담(위챗) — 비어 있으면 상담 폼으로
  wechatQr?: string;
};

const toHref = (tel: string) => `tel:+82-${tel.replace(/^0/, '').replace(/[.\-\s]/g, '-')}`;

// 한 요청 안에서 여러 컴포넌트가 불러도 DB 는 한 번만 읽는다.
export const getSettings = cache(async (locale?: Locale): Promise<Settings> => {
  const fallback: Settings = {
    tel: site.tel,
    fax: site.fax,
    address: site.address,
    mapUrl: site.mapUrl,
    instagram: site.instagram,
    kakao: site.kakao,
    hours: site.hours.map((h) => ({days: h.days, time: h.time})),
    telHref: toHref(site.tel)
  };

  try {
    const cms = await getCms();
    const s = await cms.findGlobal({slug: 'site-settings', locale, depth: 1});
    if (!s?.tel) return fallback;
    return {
      tel: s.tel,
      fax: s.fax || fallback.fax,
      address: s.address || fallback.address,
      mapUrl: s.mapUrl || fallback.mapUrl,
      instagram: s.instagram || fallback.instagram,
      kakao: s.kakao || fallback.kakao,
      hours: s.hours?.length
        ? s.hours.map((h) => ({days: h.days, time: h.time}))
        : fallback.hours,
      telHref: toHref(s.tel),
      wechatId: s.wechatId || undefined,
      wechatQr: typeof s.wechatQr === 'object' && s.wechatQr?.url ? s.wechatQr.url : undefined
    };
  } catch {
    // DB 가 없는 환경에서도 페이지는 떠야 한다.
    return fallback;
  }
});
