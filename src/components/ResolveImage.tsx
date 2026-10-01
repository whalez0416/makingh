'use client';

import Image from 'next/image';
import {useEffect, useRef} from 'react';

// 서브 페이지 히어로 사진 — 들어오면 낮은 해상도에서 원본 해상도로 또렷해진다 (2026-10-01, "내 피부의 해상도를 높이다").
// 시안: 아티팩트 3trM29GvvHfWVvzhV4ouyh.
// 가볍게: 사진을 반씩 줄인 사본(1/2 … 1/64)을 처음에 한 번만 만들고, 매 프레임엔 이웃한 두 장을 늘려 겹쳐 그린다(drawImage 몇 번).
// 움직임: 전체는 부드러운 저해상도 → 사진 가운데서 선명함이 둥글게 번져 나가고(경계에 옅은 빛), 초점이 맞듯 살짝 당겨졌다 제자리로.
// - 처음 그림은 흐리게(CSS) 두었다가, 캔버스가 첫 장면을 그리면 캔버스로 넘기고, 끝나면 원래 사진으로 돌아온다.
// - 동작 줄이기면 그냥 사진. JS 가 멈춰도 3초 뒤 CSS 가 흐림을 푼다(globals.css .resolve).

const LEVELS = 6; // 가장 낮은 해상도 = 1/64
const MS = 2200;

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
    if (k >= 3) x.filter = 'blur(.6px)'; // 아주 작은 사본은 살짝 풀어 확대했을 때 네모가 안 보이게
    x.drawImage(prev, 0, 0, c.width, c.height);
    lv.push(c);
  }
  return lv;
}

type Rect = [number, number, number, number];

// 해상도 단계 l(0 = 원본 … 6 = 1/64)을 c 에 그린다. 소수 단계는 이웃 두 장을 겹쳐 끊김 없이
function layer(c: CanvasRenderingContext2D, lv: HTMLCanvasElement[], l: number, r: Rect) {
  const e0 = Math.ceil(l), e1 = Math.floor(l), t = Math.min(1, Math.max(0, (l - e1 - 0.1) / 0.8));
  c.imageSmoothingEnabled = true;
  c.globalAlpha = 1;
  c.drawImage(lv[e0], ...r);
  if (e0 !== e1) {
    c.globalAlpha = 1 - t * t * (3 - 2 * t);
    c.drawImage(lv[e1], ...r);
  }
  c.globalAlpha = 1;
}

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// k: 0(흐림) → 1(원본). 시안 아티팩트 3trM29GvvHfWVvzhV4ouyh 의 draw() 와 같은 동작
function drawResolve(ctx: CanvasRenderingContext2D, tx: CanvasRenderingContext2D, lv: HTMLCanvasElement[], k: number) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  const fx = W * 0.5, fy = H * 0.42; // 선명함이 시작되는 곳
  const sc = 1 + 0.07 * (1 - ease(k)); // 초점이 맞으며 제자리로
  const r: Rect = [fx - fx * sc, fy - fy * sc, W * sc, H * sc];
  layer(ctx, lv, LEVELS * Math.pow(1 - k, 0.75), r); // 바탕: 천천히 맑아짐
  if (k <= 0) return;
  const R = Math.hypot(W, H) * 0.75 * ease(k) + 1, soft = Math.max(W, H) * 0.3;
  tx.globalCompositeOperation = 'source-over';
  tx.clearRect(0, 0, W, H);
  layer(tx, lv, LEVELS * Math.pow(1 - k, 2.4), r); // 앞: 더 빨리 선명해지는 사진
  const g = tx.createRadialGradient(fx, fy, Math.max(0, R - soft), fx, fy, R);
  g.addColorStop(0, '#000');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  tx.globalCompositeOperation = 'destination-in';
  tx.fillStyle = g;
  tx.fillRect(0, 0, W, H);
  ctx.drawImage(tx.canvas, 0, 0);
  if (k < 1) {
    // 번지는 경계에 아주 옅은 빛
    const rg = ctx.createRadialGradient(fx, fy, Math.max(0, R - soft * 0.9), fx, fy, R + soft * 0.2);
    rg.addColorStop(0, 'rgba(255,236,205,0)');
    rg.addColorStop(0.75, `rgba(255,236,205,${(0.16 * Math.sin(Math.PI * k)).toFixed(3)})`);
    rg.addColorStop(1, 'rgba(255,236,205,0)');
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
  }
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
      const tmp = document.createElement('canvas');
      tmp.width = canvas.width;
      tmp.height = canvas.height;
      const tx = tmp.getContext('2d')!;
      const frame = (now: number) => {
        if (!t0) {
          t0 = now;
          wrap.setAttribute('data-state', 'play'); // 첫 장면부터 캔버스로
        }
        const k = Math.min(1, (now - t0) / MS);
        drawResolve(ctx, tx, lv, 1 - Math.pow(1 - k, 1.6)); // 끝은 천천히 맺힌다
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
