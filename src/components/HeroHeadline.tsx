'use client';

import {useEffect, useState} from 'react';

// 뷰웰 히어로: 헤드라인이 교체되고 오른쪽에 01/03 카운터가 붙는다.
// 대형 히어로 사진 위에 얹히므로 화이트 톤 (2026-08-21 히어로 개편).
// 2026-09-29 모션 보강: 줄마다 마스크 안에서 올라오고, 카운터 밑줄이 다음 교체까지 채워진다.
const INTERVAL = 5000;

export default function HeroHeadline({
  items
}: {
  items: {lead: string; tail: string}[];
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), INTERVAL);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div className="flex items-end justify-between gap-6">
      <h1 className="h1 relative text-white">
        {items.map((it, n) => (
          <span
            key={n}
            aria-hidden={n !== i}
            className={`hero-head block ${n === i ? 'is-on' : 'absolute inset-0'}`}
          >
            <span className="hero-line">
              <span>{it.lead}</span>
            </span>
            <span className="hero-line">
              <span>{it.tail}</span>
            </span>
          </span>
        ))}
      </h1>

      <div className="hidden shrink-0 pb-2 lg:block">
        <p className="text-[18px] font-bold text-white">
          {String(i + 1).padStart(2, '0')}
          <span className="font-normal text-white/60"> / {String(items.length).padStart(2, '0')}</span>
        </p>
        <div className="relative mt-3 flex w-[120px] items-center justify-end border-b border-white/30 pb-1">
          <span
            key={i}
            aria-hidden
            className="hero-progress"
            style={{animationDuration: `${INTERVAL}ms`}}
          />
          <span aria-hidden className="-mb-2 text-[16px] leading-none text-white">
            ➞
          </span>
        </div>
      </div>
    </div>
  );
}
