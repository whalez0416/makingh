import {useTranslations} from 'next-intl';
import Reveal from '@/components/Reveal';

// 라벨 확정 필요: 210+ / 90% 의 실제 의미는 reference 원문에서 가져와야 한다.
// 지어내면 의료광고 문구가 되므로 〈확인〉 표시를 단 채로 둔다. (브리프 §9)
const KEYS = ['sessions', 'rate', 'license'] as const;

export default function NumbersStrip() {
  const t = useTranslations('numbers');
  return (
    <section className="border-line border-y px-5 py-16 md:px-6 md:py-20">
      <Reveal className="mx-auto grid max-w-[1180px] gap-10 md:gap-12 md:grid-cols-3">
        {KEYS.map((k) => (
          <div key={k}>
            <p className="num-label mb-3">{t(`${k}.label`)}</p>
            <p className="display text-ink text-[clamp(32px,4.6vw,56px)] leading-none">
              {t(`${k}.value`)}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
