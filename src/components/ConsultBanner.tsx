import {useTranslations} from 'next-intl';
import Reveal from '@/components/Reveal';
import ConsultCta from '@/components/ConsultCta';

// 서브 페이지 하단 공통 클로징 배너 (뷰웰 상세 8번 패턴 — 선언문 + 상담 CTA).
// title·desc 를 넘기면 그 페이지 전용 문구로 (시그니처: 구 사이트 "나에게 맞는 시그니처 패키지가 궁금하시다면?").
export default function ConsultBanner({title, desc}: {title?: string; desc?: string} = {}) {
  const t = useTranslations('consultBanner');

  return (
    <section className="px-5 pb-24 lg:px-10 lg:pb-[160px]">
      <Reveal className="rounded-[20px] bg-[linear-gradient(120deg,var(--color-ink)_30%,var(--color-accent)_150%)] p-8 py-14 text-center lg:rounded-[30px] lg:p-20">
        <p className="text-[22px] leading-snug font-bold whitespace-pre-line text-white lg:text-[36px]">
          {title ?? t('quote')}
        </p>
        {desc && (
          <p className="mx-auto mt-4 max-w-[560px] text-[14px] leading-relaxed break-keep text-white/75 lg:text-[17px]">{desc}</p>
        )}
        <div className="mt-8 lg:mt-10">
          <ConsultCta label={t('cta')} variant="light" />
        </div>
      </Reveal>
    </section>
  );
}
