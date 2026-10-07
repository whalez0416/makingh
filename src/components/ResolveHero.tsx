"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { srcSet } from "@/lib/img-loader";

// 메인 히어로 "내 피부의 해상도를 높이다" (2026-10-01, 시안 아티팩트 3trM29GvvHfWVvzhV4ouyh).
// 스크롤하는 동안 화면이 멈춰 있고, 흐릿한 저해상도 피부가 입술·뺨 한 점부터 선명해져 원본 해상도까지 맺힌다.
// - 그리기: 사진을 반씩 줄인 사본(1/2 … 1/64)을 처음 한 번만 만들고, 매 프레임엔 이웃 두 장을 늘려 겹친다(drawImage 몇 번).
//   선명한 사진은 둥근 그라데이션 마스크로 번져 나가고, 경계에 옅은 빛. 스크롤이 멈추면 다시 그리지 않는다.
// - 제목은 한 글자씩 차례로 초점이 맞고, 아래 한 줄은 구간마다 바뀐다. 오른쪽 아래는 지금 해상도(가로 × 세로).
// - 동작 줄이기면 처음부터 선명한 사진(구간 높이도 한 화면, globals.css .resolve-hero).

const LEVELS = 6;
const sm = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};
const ease = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
type Rect = [number, number, number, number];

