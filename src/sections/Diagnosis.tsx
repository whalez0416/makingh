import {useTranslations} from 'next-intl';
import DiagnosisCard from '@/components/DiagnosisCard';
import ConsultCta from '@/components/ConsultCta';
import Reveal from '@/components/Reveal';

// 말풍선 모양은 beauwell.kr 실측 (docs/beauwell-analysis.md §3).
// 2026-09-30 발주자 요청: 말풍선이 계속 흐르게. 두 줄이 서로 반대로 천천히 흘러 대화가 오가는 느낌을 준다.
// 한 줄에 같은 묶음을 네 번 이어 붙여 넓은 화면도 채우고, 절반만큼 흐르면 제자리 — 끊김 없는 반복.
// 마우스를 올리면 멈추고(글을 읽을 수 있게), 동작 줄이기 설정이면 멈춘 한 줄로 둔다.
const ITEMS = [
  {key: 'sagging', href: '/stem-cell', tone: 'ink'},
  {key: 'subtle', href: '/signature', tone: 'surface'},
  {key: 'fatigue', href: '/stem-cell', tone: 'surface'},
  {key: 'lifting', href: '/anti-aging', tone: 'surface'}
] as const;

const ROWS = [
  {order: [0, 1, 2, 3], tail: 'l', dir: ''},
  {order: [2, 3, 0, 1], tail: 'r', dir: 'bubble-flow-rev'}
] as const;

export default function Diagnosis() {
  const t = useTranslations('diagnosis');

  return (
    <section className="py-24 lg:py-[160px]">
      <Reveal className="mb-10 px-5 lg:mb-[60px] lg:px-10">
        <p className="eyebrow mb-1 lg:mb-2.5">{t('eyebrow')}</p>
        <div className="flex items-end justify-between gap-8">
          <h2 className="h2 text-ink">{t('title')}</h2>
          <div className="hidden shrink-0 pb-2 lg:block">
            <ConsultCta label={t('cta')} variant="underline" />
          </div>
        </div>
      </Reveal>

      <div className="bubble-rows flex flex-col gap-10 overflow-hidden pb-5 lg:gap-14">
        {ROWS.map((row, r) => (
          <div key={r} className={`bubble-flow flex w-max items-start gap-4 lg:gap-6 ${row.dir}`}>
            {[0, 1, 2, 3].flatMap((copy) =>
              row.order.map((n, k) => {
                const item = ITEMS[n];
                const dup = copy > 0; // 첫 묶음만 읽히고 눌린다 — 나머지는 흐름을 잇는 복제
                return (
                  <div
                    key={`${copy}-${k}`}
                    aria-hidden={dup || undefined}
                    className={`w-[240px] shrink-0 lg:w-[300px] ${dup ? 'bubble-dup' : ''}`}
                  >
                    <DiagnosisCard
                      category={t(`items.${item.key}.cat`)}
                      question={t(`items.${item.key}.q`)}
                      answer={t(`items.${item.key}.a`)}
                      href={item.href}
                      tail={row.tail}
                      tone={r === 0 ? item.tone : n === 1 ? 'ink' : 'surface'}
                      tabIndex={dup ? -1 : undefined}
                    />
                  </div>
                );
              })
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center px-5 lg:hidden">
        <ConsultCta label={t('cta')} variant="underline" />
      </div>
    </section>
  );
}
