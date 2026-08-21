import {useTranslations} from 'next-intl';
import Reveal from '@/components/Reveal';

// 브리프 §4-8 의료진 — 원장 사진(수급 전 그라데이션 플레이스홀더) + 철학 인용 + 경력.
export default function Doctor() {
  const t = useTranslations('doctor');
  const careers = t.raw('careers') as string[];

  return (
    <section className="px-5 py-24 lg:px-10 lg:py-[160px]">
      <Reveal className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-[80px]">
        <div className="aspect-[3/4] w-full max-w-[420px] shrink-0 rounded-[20px] bg-[linear-gradient(160deg,var(--color-line),var(--color-accent)_75%,var(--color-ink))] lg:rounded-[30px]" />

        <div className="min-w-0">
          <p className="eyebrow mb-1 lg:mb-2.5">{t('eyebrow')}</p>
          <h2 className="h2 text-ink">
            {t('title')}
            <span className="text-sub ml-3 align-middle text-[15px] font-normal lg:text-[20px]">
              {t('sub')}
            </span>
          </h2>

          <blockquote className="text-ink mt-6 text-[17px] leading-relaxed font-bold whitespace-pre-line lg:mt-10 lg:text-[24px]">
            {t('quote')}
          </blockquote>

          <p className="text-accent mt-6 text-[14px] font-bold lg:mt-10 lg:text-[16px]">
            {t('fields')}
          </p>
          <ul className="text-sub mt-3 space-y-1.5 text-[14px] lg:text-[16px]">
            {careers.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
