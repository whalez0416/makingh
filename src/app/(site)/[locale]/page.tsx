import {setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import Popups from '@/components/Popups';
import Hero from '@/sections/Hero';
import IntroLogo from '@/components/IntroLogo';
import NumbersStrip from '@/sections/NumbersStrip';
import Philosophy from '@/sections/Philosophy';
import Diagnosis from '@/sections/Diagnosis';
import Packages from '@/sections/Packages';
import ClinicGrid from '@/sections/ClinicGrid';
import Reviews from '@/sections/Reviews';
import Doctor from '@/sections/Doctor';
import NewsFeed from '@/sections/NewsFeed';
import GalleryMarquee from '@/sections/GalleryMarquee';
import Closing from '@/sections/Closing';
import {pageMeta} from '@/lib/meta';

// 브리프 §4 메인 흐름. 7 후기·9 소식은 CMS 를 읽어 비어 있으면 섹션째 빠진다.
// 12 오시는길 정보 블록은 푸터가 담당한다.
export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMeta(locale, 'home', '');
}

export default async function HomePage({params}: PageProps<'/[locale]'>) {
  const {locale} = await params;
  setRequestLocale(locale); // 정적 렌더링 유지

  return (
    <>
      <IntroLogo />
      <Popups locale={locale as Locale} />
      <Hero />
      <NumbersStrip />
      <Philosophy />
      <Diagnosis />
      <Packages />
      <ClinicGrid />
      <Reviews locale={locale as Locale} />
      <Doctor />
      <NewsFeed locale={locale as Locale} />
      <GalleryMarquee />
      <Closing />
    </>
  );
}
