'use client';

import {useEffect, useState} from 'react';

// 뷰웰 히어로: 헤드라인이 교체되고 오른쪽에 01/03 카운터가 붙는다.
export default function HeroHeadline({
  items
}: {
  items: {lead: string; tail: string}[];
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div className="flex items-start justify-between gap-6">
      <h1 className="h1 text-ink relative">
        {items.map((it, n) => (
          <span
            key={n}
            aria-hidden={n !== i}
            className={`block transition-opacity duration-700 ${
              n === i ? 'opacity-100' : 'absolute inset-0 opacity-0'
            }`}
          >
            {it.lead}
            <br />
            {it.tail}
          </span>
        ))}
      </h1>

      <div className="hidden shrink-0 pt-2 lg:block">
        <p className="text-ink text-[18px] font-bold">
          {String(i + 1).padStart(2, '0')}
          <span className="text-sub font-normal"> / {String(items.length).padStart(2, '0')}</span>
        </p>
        <div className="border-ink mt-3 flex w-[120px] items-center justify-end border-b pb-1">
          <span aria-hidden className="text-ink -mb-2 text-[16px] leading-none">
            ➞
          </span>
        </div>
      </div>
    </div>
  );
}
