import {useTranslations} from 'next-intl';
import Reveal from '@/components/Reveal';

// 뷰웰에 대응 섹션이 없는 디토셀 고유 추가라, 섹션 리듬(상하 120·컨테이너 40)만 맞춘다.
// 210+ / 90% 의 라벨은 reference 원문을 받아 채운다 — 지어내면 의료광고 문구가 된다.
const KEYS = ['sessions', 'rate', 'license'] as const;

export default function NumbersStrip() {
  const t = useTranslations('numbers');

  return (
    <section className="border-line mt-16 border-t px-5 py-16 lg:mt-[120px] lg:px-10 lg:py-[120px]">
      <Reveal className="grid gap-10 md:grid-cols-3 lg:gap-6">
        {KEYS.map((k) => (
          <div key={k}>
            <p className="text-sub text-[14px] lg:text-[16px]">{t(`${k}.label`)}</p>
            <p className="text-ink mt-2 text-[36px] leading-none font-bold lg:mt-4 lg:text-[56px]">
              {t(`${k}.value`)}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
