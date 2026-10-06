'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Reveal from '@/components/Reveal';
import SectionHeader from '@/components/SectionHeader';

// 브리프 §4-6 전문 클리닉 그리드 — 뷰웰 탭 그리드의 축소판 (탭 4, 코버플로우 없음).
const TABS = ['all', 'signature', 'antiAging', 'stemCell'] as const;

type Item = {tab: string; cat: string; name: string; desc: string; href: string};

export default function ClinicGrid() {
  const t = useTranslations('clinics');
  const items = t.raw('items') as Item[];
  const [tab, setTab] = useState<(typeof TABS)[number]>('all');
  const shown = tab === 'all' ? items : items.filter((it) => it.tab === tab);

  return (
    <section className="px-5 py-24 lg:px-10 lg:py-[160px]">
      <SectionHeader eyebrow={t('eyebrow')} title={t('title')} />

      <Reveal>
        <div className="mb-8 flex flex-wrap gap-2 lg:mb-12 lg:gap-3">
          {TABS.map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex min-h-11 items-center rounded-full border px-5 text-[14px] font-bold transition-colors lg:text-[16px] ${
                tab === key
                  ? 'bg-ink border-ink text-white'
                  : 'border-line text-sub hover:text-ink bg-transparent'
              }`}
            >
              {t(`tabs.${key}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {shown.map((item) => (
            <Link
              key={item.name}
              // 항목 href 는 nav 와 같은 3개 경로뿐이라 안전하다
              href={item.href as '/signature' | '/anti-aging' | '/stem-cell'}
              className="group border-line bg-surface flex min-h-[180px] flex-col justify-between rounded-[16px] border p-6 transition-colors hover:border-[color:var(--color-accent)] lg:min-h-[220px] lg:p-8"
            >
              <p className="text-accent text-[13px] font-bold lg:text-[15px]">
                {item.cat}
              </p>
              <div>
                <p className="card-title text-ink">{item.name}</p>
                <p className="text-sub mt-1 text-[13px] lg:text-[15px]">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
