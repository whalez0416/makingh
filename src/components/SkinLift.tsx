'use client';

import {useEffect, useRef} from 'react';

// 메인 히어로 3번째 장면 — 피부가 손끝(마우스·손가락)을 따라 탄력 있게 당겨진다 (2026-10-01).
// 시안: docs/design/hero-skin-lift-motion.html (아티팩트 EkPsQqpiFoyhYdqPyNiPFq) 의 "피부 당김" 셰이더를 그대로 옮겼다.
// - 장면이 켜질 때 2.4초 동안 한 번 위로 당겨지고(마우스를 안 쓰는 사람도 보게), 그 뒤엔 숨 쉬듯 아주 조금.
// - 커서 주변 피부를 커서 쪽으로 모으고, 움직인 방향으로 끌고 간다. 떠나면 스프링처럼 튕기며 제자리.
// - 장면이 꺼져 있거나 화면 밖이면 그리지 않는다. WebGL 이 없거나 동작 줄이기면 아래 정지 사진만 보인다.
// 사진: public/hero/skin.jpg — 시그니처 모델 원본(3766px)에서 뺨·턱선·목만 잘라낸 것.

const VS = 'attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}';
const FS = `precision highp float;varying vec2 v;uniform sampler2D t;uniform float lift;uniform float amp;uniform vec2 res;uniform vec2 cover;
uniform vec2 mouse;uniform vec2 vel;uniform float pull;
void main(){
  vec2 asp=vec2(res.x/res.y,1.);
  vec2 q=(v-.5)*cover+.5;
  q=.5+(q-.5)*.94;
  vec2 s=q; float glow=0.;
  vec2 A=vec2(.78,.08);
  vec2 dv=(q-A)*asp; float dist=length(dv);
  float w=smoothstep(.05,.7,dist)*(1.-smoothstep(1.1,1.7,dist));
  s+=normalize(dv+1e-5)/asp*lift*amp*w*1.6;
  glow+=.05*lift*w*(1.-smoothstep(.3,.9,dist));
  vec2 M=(mouse-.5)*cover*.94+.5;
  vec2 dm=(q-M)*asp; float r=length(dm);
  float R=.34; float f=pow(max(0.,1.-r/R),2.);
  s+=(q-M)*f*pull*amp*9.;
  s-=vel*f*pull*2.6;
  glow+=.07*pull*f;
  vec4 c=texture2D(t,clamp(s,0.,1.));
  c.rgb*=1.+glow;
  c.rgb*=1.-.035*pull*smoothstep(.0,.25,f)*(1.-f);
  gl_FragColor=c;
}`;
const AMP = 0.034; // 시안의 "중"

function easeLift(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const c1 = 0.9, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export default function SkinLift({src, active}: {src: string; active: boolean}) {
  const cv = useRef<HTMLCanvasElement>(null);
  const on = useRef(active);
  const startAt = useRef(0);

  // 장면이 켜질 때마다 리프트를 처음부터
  useEffect(() => {
    on.current = active;
    if (active) startAt.current = performance.now();
  }, [active]);

  useEffect(() => {
    const canvas = cv.current;
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const gl = canvas.getContext('webgl', {premultipliedAlpha: false, antialias: false});
    if (!gl) return;

    const sh = (type: number, code: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, code);
      gl.compileShader(s);
      return s;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = Object.fromEntries(['lift', 'amp', 'res', 'cover', 'mouse', 'vel', 'pull'].map((n) => [n, gl.getUniformLocation(pr, n)]));

    let img: HTMLImageElement | null = null;
    const tex = gl.createTexture();
    const im = new Image();
    im.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]])
        gl.texParameteri(gl.TEXTURE_2D, k, v);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
      img = im;
      canvas.style.opacity = '1'; // 준비되면 정지 사진 위로 올라온다
    };
    im.src = src;

    const size = () => {
      const r = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };
    size();
    window.addEventListener('resize', size);

    // 커서: 목표점 T 를 스프링으로 따라가는 P (탄력 있게 늦게 따라오고, 떠나면 튕기며 복귀)
    const T = {x: 0.55, y: 0.45}, P = {x: 0.55, y: 0.45}, V = {x: 0, y: 0}, V2 = {x: 0, y: 0};
    let hover = 0, hoverT = 0, hoverV = 0;
    // 글·버튼이 캔버스를 덮고 있어 캔버스가 아니라 창 전체에서 위치를 읽고, 캔버스 안일 때만 당긴다
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      if (inside) {
        T.x = x;
        T.y = y;
      }
      hoverT = inside && on.current ? 1 : 0;
    };
    const leave = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') hoverT = 0;
    };
    window.addEventListener('pointermove', move, {passive: true});
    window.addEventListener('pointerdown', move, {passive: true});
    window.addEventListener('pointerup', leave, {passive: true});
    document.addEventListener('pointerleave', () => (hoverT = 0));

    let visible = true;
    const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting));
    io.observe(canvas);

    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!img || !visible || !on.current) return; // 꺼진 장면·화면 밖은 그리지 않는다
      const px = P.x, py = P.y;
      V.x = (V.x + (T.x - P.x) * 0.09) * 0.8;
      V.y = (V.y + (T.y - P.y) * 0.09) * 0.8;
      P.x += V.x;
      P.y += V.y;
      V2.x = V2.x * 0.7 + (P.x - px) * 0.3;
      V2.y = V2.y * 0.7 + (P.y - py) * 0.3;
      hoverV = (hoverV + (hoverT - hover) * 0.07) * 0.82;
      hover += hoverV;

      const t = (now - startAt.current - 400) / 2400;
      const lift = easeLift(t) + (t > 1 ? 0.08 * Math.sin(((now - startAt.current - 2800) / 7000) * 6.283) : 0);
      const fa = canvas.width / canvas.height, ia = img.width / img.height;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(u.lift, lift);
      gl.uniform1f(u.amp, AMP);
      gl.uniform2f(u.mouse, P.x, P.y);
      gl.uniform2f(u.vel, V2.x, V2.y);
      gl.uniform1f(u.pull, Math.max(0, hover));
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform2f(u.cover, fa > ia ? 1 : fa / ia, fa > ia ? ia / fa : 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', size);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', move);
      window.removeEventListener('pointerup', leave);
    };
  }, [src]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- 셰이더가 쓰는 같은 파일을 정지 화면으로. 셰이더의 가장자리 여유(×0.94)만큼 키워 바뀔 때 튀지 않게 */}
      <img src={src} alt="" className="absolute inset-0 h-full w-full scale-[1.064] object-cover" />
      <canvas ref={cv} aria-hidden className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500" />
    </>
  );
}
