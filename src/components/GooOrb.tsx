'use client';

import {useEffect, useRef} from 'react';

// 브랜드 모티프(복제 직후의 동일한 두 세포)를 gooey 필터로 — 하나가 둘로 갈라졌다 다시 하나로.
// GPU 페인트 비용이 있는 유일한 모션이라 사이트 전체에서 한 곳(클로징)에만 쓰고,
// 화면 밖에서는 정지한다. feColorMatrix 미지원(Safari·Firefox)은 부드러운 블러로 강등.
export default function GooOrb() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      el.dataset.run = entry.isIntersecting ? '1' : '';
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="goo-orb mx-auto" aria-hidden>
      <svg width="0" height="0" className="absolute">
        <filter id="goo-cell">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b" />
          <feColorMatrix
            in="b"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -11"
            result="g"
          />
          <feComposite in="SourceGraphic" in2="g" operator="atop" />
        </filter>
      </svg>
      <i />
      <i />
    </div>
  );
}
