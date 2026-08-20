import {useTranslations} from 'next-intl';
import SectionHeader from '@/components/SectionHeader';
import DiagnosisCard from '@/components/DiagnosisCard';
import Reveal from '@/components/Reveal';

// 환자 고민 문장 → 진료 연결. reference 후기에서 문장을 더 캐면 6~8개까지 늘린다.
const ITEMS = [
  {key: 'sagging', href: '/stem-cell'},
  {key: 'subtle', href: '/signature'},
  {key: 'fatigue', href: '/stem-cell'},
  {key: 'lifting', href: '/anti-aging'}
] as const;

export default function Diagnosis() {
  const t = useTranslations('diagnosis');
  return (
    <section className="px-5 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <SectionHeader eyebrow={t('eyebrow')} title={t('title')} sub={t('sub')} />
        </Reveal>
        <Reveal className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, i) => (
            <DiagnosisCard
              key={item.key}
              index={i + 1}
              question={t(`items.${item.key}.q`)}
              answer={t(`items.${item.key}.a`)}
              href={item.href}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