// 제목 문자열: 줄바꿈 \n, 강조 [ ] — 글자마다 span 으로 (낱말은 묶어 줄바꿈은 낱말 사이에서만)
function Title({ text }: { text: string }) {
  let em = false;
  return (
    <>
      {text.split("\n").map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((w, wi) => (
            <span key={wi}>
              {wi > 0 && " "}
              <span className="whitespace-nowrap">
                {[...w].map((ch, ci) => {
                  if (ch === "[" || ch === "]") {
                    em = ch === "[";
                    return null;
                  }
                  return (
                    <span key={ci} className={`ch${em ? " em" : ""}`}>
                      {ch}
                    </span>
                  );
                })}
              </span>
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

export default function ResolveHero({
  src,
  eyebrow,
  title,
  lines,
  children,
}: {
  src: string;
  eyebrow: string;
  title: string;
  lines: string[];
  children?: ReactNode; // 상담 버튼
}) {
  const sec = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const head = useRef<HTMLHeadingElement>(null);
  const lineBox = useRef<HTMLDivElement>(null);
  const ctas = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLElement>(null);
  const bar = useRef<HTMLElement>(null);
  const grain = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sec.current!,
      canvas = cv.current!,
      ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const tmp = document.createElement("canvas"),
      tx = tmp.getContext("2d")!;
    const chars = [...head.current!.querySelectorAll<HTMLElement>(".ch")];
    const lineEls = [...lineBox.current!.children] as HTMLElement[];
    let lv: HTMLCanvasElement[] = [];
    let raf = 0,
      p = 0,
      dirty = true,
      step = -1,
      ready = false;
    const im = new window.Image();

    const mk = (w: number, h: number) => {
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(w));
      c.height = Math.max(1, Math.round(h));
      return c;
    };
    const pyramid = () => {
      const W = canvas.width,
        H = canvas.height;
      const fx = W > H ? 0.5 : 0.02; // 세로 화면에선 입술·턱선이 들어오게 왼쪽으로
      const base = mk(W, H),
        fa = W / H,
        ia = im.width / im.height;
      const sw = fa > ia ? im.width : im.height * fa,
        sh = fa > ia ? im.width / fa : im.height;
      const bx = base.getContext("2d")!;
      bx.imageSmoothingQuality = "high";
      bx.drawImage(
        im,
        (im.width - sw) * fx,
        (im.height - sh) * 0.5,
        sw,
        sh,
        0,
        0,
        W,
        H,
      );
      lv = [base];
      for (let k = 1; k <= LEVELS; k++) {
        const pv = lv[k - 1],
          c = mk(pv.width / 2, pv.height / 2),
          x = c.getContext("2d")!;
        x.imageSmoothingQuality = "high";
        if (k >= 3) x.filter = "blur(.6px)"; // 아주 작은 사본은 살짝 풀어 확대했을 때 네모가 안 보이게
        x.drawImage(pv, 0, 0, c.width, c.height);
        lv.push(c);
      }
      tmp.width = W;
      tmp.height = H;
    };
    const layer = (c: CanvasRenderingContext2D, l: number, r: Rect) => {
      const e0 = Math.ceil(l),
        e1 = Math.floor(l),
        t = Math.min(1, Math.max(0, (l - e1 - 0.1) / 0.8));
      c.imageSmoothingEnabled = true;
      c.globalAlpha = 1;
      c.drawImage(lv[e0], ...r);
      if (e0 !== e1) {
        c.globalAlpha = 1 - t * t * (3 - 2 * t);
        c.drawImage(lv[e1], ...r);
      }
      c.globalAlpha = 1;
    };
    const draw = (k: number) => {
      const W = canvas.width,
        H = canvas.height,
        port = W < H;
      const fx = W * (port ? 0.55 : 0.3),
        fy = H * (port ? 0.28 : 0.36); // 선명함이 시작되는 곳: 입술·뺨
      const sc = 1 + 0.07 * (1 - ease(k)); // 초점이 맞으며 제자리로
      const r: Rect = [fx - fx * sc, fy - fy * sc, W * sc, H * sc];
      layer(ctx, LEVELS * Math.pow(1 - k, 0.75), r);
      if (k <= 0) return;
      const R = Math.hypot(W, H) * 1.25 * ease(k),
        soft = Math.max(W, H) * 0.22;
      tx.globalCompositeOperation = "source-over";
      tx.clearRect(0, 0, W, H);
      layer(tx, LEVELS * Math.pow(1 - k, 2.4), r);
      const g = tx.createRadialGradient(
        fx,
        fy,
        Math.max(0, R - soft),
        fx,
        fy,
        R + 1,
      );
      g.addColorStop(0, "#000");
      g.addColorStop(1, "rgba(0,0,0,0)");
      tx.globalCompositeOperation = "destination-in";
      tx.fillStyle = g;
      tx.fillRect(0, 0, W, H);
      ctx.drawImage(tmp, 0, 0);
      if (k < 1) {
        const rg = ctx.createRadialGradient(
          fx,
          fy,
          Math.max(0, R - soft * 0.9),
          fx,
          fy,
          R + soft * 0.2,
        );
        rg.addColorStop(0, "rgba(255,236,205,0)");
        rg.addColorStop(
          0.75,
          `rgba(255,236,205,${(0.16 * Math.sin(Math.PI * k)).toFixed(3)})`,
        );
        rg.addColorStop(1, "rgba(255,236,205,0)");
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
      }
    };
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      if (ready) pyramid();
      dirty = true;
    };
    const q = (x: number) => Math.round(x * 20) / 20; // 필터는 5% 단계로만 바꿔 다시 그리는 횟수를 줄인다

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const r = section.getBoundingClientRect();
      const target = reduce
        ? 1
        : Math.min(
            1,
            Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)),
          );
      if (!dirty && Math.abs(target - p) < 0.0004) return; // 멈춰 있으면 안 그림
      if (r.bottom < 0) return; // 지나간 뒤엔 그리지 않음
      dirty = false;
      p += (target - p) * (reduce ? 1 : 0.085);
      const k = sm(0.06, 0.82, p),
        tone = sm(0.04, 0.8, p),
        clar = sm(0.82, 0.96, p);
      draw(k);
      const fl = `saturate(${q(0.55 + 0.45 * tone)}) brightness(${q(0.92 + 0.08 * tone)}) contrast(${q(1 + 0.05 * clar)})`;
      if (canvas.style.filter !== fl) canvas.style.filter = fl;
      grain.current!.style.opacity = (0.12 * (1 - sm(0.55, 0.85, p))).toFixed(
        3,
      );
      const n = chars.length;
      chars.forEach((c, i) => {
        const a = sm(0.04 + (i / n) * 0.5, 0.3 + (i / n) * 0.5, p);
        const b = Math.round((1 - a) * 12) / 2;
        const key = `${b}|${Math.round(a * 20)}`;
        if (c.dataset.k === key) return;
        c.dataset.k = key;
        c.style.filter = b ? `blur(${b}px)` : "none";
        c.style.opacity = (0.2 + 0.8 * a).toFixed(2);
        c.style.transform = `translateY(${((1 - a) * 0.18).toFixed(3)}em)`;
      });
      const st = p < 0.15 ? 0 : p < 0.5 ? 1 : p < 0.8 ? 2 : 3;
      if (st !== step) {
        step = st;
        lineEls.forEach((l, i) => l.classList.toggle("on", i === st));
        ctas.current!.classList.toggle("on", st === 3);
      }
      const s = Math.pow(2, LEVELS * Math.pow(1 - k, 1.4));
      count.current!.textContent =
        k > 0.97
          ? "Full"
          : `${Math.round(canvas.clientWidth / s).toLocaleString("en-US")} × ${Math.round(canvas.clientHeight / s).toLocaleString("en-US")}`;
      bar.current!.style.width = `${(p * 100).toFixed(1)}%`;
    };

    const onLoad = () => {
      ready = true;
      size();
      section.setAttribute("data-ready", "");
      raf = requestAnimationFrame(frame);
    };
    im.onload = onLoad;
    // 첫 장면 <img> 가 화면 크기에 맞춰 고른 WebP 를 그대로 (같은 파일이라 다시 안 받는다)
    im.src = section.querySelector<HTMLImageElement>(".rh-poster")?.currentSrc || src;
    if (im.complete && im.naturalWidth) onLoad();
    window.addEventListener("resize", size);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, [src]);

  return (
    <section ref={sec} id="home-hero" className="resolve-hero relative">
      <div className="sticky top-0 h-svh overflow-hidden bg-[#120f0b] text-white">
        {/* 캔버스가 준비되기 전·JS 없을 때: 흐린 사진 (globals.css 가 3초 뒤 풀어 줌) */}
        {/* eslint-disable-next-line @next/next/no-img-element -- 캔버스가 쓰는 같은 파일을 첫 장면으로 */}
        <img
          src={src}
          srcSet={srcSet(src)}
          sizes="max(100vw, 156svh)" /* 가로 사진(2400×1542)을 세로 화면에 꽉 채우면 높이 기준 폭이 필요 */
          alt=""
          className="rh-poster absolute inset-0 h-full w-full object-cover"
        />
        <canvas
          ref={cv}
          aria-hidden
          className="rh-canvas absolute inset-0 h-full w-full"
        />
        <div
          ref={grain}
          className="rh-grain pointer-events-none absolute inset-0"
        />
        <div className="rh-shade pointer-events-none absolute inset-0" />
        <div className="absolute inset-x-5 bottom-[92px] z-10 grid max-w-[640px] gap-3 lg:inset-x-16 lg:bottom-[11vh] lg:gap-[18px]">
          <p className="ed-italic text-[18px] text-[#E8D3A6] lg:text-[24px]">
            {eyebrow}
          </p>
          <h1
            ref={head}
            className="rh-title ed-serif text-[34px] leading-[1.22] tracking-[-0.02em] lg:text-[clamp(40px,5.2vw,72px)]"
          >
            <Title text={title} />
          </h1>
          <div
            ref={lineBox}
            className="rh-lines relative h-[1.7em] text-[14px] text-white/85 lg:text-[17px]"
          >
            {lines.map((l, i) => (
              <p key={i} className={i === 0 ? "on" : undefined}>
                {l}
              </p>
            ))}
          </div>
          <div ref={ctas} className="rh-cta">
            {children}
          </div>
        </div>
        <div className="absolute top-[74px] right-5 z-10 grid justify-items-end gap-2 text-[11px] tracking-[0.14em] text-white/70 tabular-nums lg:top-auto lg:right-[112px] lg:bottom-[11vh]">
          <span>RESOLUTION</span>
          <b
            ref={count}
            className="ed-italic text-[20px] font-medium tracking-normal text-white lg:text-[26px]"
          >
            —
          </b>
          <span className="relative block h-px w-[140px] bg-white/25">
            <i
              ref={bar}
              className="absolute inset-y-0 left-0 w-0 bg-[#E8D3A6]"
            />
          </span>
        </div>
      </div>
    </section>
  );
}
