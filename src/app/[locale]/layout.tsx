import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {DEFAULT_THEME} from '@/lib/themes';
import {site} from '@/lib/site';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Floating from '@/components/Floating';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import '../globals.css';

export const metadata: Metadata = {
  title: `${site.name} | DITTOCELL`,
  description:
    '건강한 세포가 건강한 세포를 복제합니다. 디토셀의원 — 첨단재생의료 실시기관.'
};

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

  return (
    <html lang={locale} data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=IBM+Plex+Mono:wght@400;500&family=Noto+Serif+KR:wght@400;500;600&display=swap"
        />
        <script dangerouslySetInnerHTML={{__html: restoreTheme}} />
      </head>
      <body>
        <NextIntlClientProvider>
          <ThemeSwitcher />
          <Header />
          <main>{children}</main>
          <Footer />
          <Floating />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
