import {useTranslations} from 'next-intl';
import Reveal from '@/components/Reveal';
import ConsultCta from '@/components/ConsultCta';

// 서브 페이지 하단 공통 클로징 배너 (뷰웰 상세 8번 패턴 — 선언문 + 상담 CTA).
export default function ConsultBanner() {
  const t = useTranslations('consultBanner');

  return (
    <section className="px-5 pb-24 lg:px-10 lg:pb-[160px]">
      <Reveal className="rounded-[20px] bg-[linear-gradient(120deg,var(--color-ink)_30%,var(--color-accent)_150%)] p-8 py-14 text-center lg:rounded-[30px] lg:p-20">
        <p className="text-[22px] leading-snug font-bold whitespace-pre-line text-white lg:text-[36px]">
          {t('quote')}
        </p>
        <div className="mt-8 lg:mt-10">
          <ConsultCta label={t('cta')} variant="light" />
        </div>
      </Reveal>
    </section>
  );
}
