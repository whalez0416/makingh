'use client';

import Image from 'next/image';
import {useEffect, useRef} from 'react';

// 서브 페이지 히어로 사진 — 들어오면 낮은 해상도에서 원본 해상도로 또렷해진다 (2026-10-01, "내 피부의 해상도를 높이다").
// 시안: 아티팩트 3trM29GvvHfWVvzhV4ouyh.
// 가볍게: 사진을 반씩 줄인 사본(1/2 … 1/64)을 처음에 한 번만 만들고, 매 프레임엔 이웃한 두 장을 늘려 겹쳐 그린다(drawImage 몇 번).
// - 처음 그림은 흐리게(CSS) 두었다가, 캔버스가 첫 장면을 그리면 캔버스로 넘기고, 끝나면 원래 사진으로 돌아온다.
// - 동작 줄이기면 그냥 사진. JS 가 멈춰도 3초 뒤 CSS 가 흐림을 푼다(globals.css .resolve).

const LEVELS = 6; // 가장 낮은 해상도 = 1/64
const MS = 1900;

// "60% center" · "center" · "30% 40%" → 0..1
const pos = (s: string) => {
  const [x = 'center', y = 'center'] = s.split(/\s+/);
  const n = (k: string) => (k.endsWith('%') ? parseFloat(k) / 100 : k === 'left' || k === 'top' ? 0 : k === 'right' || k === 'bottom' ? 1 : 0.5);
  return [n(x), n(y)] as const;
};

// 사진을 화면 비율로 잘라 base 에 그리고, 반씩 줄인 사본 피라미드를 만든다
function pyramid(im: HTMLImageElement, W: number, H: number, fx: number, fy: number) {
  const mk = (w: number, h: number) => {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    return c;
  };
  const base = mk(W, H);
  const fa = W / H, ia = im.width / im.height;
  const sw = fa > ia ? im.width : im.height * fa, sh = fa > ia ? im.width / fa : im.height;
  const bx = base.getContext('2d')!;
  bx.imageSmoothingQuality = 'high';
  bx.drawImage(im, (im.width - sw) * fx, (im.height - sh) * fy, sw, sh, 0, 0, W, H);
  const lv = [base];
  for (let k = 1; k <= LEVELS; k++) {
    const prev = lv[k - 1], c = mk(prev.width / 2, prev.height / 2), x = c.getContext('2d')!;
    x.imageSmoothingQuality = 'high';
    x.drawImage(prev, 0, 0, c.width, c.height);
    lv.push(c);
  }
  return lv;
}

// 해상도 단계 l(0 = 원본, 6 = 1/64)을 그린다. 소수 단계는 이웃한 두 장을 겹쳐서
function drawResolve(ctx: CanvasRenderingContext2D, lv: HTMLCanvasElement[], l: number) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  const put = (c: HTMLCanvasElement, a: number) => {
    if (a <= 0) return;
    ctx.globalAlpha = a;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(c, 0, 0, W, H);
    if (c !== lv[0]) {
      ctx.globalAlpha = a * 0.3; // 픽셀 결이 아주 살짝 보이게
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(c, 0, 0, W, H);
    }
  };
  const e0 = Math.ceil(l), e1 = Math.floor(l), t = Math.min(1, Math.max(0, ((l - e1) - 0.15) / 0.7));
  const f = e0 === e1 ? 1 : 1 - t * t * (3 - 2 * t);
  put(lv[e0], 1);
  put(lv[e1], f);
  ctx.globalAlpha = 1;
}

export default function ResolveImage({src, sizes, imgPos = 'center', priority = true}: {src: string; sizes: string; imgPos?: string; priority?: boolean}) {
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = box.current!, canvas = cv.current!;
    const done = () => wrap.setAttribute('data-state', 'done');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return done();
    const ctx = canvas.getContext('2d');
    if (!ctx) return done();
    const [fx, fy] = pos(imgPos);
    let raf = 0, t0 = 0;
    const im = new window.Image();
    im.onload = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      const lv = pyramid(im, canvas.width, canvas.height, fx, fy);
      const frame = (now: number) => {
        if (!t0) {
          t0 = now;
          wrap.setAttribute('data-state', 'play'); // 첫 장면부터 캔버스로
        }
        const k = Math.min(1, (now - t0) / MS);
        const e = 1 - Math.pow(1 - k, 2.2); // 처음엔 빨리, 끝은 천천히 맺힌다
        drawResolve(ctx, lv, LEVELS * (1 - e));
        if (k < 1) raf = requestAnimationFrame(frame);
        else done();
      };
      raf = requestAnimationFrame(frame);
    };
    im.onerror = done;
    im.src = src;
    return () => cancelAnimationFrame(raf);
  }, [src, imgPos]);

  return (
    <div ref={box} className="resolve absolute inset-0" data-state="wait">
      <Image src={src} alt="" fill priority={priority} sizes={sizes} className="object-cover" style={{objectPosition: imgPos}} />
      <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full" />
    </div>
  );
}
