import {useTranslations} from 'next-intl';
import DiagnosisCard from '@/components/DiagnosisCard';
import ConsultCta from '@/components/ConsultCta';
import Reveal from '@/components/Reveal';

// 배치는 beauwell.kr 실측 (docs/beauwell-analysis.md §3):
// 1440 = 5열 253px / 768 = 3열 227px / 375 = 2열 160px, gap 24(모바일 16),
// 말풍선 세로 간격 32, 높이 3단 200/268/410, 컬럼 오프셋 60·106·0·162·52.
// 폭을 실측 그대로 고정하면 375=2열 / 768=3열 / 1440=5열 이 자동으로 맞아떨어진다.
// 지금 항목이 4개뿐이라 1440 에서 다섯째 자리가 빈다 — reference 후기에서 문장을 더 캐면 채운다.
const ITEMS = [
  {key: 'sagging', href: '/stem-cell', tail: 'l', tone: 'ink', h: 'lg:h-[410px]', off: 'lg:mt-[60px]'},
  {key: 'subtle', href: '/signature', tail: 'r', tone: 'surface', h: 'lg:h-[200px]', off: 'lg:mt-[106px]'},
  {key: 'fatigue', href: '/stem-cell', tail: 'l', tone: 'surface', h: 'lg:h-[268px]', off: ''},
  {key: 'lifting', href: '/anti-aging', tail: 'r', tone: 'surface', h: 'lg:h-[200px]', off: 'lg:mt-[162px]'}
] as const;

export default function Diagnosis() {
  const t = useTranslations('diagnosis');

  return (
    <section className="px-5 py-24 lg:px-10 lg:py-[160px]">
      <Reveal className="mb-10 lg:mb-[60px]">
        <p className="eyebrow mb-1 lg:mb-2.5">{t('eyebrow')}</p>
        <div className="flex items-end justify-between gap-8">
          <h2 className="h2 text-ink">{t('title')}</h2>
          <div className="hidden shrink-0 pb-2 lg:block">
            <ConsultCta label={t('cta')} variant="underline" />
          </div>
        </div>
      </Reveal>

      <Reveal className="flex flex-wrap items-start gap-4 md:gap-6">
        {ITEMS.map((item) => (
          <div
            key={item.key}
            className={`w-[calc(50%-8px)] md:w-[226px] lg:w-[252px] ${item.h} ${item.off}`}
          >
            <DiagnosisCard
              category={t(`items.${item.key}.cat`)}
              question={t(`items.${item.key}.q`)}
              answer={t(`items.${item.key}.a`)}
              href={item.href}
              tail={item.tail}
              tone={item.tone}
            />
          </div>
        ))}
      </Reveal>

      <div className="mt-8 flex justify-center lg:hidden">
        <ConsultCta label={t('cta')} variant="underline" />
      </div>
    </section>
  );
}
