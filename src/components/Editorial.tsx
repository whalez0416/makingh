import Image from 'next/image';
import type {ReactNode} from 'react';
import Reveal from '@/components/Reveal';
import {assetBase} from '@/lib/site';

// 서브 페이지 공통 "매거진" 문법 (2026-09-30 발주자: 시그니처와 비슷한 결로 다른 페이지도).
// 명조 제목 + 금색 이탤릭 영문 + 가는 선 + 이탤릭 번호. 카드 상자 대신 선으로 나눈다.

// 페이지 상단. img 가 있으면 사진|글 두 칸, 없으면 글만(폼·목록 페이지).
export function MagHero({
  en,
  title,
  desc,
  img,
  imgPos = 'center'
}: {
  en: string;
  title: string;
  desc?: string;
  img?: string;
  imgPos?: string;
}) {
  if (!img) {
    return (
      <header className="border-line border-b px-5 pt-28 pb-12 lg:px-16 lg:pt-[170px] lg:pb-[72px]">
        <p className="ed-italic text-accent text-[52px] leading-[0.9] lg:text-[96px]">{en}</p>
        <div className="mt-4 flex flex-col gap-4 lg:mt-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h1 className="ed-serif text-ink text-[30px] leading-[1.3] break-keep lg:text-[46px]">{title}</h1>
          {desc && <p className="text-sub max-w-[440px] text-[15px] leading-relaxed break-keep lg:pb-2 lg:text-[17px]">{desc}</p>}
        </div>
      </header>
    );
  }
  return (
    <section className="pt-14 lg:pt-[72px]">
      <div className="grid lg:min-h-[640px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto">
          <Image src={`${assetBase}/${img}`} alt="" fill priority sizes="(min-width:1024px) 52vw, 100vw" className="object-cover" style={{objectPosition: imgPos}} />
        </div>
        <div className="flex flex-col justify-center px-5 py-12 lg:px-16 lg:py-20">
          <p className="ed-italic text-accent text-[56px] leading-[0.9] lg:text-[96px]">{en}</p>
          <h1 className="ed-serif text-ink mt-5 text-[30px] leading-[1.3] break-keep lg:text-[46px]">{title}</h1>
          {desc && <p className="text-sub mt-5 max-w-[440px] text-[15px] leading-relaxed break-keep lg:text-[17px]">{desc}</p>}
        </div>
      </div>
    </section>
  );
}

// 챕터 바로가기 띠 — 스크롤해도 헤더 아래에 붙어 따라온다. 링크만이라 JS 가 없다.
export function ChapterNav({items}: {items: {id: string; label: string}[]}) {
  return (
    <nav className="border-line bg-bg/90 sticky top-14 z-30 border-y backdrop-blur lg:top-[72px]">
      <ol className="flex gap-2 overflow-x-auto px-5 py-3 lg:gap-3 lg:px-16 lg:py-4">
        {items.map((it, i) => (
          <li key={it.id} className="shrink-0">
            <a
              href={`#${it.id}`}
              className="border-line text-sub hover:border-ink hover:text-ink bg-surface inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[14px] font-bold transition-colors lg:h-11 lg:px-5"
            >
              <span className="ed-italic text-accent text-[16px] font-normal">{ROMAN[i]}</span>
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

// 챕터 한 칸: 왼쪽(번호·제목·설명·사진)은 스크롤을 따라오고, 오른쪽에 본문.
export function Chapter({
  id,
  no,
  title,
  desc,
  img,
  children,
  first
}: {
  id: string;
  no: number;
  title: string;
  desc?: string;
  img?: string;
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <section
      id={id}
      className={`grid scroll-mt-[140px] gap-8 px-5 py-16 lg:scroll-mt-[160px] lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16 lg:px-16 lg:py-[100px] ${
        first ? '' : 'border-line border-t'
      }`}
    >
      <div className="flex flex-col gap-3 self-start lg:sticky lg:top-[170px]">
        <span className="ed-italic text-accent text-[26px]">Chapter {ROMAN[no]}</span>
        <h2 className="ed-serif text-ink text-[26px] leading-[1.35] break-keep lg:text-[30px]">{title}</h2>
        {desc && <p className="text-sub text-[14px] leading-relaxed break-keep">{desc}</p>}
        {img && (
          <div className="relative mt-2 hidden aspect-[4/5] overflow-hidden lg:block">
            <Image src={`${assetBase}/${img}`} alt="" fill sizes="300px" className="object-cover" />
          </div>
        )}
      </div>
      <Reveal className="min-w-0">{children}</Reveal>
    </section>
  );
}

// 큰 문장 한 줄(명조) — 챕터를 여는 정의·선언
export function Lead({children, sub}: {children: ReactNode; sub?: ReactNode}) {
  return (
    <div className="mb-10 lg:mb-14">
      <p className="ed-serif text-ink text-[21px] leading-[1.6] break-keep lg:text-[28px]">{children}</p>
      {sub && <p className="text-accent mt-4 text-[14px] font-bold lg:text-[15px]">{sub}</p>}
    </div>
  );
}

// 이탤릭 번호 + 명조 이름 + 설명, 가는 선으로 나눈 목록 (카드 대신)
export function EdList({
  title,
  items,
  cols = 1
}: {
  title?: string;
  items: {name?: string; desc: string; sub?: string}[];
  cols?: 1 | 2;
}) {
  return (
    <div className="mb-12 last:mb-0 lg:mb-16">
      {title && <h3 className="text-sub mb-2 text-[13px] font-bold tracking-[0.08em] lg:text-[14px]">{title}</h3>}
      <ol className={`border-line border-t ${cols === 2 ? 'md:grid md:grid-cols-2 md:gap-x-10' : ''}`}>
        {items.map((it, i) => (
          <li key={i} className="border-line grid grid-cols-[44px_minmax(0,1fr)] gap-x-3 border-b py-5 lg:grid-cols-[60px_minmax(0,1fr)] lg:py-6">
            <span className="ed-italic text-accent text-[26px] leading-none lg:text-[30px]">{String(i + 1).padStart(2, '0')}</span>
            <div>
              {it.name && <p className="ed-serif text-ink text-[18px] leading-[1.45] break-keep lg:text-[21px]">{it.name}</p>}
              {it.sub && <p className="text-accent mt-1 text-[13px] font-bold lg:text-[14px]">{it.sub}</p>}
              <p className={`text-sub text-[14px] leading-relaxed break-keep lg:text-[15px] ${it.name ? 'mt-1.5' : 'text-ink'}`}>{it.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// 순서가 있는 과정 — STEP 번호 + 굵은 선
export function Steps({title, items}: {title?: string; items: {name: string; desc: string}[]}) {
  return (
    <div className="mb-12 last:mb-0 lg:mb-16">
      {title && <h3 className="text-sub mb-4 text-[13px] font-bold tracking-[0.08em] lg:text-[14px]">{title}</h3>}
      <ol className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4">
        {items.map((s, i) => (
          <li key={s.name} className="border-ink border-t-2 pt-3">
            <span className="text-accent text-[11px] font-bold tracking-[0.08em]">STEP {i + 1}</span>
            <b className="text-ink mt-1 block text-[15px] break-keep">{s.name}</b>
            <span className="text-sub mt-1 block text-[13px] leading-relaxed break-keep">{s.desc}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
