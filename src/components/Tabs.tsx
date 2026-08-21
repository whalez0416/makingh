'use client';

import {useState} from 'react';

// 서브 페이지·클리닉 그리드 공용 탭. 패널은 서버에서 렌더된 children 을 그대로 받는다.
export default function Tabs({
  labels,
  panels
}: {
  labels: string[];
  panels: React.ReactNode[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div
        role="tablist"
        className="border-line flex flex-wrap gap-x-6 gap-y-2 border-b lg:gap-x-10"
      >
        {labels.map((label, i) => (
          <button
            key={label}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`-mb-px flex min-h-11 items-center border-b-2 text-[15px] font-bold transition-colors lg:text-[18px] ${
              i === active
                ? 'border-ink text-ink'
                : 'text-sub hover:text-ink border-transparent'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="pt-8 lg:pt-12">{panels[active]}</div>
    </div>
  );
}
