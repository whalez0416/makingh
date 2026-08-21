import {useTranslations} from 'next-intl';
import Reveal from '@/components/Reveal';
import ConsultCta from '@/components/ConsultCta';

// 브리프 §4-11 클로징 스테이트먼트 + 예약 CTA (뷰웰 마무리 선언 패턴, 중앙 정렬).
export default function Closing() {
  const t = useTranslations('closing');

  return (
    <section className="px-5 py-24 text-center lg:px-10 lg:py-[180px]">
      <Reveal>
        <p className="text-accent text-[13px] font-bold tracking-[0.18em] uppercase lg:text-[15px]">
          {t('en')}
        </p>
        <p className="h1 text-ink mt-4 whitespace-pre-line lg:mt-8">
          {t('quote')}
        </p>
        <div className="mt-10 lg:mt-14">
          <ConsultCta label={t('cta')} />
        </div>
      </Reveal>
    </section>
  );
}
