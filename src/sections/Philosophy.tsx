import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Reveal from '@/components/Reveal';

// 브리프 §4-3 철학 헤드라인 교차 — 큰 문장 + 클리닉 한 줄 소개를 3회.
// 문장은 전부 reference(구 사이트) 원문에서 발췌·정제한 것만 쓴다 (§9 의료광고).
// 2026-09-30 발주자 피드백("구분선이 없어 지루하다"): 좌우로 흔들리던 교차 정렬을 걷고,
// 가는 선으로 나뉜 세 줄로 바꿨다 — 왼쪽 = 클리닉 이름·소개·바로가기, 오른쪽 = 큰 문장.
const HREF = ['/stem-cell', '/anti-aging', '/signature'] as const;

export default function Philosophy() {
  const t = useTranslations('philosophy');
  const c = useTranslations('common');
  const items = t.raw('items') as {quote: string; cat: string; line: string}[];

  return (
    <section className="band-ink px-5 py-24 lg:px-10 lg:py-[160px]">
      <div className="border-line border-b">
        {items.map((item, i) => (
          <Reveal key={item.cat}>
            <Link
              href={HREF[i % HREF.length]}
              className="group border-line grid gap-6 border-t py-12 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-16 lg:py-[72px]"
            >
              <div className="flex flex-col gap-2 lg:pt-3">
                <p className="eyebrow">{item.cat}</p>
                <p className="text-sub max-w-[360px] text-[14px] leading-relaxed lg:text-[15px]">
                  {item.line}
                </p>
                <span className="text-sub group-hover:text-ink mt-2 inline-flex items-center gap-2 text-[13px] transition-colors lg:mt-4 lg:text-[14px]">
                  {c('more')}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
              {/* 디토 에코: 골드 잔상이 따라붙었다 본체로 합쳐진다 (globals.css .echo-ghost) */}
              <blockquote className="h2 text-ink relative w-fit whitespace-pre-line">
                {item.quote}
                <span aria-hidden className="echo-ghost whitespace-pre-line">
                  {item.quote}
                </span>
              </blockquote>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
