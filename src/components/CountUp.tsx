'use client';

import {useEffect, useRef} from 'react';

// 숫자 카운트업 (§4-2 숫자의 주인공화).
// AEO 가드: 실값은 서버 HTML에 그대로 렌더된다 — JS를 안 돌리는 AI 크롤러도 "210+"를 읽는다.
// JS는 화면 진입 후 숫자 부분만 0부터 다시 세는 시각 효과만 담당한다.
export default function CountUp({value}: {value: string}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const m = value.match(/^(\d+)(.*)$/);
    if (!m) return; // 숫자로 시작하지 않으면("첨단재생의료") 그대로 둔다
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = Number(m[1]);
    const suffix = m[2];

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const D = 1400;
        const tick = (t: number) => {
          const p = Math.min((t - t0) / D, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      {threshold: 0.4}
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
