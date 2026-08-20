import {useTranslations} from 'next-intl';
import SectionHeader from '@/components/SectionHeader';
import DiagnosisCard from '@/components/DiagnosisCard';
import ConsultCta from '@/components/ConsultCta';
import Reveal from '@/components/Reveal';

// 배치는 뷰웰 자가진단 패턴 (docs/beauwell-analysis.md §3):
// 균등 그리드가 아니라 높이가 제각각인 말풍선을 여러 열에 지그재그로 흩뿌린다.
// 모바일은 2열로 접힌다. 항목을 6~8개로 늘려도 columns 가 알아서 나눈다.
const ITEMS = [
  {key: 'sagging', href: '/stem-cell', tail: 'l', size: 3, solid: false},
  {key: 'subtle', href: '/signature', tail: 'r', size: 1, solid: true},
  {key: 'fatigue', href: '/stem-cell', tail: 'l', size: 2, solid: false},
  {key: 'lifting', href: '/anti-aging', tail: 'r', size: 2, solid: false}
] as const;

// 열 안에서 시작점을 어긋내 지그재그를 만든다 (뷰웰의 q-col 세로 오프셋)
const OFFSET = ['', 'md:mt-10', 'md:mt-4'];

export default function Diagnosis() {
  const t = useTranslations('diagnosis');

  return (
    <section className="px-5 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            sub={t('sub')}
            action={<ConsultCta label={t('cta')} variant="underline" />}
          />
        </Reveal>

        <Reveal className="columns-2 gap-4 md:gap-5 lg:columns-3">
          {ITEMS.map((item, i) => (
            <div
              key={item.key}
              className={`mb-7 break-inside-avoid md:mb-8 ${OFFSET[i % OFFSET.length]}`}
            >
              <DiagnosisCard
                category={t(`items.${item.key}.cat`)}
                question={t(`items.${item.key}.q`)}
                answer={t(`items.${item.key}.a`)}
                href={item.href}
                tail={item.tail}
                size={item.size}
                solid={item.solid}
              />
            </div>
          ))}
        </Reveal>

        <div className="mt-12 flex justify-center md:hidden">
          <ConsultCta label={t('cta')} variant="underline" />
        </div>
      </div>
    </section>
  );
}
