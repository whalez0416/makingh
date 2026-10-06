import Image from 'next/image';
import type {CSSProperties, ReactNode} from 'react';
import Reveal from '@/components/Reveal';
import ResolveImage from '@/components/ResolveImage';
import {assetBase} from '@/lib/site';

// 서브 페이지 공통 문법 (2026-10-01 발주자 확정 개선안 — 아티팩트 Pzr1toCYPY5mxYay2jcRhp).
// 시그니처 분위기(금색 이탤릭 영문 + 명조 페이지 제목)는 맨 위에만. 본문은 고딕으로 정돈하고,
// 장비·시술 정보는 카드·격자·목록으로 "비교하기 쉽게". 내용과 무관한 장식 사진은 쓰지 않는다.
// (09-30 1차 매거진판의 문제: 긴 설명문 명조 · 무관한 모델 사진 · 스펙이 회색 문단에 묻힘)

// 스펙 숫자: 35% · 1.5mm · 60~65℃ · 6.78MHz · 400W · 7줄 · DeepSEE™ 같은 것
const SPEC = /(\d+(?:\.\d+)?(?:\s?[~∼]\s?\d+(?:\.\d+)?)?\s?(?:mm|°C|℃|%|MHz|kHz|W|J|배|가지|줄|nm|분)|[A-Za-z]+™)/g;

function specs(text: string) {
  return [...new Set(text.match(SPEC) ?? [])].slice(0, 4);
}

// 본문 안의 스펙 숫자만 굵게
function Marked({text}: {text: string}) {
  const parts = text.split(SPEC);
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <b key={i} className="text-ink font-bold">{p}</b> : p))}
    </>
  );
}

