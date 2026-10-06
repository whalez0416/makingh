import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {DEFAULT_THEME} from '@/lib/themes';
import {naverSiteVerification, site, siteUrl} from '@/lib/site';
import {getSettings} from '@/lib/settings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Floating from '@/components/Floating';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import {italic, serifKr} from '@/lib/serif';
import WeChatGate from '@/components/WeChatGate';
import ClinicJsonLd from '@/components/ClinicJsonLd';
import '@/app/globals.css';

// 사이트 공통: 정식 주소 기준(metadataBase)과 제목 틀. 페이지별 제목·설명·공유 카드는 각 page 의 generateMetadata(lib/meta.ts).
export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'meta'});
  return {
    metadataBase: new URL(siteUrl),
    title: {default: t('home.title'), template: `%s | ${t('siteName')}`},
    description: t('home.desc'),
    verification: {other: {'naver-site-verification': naverSiteVerification}}
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

// ponytail: 테마 선택은 ?vi=a|b|c 또는 localStorage + <html data-theme> 하나. 페인트 전에 복원해 깜빡임이 없다.
// Phase 1 비교용이라 테마 확정 시 이 스크립트와 ThemeSwitcher 를 함께 지운다.
const restoreTheme = `try{var q=new URLSearchParams(location.search).get('vi');var t=q||localStorage.getItem('vi');if(t&&'abc'.includes(t))document.documentElement.dataset.theme=t}catch(e){}`;

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // Header·Floating 은 클라이언트 컴포넌트라 CMS 를 직접 못 읽는다 — 여기서 받아 내린다.
  const s = await getSettings(locale);
  const tw = await getTranslations({locale, namespace: 'wechat'});
  const tm = await getTranslations({locale, namespace: 'meta'});

  return (
    <html lang={locale} data-theme={DEFAULT_THEME} className={`${serifKr.variable} ${italic.variable}`} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <script dangerouslySetInnerHTML={{__html: restoreTheme}} />
        <ClinicJsonLd locale={locale} name={tm('siteName')} />
      </head>
      {/* 확장 프로그램(번역기·문법검사 등)이 hydration 전에 body 에 속성을 붙인다.
          우리 서버 출력은 <body> 뿐이라 그 경고만 끈다 — 자식 요소 경고는 그대로 뜬다. */}
      <body suppressHydrationWarning>
        <NextIntlClientProvider>
          <ThemeSwitcher />
          <Header kakao={s.kakao} />
          <main>{children}</main>
          <Footer locale={locale} />
          <Floating kakao={s.kakao} telHref={s.telHref} />
          {locale !== 'ko' && (
            <WeChatGate
              kakao={s.kakao}
              wechatId={s.wechatId}
              qr={s.wechatQr}
              consultHref={`/${locale}/consult/`}
              t={{
                title: tw('title'),
                desc: tw('desc'),
                idLabel: tw('idLabel'),
                copy: tw('copy'),
                copied: tw('copied'),
                close: tw('close')
              }}
            />
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
