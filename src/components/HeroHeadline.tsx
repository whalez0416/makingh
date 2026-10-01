'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';
import SkinLift from '@/components/SkinLift';

// 뷰웰 히어로: 헤드라인이 교체되고 오른쪽에 01/03 카운터가 붙는다.
// 2026-09-29 모션 보강: 줄마다 마스크 안에서 올라오고, 카운터 밑줄이 다음 교체까지 채워진다.
// 2026-09-30 기존 사이트 롤링 영상 3개를 헤드라인과 짝지어 같이 바꾼다 (n번 문장 = n번 영상).
// 영상이 끝까지 재생되고, 끝나기 직전에 다음 영상이 겹쳐 시작된다(나가는 영상을 멈추지 않는다).
// 2026-10-01 3번 영상을 빼고 그 자리에 피부 당김 장면(SkinLift) — 영상이 아닌 장면은 SKIN_MS 동안 머문다.
// 동작 줄이기 설정이면 교체도 재생도 없이 첫 장면(포스터)만 둔다.
const INTERVAL = 5000; // 영상이 없거나 재생이 막혔을 때의 교체 간격
const SKIN_MS = 7000; // 피부 장면은 만져 볼 시간을 조금 더 준다
const FADE = 0.8; // 다음 영상이 미리 시작해 겹쳐지는 시간(초) — 두 영상이 모두 움직이는 채로 넘어간다

export default function HeroHeadline({
  items,
  videos,
  children
}: {
  items: {lead: string; tail: string}[];
  videos: ({kind: 'video'; src: string; srcMobile: string; poster: string} | {kind: 'skin'; src: string})[];
  children?: ReactNode;
}) {
  const [i, setI] = useState(0);
  const [dur, setDur] = useState(INTERVAL);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const playing = useRef(false);

  // 교체는 영상이 이끈다: 지금 영상이 끝나기 FADE 초 전에 다음으로. 헤드라인·카운터도 같이 넘어간다.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const v = refs.current[i % videos.length];
    const next = () => setI((x) => (x + 1) % items.length);
    if (!v) {
      // 영상이 아닌 장면(피부 당김) — 정해진 시간 머물고 넘어간다. 다음 영상은 미리 받아 둔다
      const nv = refs.current[(i + 1) % videos.length];
      if (nv && nv.preload !== 'auto') nv.preload = 'auto';
      const ms = videos[i % videos.length]?.kind === 'skin' ? SKIN_MS : INTERVAL;
      setDur(ms);
      const t = setTimeout(next, ms);
      return () => clearTimeout(t);
    }
    v.currentTime = 0;
    playing.current = false;
    // 다음 영상은 지금 영상이 도는 동안 받아 둔다 — 첫 화면은 1번 영상만 받는다(영상 1개 약 3MB)
    const nv = refs.current[(i + 1) % videos.length];
    if (nv && nv.preload !== 'auto') nv.preload = 'auto';
    const start = () =>
      v.play().then(
        () => (playing.current = true),
        () => {} // 절전 모드 등으로 막히면 포스터 + 타이머 교체
      );
    // 첫 방문 인트로가 덮고 있으면 막이 걷힐 때 처음부터 튼다 — 인트로 동안은 영상만 받아 둔다
    const html = document.documentElement;
    let mo: MutationObserver | undefined;
    if (html.classList.contains('intro-on')) {
      mo = new MutationObserver(() => {
        if (html.classList.contains('intro-on')) return;
        mo?.disconnect();
        v.currentTime = 0;
        start();
      });
      mo.observe(html, {attributes: true, attributeFilter: ['class']});
    } else start();
    let done = false;
    const onTime = () => {
      if (!v.duration) return;
      setDur((v.duration - FADE) * 1000);
      if (!done && v.duration - v.currentTime <= FADE) {
        done = true;
        next();
      }
    };
    v.addEventListener('timeupdate', onTime);
    // 재생이 끝내 시작되지 않으면 타이머로 넘긴다
    const fallback = setTimeout(() => {
      if (!playing.current && !done && !html.classList.contains('intro-on')) {
        done = true;
        next();
      }
    }, INTERVAL);
    return () => {
      mo?.disconnect();
      v.removeEventListener('timeupdate', onTime);
      clearTimeout(fallback);
    };
  }, [i, items.length, videos.length]);

  return (
    <>
      <div className="hero-photo absolute inset-0">
        {videos.map((v, n) =>
          v.kind === 'skin' ? (
            <div
              key={v.src}
              aria-hidden
              className={`absolute inset-0 transition-opacity duration-[800ms] ${n === i % videos.length ? 'opacity-100' : 'opacity-0'}`}
            >
              <SkinLift src={v.src} active={n === i % videos.length} />
            </div>
          ) : (
          <video
            key={v.src}
            ref={(el) => {
              refs.current[n] = el;
            }}
            poster={v.poster}
            muted
            playsInline
            preload={n === 0 ? 'auto' : 'none'}
            aria-hidden
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[800ms] ${
              n === i % videos.length ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* 폰은 작은 판(약 0.4MB), 그 밖은 원본 해상도(약 3MB) */}
            <source media="(max-width: 767px)" src={v.srcMobile} type="video/mp4" />
            <source src={v.src} type="video/mp4" />
          </video>
          )
        )}
      </div>
      <div className="hero-scrim" />
      <div className="absolute inset-x-0 bottom-0 px-5 pb-14 lg:px-10 lg:pb-20">
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
                style={{animationDuration: `${dur}ms`}}
              />
              <span aria-hidden className="-mb-2 text-[16px] leading-none text-white">
                ➞
              </span>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
}
