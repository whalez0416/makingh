'use client';

import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';
import {assetBase} from '@/lib/site';

// 시그니처 페이지 본문 (2026-09-30 발주자 선택: 매거진 시안 A를 뼈대로, 고민 가이드 시안 C의 고민 버튼을 빌려 온다).
// 위: 사진 + 번호 주석(구 사이트 부위 설명) / 가운데: 고민 버튼 띠(스크롤해도 따라온다) /
// 아래: 세 챕터로 읽는 13종 — 고민을 고르면 맞는 패키지는 표시가 붙고 나머지는 옅어진다. 순서는 바꾸지 않는다.
// 묶음·고민 연결은 패키지 번호 기준으로 고정(한국어 태그라인에서 가른 것)이라 언어가 바뀌어도 같다.

const GROUP_OF = [0, 0, 1, 1, 2, 0, 2, 1, 1, 1, 2, 0, 0] as const;
const CHAPTER_IMG = ['hero/stem.jpg', 'hero/rolling-3.jpg', 'hero/sub2.jpg'] as const;
const BADGE = new Set([11, 12]);
// 고민 4갈래 → 해당 패키지(0부터). 태그라인의 리프팅 / 탄력·밀도 / 재생·회복·컨디션 / 윤곽·지방
const CONCERN_OF: number[][] = [
  [0, 2, 3, 4, 5, 6, 7, 8, 10, 11],
  [1, 2, 7, 8, 9, 10, 12],
  [0, 1, 2, 3, 5, 6, 11, 12],
  [6, 9, 10]
];
// 점 위치: public/signature/model.jpg(1200×1593, 고개를 든 옆모습) 자체의 비율.
// 사진 상자가 늘 사진과 같은 비율이라(아래가 잘릴 뿐) 화면 크기가 달라도 점이 얼굴에서 벗어나지 않는다.
// 사진을 바꾸면 같이 옮길 것 (2026-09-30: 칸 비율 기준으로 두었다가 넓은 화면에서 3번이 코로 간 사고)
const SPOTS = [
  {x: 40, y: 21}, // 이마 — 눈썹 위
  {x: 47, y: 37}, // 뺨 — 주름·탄력
  {x: 27, y: 53}, // 턱 아래 — 이중턱
  {x: 49, y: 50} //  아래턱 가장자리 — 턱선
] as const;
const ROMAN = ['I', 'II', 'III'];

type Pkg = {name: string; tagline: string; desc: string};
type T = {
  eyebrow: string;
  headline: string;
  lead: string;
  spots: {t: string; d: string}[];
  concernQ: string;
  concerns: string[];
  concernHint: string;
  groups: {t: string; d: string}[];
  badge: string;
  ask: string;
};

