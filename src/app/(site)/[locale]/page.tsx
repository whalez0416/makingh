import {use} from 'react';
import {setRequestLocale} from 'next-intl/server';
import Hero from '@/sections/Hero';
import NumbersStrip from '@/sections/NumbersStrip';
import Philosophy from '@/sections/Philosophy';
import Diagnosis from '@/sections/Diagnosis';
import Packages from '@/sections/Packages';
import ClinicGrid from '@/sections/ClinicGrid';
import Doctor from '@/sections/Doctor';
import GalleryMarquee from '@/sections/GalleryMarquee';
import Closing from '@/sections/Closing';

// 브리프 §4 메인 흐름. 7 후기·9 소식 피드는 CMS 소스라 Phase 2 에서 붙는다.
// 12 오시는길 정보 블록은 푸터가 담당한다.
export default function HomePage({params}: PageProps<'/[locale]'>) {
  const {locale} = use(params);
  setRequestLocale(locale); // 정적 렌더링 유지

  return (
    <>
      <Hero />
      <NumbersStrip />
      <Philosophy />
      <Diagnosis />
      <Packages />
      <ClinicGrid />
      <Doctor />
      <GalleryMarquee />
      <Closing />
    </>
  );
}