// 페이지 상단. img 가 있으면 글 | 사진 두 칸(+ 핵심 숫자), 없으면 글만(폼·목록 페이지).
export function MagHero({
  en,
  title,
  desc,
  img,
  imgPos = 'center',
  facts
}: {
  en: string;
  title: string;
  desc?: string;
  img?: string;
  imgPos?: string;
  facts?: {n: number | string; label: string}[];
}) {
  if (!img) {
    return (
      <header className="border-line border-b px-5 pt-28 pb-12 lg:px-16 lg:pt-[170px] lg:pb-[72px]">
        <p className="ed-italic text-accent text-[52px] leading-[0.9] lg:text-[96px]"><Resolving text={en} /></p>
        <div className="mt-4 flex flex-col gap-4 lg:mt-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h1 className="ed-serif text-ink text-[30px] leading-[1.3] break-keep lg:text-[46px]"><Resolving text={title} from={en.length} /></h1>
          {desc && <p className="text-sub max-w-[440px] text-[15px] leading-relaxed break-keep lg:pb-2 lg:text-[17px]">{desc}</p>}
        </div>
      </header>
    );
  }
  return (
    <section className="pt-14 lg:pt-[72px]">
      <div className="grid lg:min-h-[560px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="order-2 flex flex-col justify-center px-5 py-12 lg:order-1 lg:px-16 lg:py-20">
          <p className="ed-italic text-accent text-[52px] leading-[0.9] lg:text-[84px]"><Resolving text={en} /></p>
          <h1 className="ed-serif text-ink mt-4 text-[30px] leading-[1.3] break-keep lg:text-[44px]"><Resolving text={title} from={en.length} /></h1>
          {desc && <p className="text-sub mt-4 max-w-[400px] text-[15px] leading-relaxed break-keep lg:text-[17px]">{desc}</p>}
          {facts && (
            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4 lg:mt-10">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="text-ink text-[28px] leading-none font-extrabold tabular-nums lg:text-[34px]">{f.n}</dd>
                  <dd className="text-sub mt-1.5 text-[13px]">{f.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <div className="relative order-1 aspect-[4/3] overflow-hidden lg:order-2 lg:aspect-auto">
          <ResolveImage src={`${assetBase}/${img}`} sizes="(min-width:1024px) 52vw, 100vw" imgPos={imgPos} />
        </div>
      </div>
    </section>
  );
}

// 히어로 글자가 한 글자씩 차례로 초점이 맞는다(globals.css .rch). 읽기 프로그램용 원문은 aria-label 로
function Resolving({text, from = 0}: {text: string; from?: number}) {
  let i = from;
  // 낱말 단위로 묶어 줄바꿈은 낱말 사이에서만(break-keep 유지)
  return (
    <span aria-label={text}>
      {text.split(' ').map((w, wi) => (
        <span key={wi} aria-hidden>
          {wi > 0 && ' '}
          <span className="whitespace-nowrap">
            {[...w].map((ch, ci) => (
              <span key={ci} className="rch" style={{'--i': i++} as CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

// 챕터 바로가기 띠 — 스크롤해도 헤더 아래에 붙어 따라온다. 링크만이라 JS 가 없다.
export function ChapterNav({items}: {items: {id: string; label: string}[]}) {
  return (
    <nav className="border-line bg-bg/90 sticky top-14 z-30 border-y backdrop-blur lg:top-[72px]">
      <ol className="flex gap-2 overflow-x-auto px-5 py-3 lg:gap-3 lg:px-16 lg:py-4">
        {items.map((it) => (
          <li key={it.id} className="shrink-0">
            <a
              href={`#${it.id}`}
              className="echo border-line text-sub hover:border-ink hover:text-ink bg-surface inline-flex h-10 items-center rounded-full border px-4 text-[14px] font-bold transition-colors lg:h-11 lg:px-5"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

// 챕터: 왼쪽 = 번호·제목(·부제), 오른쪽 = 소개 문단. 그 아래 본문(카드·격자·목록)이 넓게 깔린다.
export function Chapter({
  id,
  no,
  title,
  sub,
  intro,
  children,
  first
}: {
  id: string;
  no: number;
  title: string;
  sub?: string;
  intro?: ReactNode;
  children?: ReactNode;
  first?: boolean;
}) {
  return (
    <section id={id} className={`scroll-mt-[140px] px-5 py-16 lg:scroll-mt-[150px] lg:px-16 lg:py-[96px] ${first ? '' : 'border-line border-t'}`}>
      <Reveal>
        <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
          <div>
            <span className="ed-italic text-accent text-[22px]">Chapter {ROMAN[no]}</span>
            <h2 className="text-ink mt-1 text-[26px] leading-[1.35] font-extrabold tracking-[-0.02em] break-keep lg:text-[30px]">{title}</h2>
            {sub && <p className="text-sub mt-1.5 text-[13px]">{sub}</p>}
          </div>
          {intro && <div className="text-ink max-w-[62ch] text-[16px] leading-[1.8] break-keep lg:text-[17px]">{intro}</div>}
        </div>
        {children && <div className="mt-10 lg:mt-12">{children}</div>}
      </Reveal>
    </section>
  );
}

// 소제목(본문 안 묶음 이름)
export function Label({children}: {children: ReactNode}) {
  return <h3 className="text-sub mt-12 mb-4 text-[13px] font-bold tracking-[0.08em] first:mt-0 lg:text-[14px]">{children}</h3>;
}

// 장비 카드: 이름 굵게 + 스펙 칩(본문에서 숫자를 뽑는다) + 설명(숫자만 굵게)
export function DeviceCards({items}: {items: {name: string; desc: string; sub?: string}[]}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => {
        const chips = specs(it.desc);
        return (
          <article key={it.name} className="bg-surface border-line flex flex-col gap-3 rounded-[18px] border p-6 lg:p-7">
            <div className="flex items-baseline justify-between gap-3">
              <h4 className="text-ink text-[19px] font-extrabold tracking-[-0.02em] break-keep">{it.name}</h4>
              <span className="ed-italic text-accent text-[20px]">{String(i + 1).padStart(2, '0')}</span>
            </div>
            {it.sub && <p className="text-accent -mt-1 text-[13px] font-bold">{it.sub}</p>}
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {chips.map((c) => (
                  <span key={c} className="bg-line text-ink rounded-full px-2.5 py-1 text-[12.5px] font-bold tabular-nums">
                    {c}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sub text-[14px] leading-[1.7] break-keep">
              <Marked text={it.desc} />
            </p>
          </article>
        );
      })}
    </div>
  );
}

// 3칸 격자: 위에 굵은 선 + 이름 + 설명 (특징·기능 같은 짧은 항목)
export function Grid3({items}: {items: {name?: string; desc: string}[]}) {
  return (
    <div className="grid gap-x-5 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <div key={i} className="border-ink border-t-2 pt-3">
          {it.name && <b className="text-ink block text-[16px] break-keep">{it.name}</b>}
          <span className={`block text-[14px] leading-relaxed break-keep ${it.name ? 'text-sub mt-1' : 'text-ink'}`}>{it.desc}</span>
        </div>
      ))}
    </div>
  );
}

// 이름 | 설명 두 칸 목록 (주사 시술처럼 항목이 적고 설명이 긴 것)
export function TwoColList({items}: {items: {name: string; desc: string; sub?: string}[]}) {
  return (
    <ul className="border-line border-t">
      {items.map((it) => (
        <li key={it.name} className="border-line grid gap-2 border-b py-5 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 lg:py-6">
          <b className="text-ink text-[17px] font-extrabold break-keep">{it.name}</b>
          <div>
            {it.sub && <p className="text-accent text-[13px] font-bold">{it.sub}</p>}
            <p className="text-sub text-[14.5px] leading-relaxed break-keep">{it.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// 순서가 있는 과정 — STEP 카드
export function Steps({items}: {items: {name: string; desc: string}[]}) {
  return (
    <ol className={`grid grid-cols-2 gap-3 ${items.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
      {items.map((s, i) => (
        <li key={s.name} className="bg-surface border-line rounded-[14px] border p-4 lg:p-5">
          <span className="text-accent text-[11px] font-bold tracking-[0.08em]">STEP {i + 1}</span>
          <b className="text-ink mt-1 block text-[15px] break-keep">{s.name}</b>
          <span className="text-sub mt-1 block text-[13px] leading-relaxed break-keep">{s.desc}</span>
        </li>
      ))}
    </ol>
  );
}

// 큰 정의 문장(굵은 고딕) + 옆 사진 — 챕터를 여는 핵심 한 줄
export function Definition({text, sub, img}: {text: string; sub?: string; img?: string}) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
      <div>
        <p className="text-ink text-[20px] leading-[1.6] font-bold tracking-[-0.02em] break-keep lg:text-[24px]">{text}</p>
        {sub && <p className="text-accent mt-4 text-[14px] font-bold">{sub}</p>}
      </div>
      {img && (
        <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
          <Image src={`${assetBase}/${img}`} alt="" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
        </div>
      )}
    </div>
  );
}