export default function SignatureBody({items, t, kakao}: {items: Pkg[]; t: T; kakao: string}) {
  const [picked, setPicked] = useState<number[]>([]);
  // 상단: 사진을 붙잡아 두고 스크롤하는 동안 번호가 1→4 로 차례로 켜지며 그 자리 설명이 뜬다
  const stage = useRef<HTMLElement>(null);
  const [spot, setSpot] = useState(0);
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = stage.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const run = el.offsetHeight - window.innerHeight; // 붙잡혀 있는 동안 흐를 거리
      const p = run > 0 ? Math.min(Math.max(-r.top / run, 0), 0.999) : 0;
      setSpot(Math.floor(p * SPOTS.length));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read); // 스크롤 핸들러는 예약만 — 읽기는 한 프레임에 한 번
    };
    read();
    window.addEventListener('scroll', on, {passive: true});
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const score = (i: number) => picked.filter((c) => CONCERN_OF[c].includes(i)).length;
  const toggle = (c: number) => setPicked((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  return (
    <>
      {/* ── 위: 사진 + 주석 — 높은 구간 안에 화면 한 장을 붙잡아 두고, 스크롤로 번호를 넘긴다 ── */}
      <section ref={stage} className="sig-stage relative" style={{height: `calc(100svh + ${SPOTS.length * 55}vh)`}}>
        <div className="sticky top-14 grid h-[calc(100svh-56px)] grid-rows-[minmax(0,1fr)_auto] lg:top-[72px] lg:h-[calc(100svh-72px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:grid-rows-1">
          <div className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 aspect-[1200/1593]">
            <Image src={`${assetBase}/signature/model.jpg`} alt="" fill priority sizes="(min-width:1024px) 52vw, 100vw" className="object-cover" />
            {SPOTS.map((p, i) => (
              <span
                key={i}
                className={`sig-num ${i === spot ? 'is-on' : ''}`}
                style={{left: `${p.x}%`, top: `${p.y}%`}}
                aria-hidden
              >
                {i + 1}
                {/* 켜진 번호 옆에 그 자리 설명 */}
                <span className={`sig-cap ${p.x < 40 ? 'sig-cap-l' : ''}`}>
                  <b>{t.spots[i]?.t}</b>
                  <small>{t.spots[i]?.d}</small>
                </span>
              </span>
            ))}
            </div>
          </div>
          <div className="flex flex-col px-5 pt-5 pb-6 lg:px-16 lg:pt-16 lg:pb-14">
            <p className="sig-italic text-accent text-[44px] leading-[0.9] lg:text-[104px]">Signature</p>
            <h1 className="sig-serif text-ink mt-2 text-[22px] leading-[1.3] whitespace-pre-line lg:mt-5 lg:text-[46px]">{t.headline}</h1>
            <p className="text-sub mt-5 hidden max-w-[400px] text-[15px] leading-relaxed break-keep lg:block lg:text-[17px]">{t.lead}</p>
            <ol className="border-line mt-10 hidden grid-cols-2 gap-x-6 gap-y-4 border-t pt-6 lg:mt-auto lg:grid">
              {t.spots.map((s, i) => (
                <li key={s.t} className={`text-[14px] leading-snug transition-opacity duration-500 ${i === spot ? 'opacity-100' : 'opacity-35'}`}>
                  <b className="sig-serif text-ink block text-[15px]">
                    <sup className="text-accent mr-1 font-sans font-bold">{i + 1}</sup>
                    {s.t}
                  </b>
                  <span className="text-sub">{s.d}</span>
                </li>
              ))}
            </ol>
            {/* 넘길 자리가 남았다는 표시 */}
            <div className="mt-4 flex items-center gap-2 lg:mt-6" aria-hidden>
              {SPOTS.map((_, i) => (
                <span key={i} className={`h-[3px] rounded-full transition-all duration-500 ${i === spot ? 'bg-ink w-8' : 'bg-line w-3'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 가운데: 고민 가이드 (시안 C) — 챕터를 읽는 동안 헤더 아래에 붙어 따라온다 ── */}
      <div className="sig-guide border-line bg-bg/90 sticky top-14 z-30 border-y backdrop-blur lg:top-[72px]">
        <div className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:gap-8 lg:px-10 lg:py-5">
          <p className="sig-serif text-ink shrink-0 text-[17px] lg:text-[20px]">{t.concernQ}</p>
          <div className="flex flex-wrap gap-2">
            {t.concerns.map((c, k) => {
              const on = picked.includes(k);
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(k)}
                  className={`echo h-10 rounded-full border px-4 text-[14px] font-bold transition-colors lg:h-11 lg:px-5 ${
                    on ? 'bg-ink border-ink text-white' : 'border-line text-sub hover:border-ink hover:text-ink bg-surface'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <p className="text-sub text-[12.5px] lg:ml-auto lg:text-[13px]">{t.concernHint}</p>
        </div>
      </div>

      {/* ── 아래: 세 챕터 (시안 A) ── */}
      {t.groups.map((g, gi) => (
        <section
          key={g.t}
          className={`grid gap-8 px-5 py-16 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16 lg:px-16 lg:py-[100px] ${gi ? 'border-line border-t' : ''}`}
        >
          <div className="flex flex-col gap-3 self-start lg:sticky lg:top-[170px]">
            <span className="sig-italic text-accent text-[26px]">Chapter {ROMAN[gi]}</span>
            <h2 className="sig-serif text-ink text-[26px] lg:text-[30px]">{g.t}</h2>
            <p className="text-sub text-[14px] leading-relaxed break-keep">{g.d}</p>
            <div className="relative mt-2 hidden aspect-[4/5] overflow-hidden lg:block">
              <Image src={`${assetBase}/${CHAPTER_IMG[gi]}`} alt="" fill sizes="300px" className="object-cover" />
            </div>
          </div>
          <ul>
            {items.map((p, i) => {
              if (GROUP_OF[i] !== gi) return null;
              const s = score(i);
              const dim = picked.length > 0 && s === 0;
              return (
                <li
                  key={i}
                  className={`border-line grid grid-cols-[48px_minmax(0,1fr)] gap-x-4 border-b py-6 transition-opacity duration-300 lg:grid-cols-[72px_minmax(0,1fr)_auto] lg:gap-x-6 lg:py-7 ${
                    dim ? 'opacity-30' : ''
                  }`}
                >
                  <span className="sig-italic text-accent text-[30px] leading-none lg:text-[36px]">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="sig-serif text-ink text-[19px] leading-[1.45] break-keep lg:text-[23px]">
                      {p.name}
                      {BADGE.has(i) && (
                        <span className="border-accent text-accent ml-2 inline-block rounded-full border px-2 py-px align-[3px] font-sans text-[11px] font-bold">
                          {t.badge}
                        </span>
                      )}
                    </h3>
                    <p className="text-accent mt-1.5 text-[13px] lg:text-[14px]">{p.tagline}</p>
                    <p className="text-sub mt-1.5 text-[14px] leading-relaxed break-keep">{p.desc}</p>
                    {s > 0 && (
                      <span className="mt-3 flex flex-wrap gap-1.5">
                        {picked
                          .filter((c) => CONCERN_OF[c].includes(i))
                          .map((c) => (
                            <span key={c} className="bg-ink rounded-full px-2.5 py-1 text-[11.5px] font-bold text-white">
                              ✓ {t.concerns[c]}
                            </span>
                          ))}
                      </span>
                    )}
                  </div>
                  <a
                    href={kakao}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={dim ? -1 : undefined}
                    className="text-sub hover:text-ink col-start-2 mt-3 w-fit border-b border-current text-[13px] transition-colors lg:col-start-3 lg:row-start-1 lg:mt-1.5 lg:self-start"
                  >
                    {t.ask}
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
