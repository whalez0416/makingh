import {use} from 'react';
import {setRequestLocale} from 'next-intl/server';
import Hero from '@/sections/Hero';
import NumbersStrip from '@/sections/NumbersStrip';
import Diagnosis from '@/sections/Diagnosis';

// Phase 1 범위: 브리프 §4 메인 섹션 1·2·4. 나머지는 Phase 2·3.
export default function HomePage({params}: PageProps<'/[locale]'>) {
  const {locale} = use(params);
  setRequestLocale(locale); // 정적 렌더링 유지

  return (
    <>
      <Hero />
      <NumbersStrip />
      <Diagnosis />
    </>
  );
}
