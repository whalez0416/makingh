import {useTranslations} from 'next-intl';
import Reveal from '@/components/Reveal';
import ConsultCta from '@/components/ConsultCta';
import GooOrb from '@/components/GooOrb';

// 브리프 §4-11 클로징 스테이트먼트 + 예약 CTA (뷰웰 마무리 선언 패턴, 중앙 정렬).
// 피날레 모션: 두 세포가 하나로(GooOrb) + 문장의 초점이 돌아온다(.focus-in).
export default function Closing() {
  const t = useTranslations('closing');

  return (
    <section className="px-5 py-32 text-center lg:px-10 lg:py-[220px]">
      <Reveal>
        <GooOrb />
        <p className="text-accent mt-6 text-[13px] font-bold tracking-[0.18em] uppercase lg:mt-10 lg:text-[15px]">
          {t('en')}
        </p>
        <p className="h1 text-ink focus-in mt-4 whitespace-pre-line lg:mt-8">
          {t('quote')}
        </p>
        <div className="mt-10 lg:mt-14">
          <ConsultCta label={t('cta')} />
        </div>
      </Reveal>
    </section>
  );
}
