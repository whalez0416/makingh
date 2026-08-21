import {useTranslations} from 'next-intl';
import Reveal from '@/components/Reveal';

// 브리프 §4-3 철학 헤드라인 교차 — 큰 문장 + 클리닉 한 줄 소개를 3회, 좌/우 교차 정렬.
// 문장은 전부 reference(구 사이트) 원문에서 발췌·정제한 것만 쓴다 (§9 의료광고).
export default function Philosophy() {
  const t = useTranslations('philosophy');
  const items = t.raw('items') as {quote: string; cat: string; line: string}[];

  return (
    <section className="px-5 py-20 lg:px-10 lg:py-[120px]">
      <div className="flex flex-col gap-16 lg:gap-[120px]">
        {items.map((item, i) => (
          <Reveal
            key={item.cat}
            className={i % 2 === 1 ? 'lg:text-right' : ''}
          >
            <blockquote className="h2 text-ink whitespace-pre-line">
              {item.quote}
            </blockquote>
            <p className="eyebrow mt-4 lg:mt-6">{item.cat}</p>
            <p
              className={`text-sub mt-1 max-w-[560px] text-[14px] leading-relaxed lg:text-[16px] ${
                i % 2 === 1 ? 'lg:ml-auto' : ''
              }`}
            >
              {item.line}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
