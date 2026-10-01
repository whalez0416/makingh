'use client';

import Image from 'next/image';
import {useEffect, useRef} from 'react';

// 서브 페이지 히어로 사진 — 들어오면 낮은 해상도에서 원본 해상도로 또렷해진다 (2026-10-01, "내 피부의 해상도를 높이다").
// 시안: reference/old-site/concept/template4.html (아티팩트 3trM29GvvHfWVvzhV4ouyh) 의 저해상도 셰이더를 시간 재생으로.
// - 처음 그림은 흐리게(CSS) 두었다가, 캔버스가 첫 장면을 그리면 캔버스로 넘기고, 끝나면 원래 사진으로 돌아온다.
// - WebGL 이 없거나 동작 줄이기면 그냥 사진. JS 가 멈춰도 3초 뒤 CSS 가 흐림을 푼다(globals.css .resolve).

const FS = `precision highp float;varying vec2 v;uniform sampler2D t;uniform vec2 res,cover,focus;uniform float lv,tone;
vec2 Q(vec2 uv){return (uv-.5)*cover+.5+(1.-cover)*(focus-.5);}
vec3 blk(vec2 id,float s){vec2 c=(id+.5)*s;vec3 a=vec3(0.);for(int i=-1;i<=1;i++)for(int j=-1;j<=1;j++){a+=texture2D(t,Q((c+vec2(float(i),float(j))*s*.33)/res)).rgb;}return a/9.;}
vec3 low(float s){
  vec2 px=v*res; vec2 g=px/s-.5; vec2 i=floor(g); vec2 f=fract(g); f=f*f*(3.-2.*f);
  vec3 bil=mix(mix(blk(i,s),blk(i+vec2(1.,0.),s),f.x),mix(blk(i+vec2(0.,1.),s),blk(i+vec2(1.,1.),s),f.x),f.y);
  return mix(blk(floor(px/s),s),bil,.7);
}
void main(){
  float e0=ceil(lv), e1=floor(lv), f=e0==e1?0.:smoothstep(.15,.85,fract(lv));
  vec3 col=mix(low(exp2(e0)),low(exp2(e1)),f);
  col=mix(col,texture2D(t,Q(v)).rgb,smoothstep(1.6,.2,lv));
  float l=dot(col,vec3(.3,.59,.11));
  col=mix(vec3(l),col,mix(.5,1.,tone));
  gl_FragColor=vec4(col,1.);
}`;

const MAXLV = 6; // 시작 픽셀 = 64px
const MS = 1900;

// "60% center" · "center" · "30% 40%" → 0..1
const pos = (s: string) => {
  const [x = 'center', y = 'center'] = s.split(/\s+/);
  const n = (k: string) => (k.endsWith('%') ? parseFloat(k) / 100 : k === 'left' || k === 'top' ? 0 : k === 'right' || k === 'bottom' ? 1 : 0.5);
  return [n(x), n(y)] as const;
};

export default function ResolveImage({src, sizes, imgPos = 'center', priority = true}: {src: string; sizes: string; imgPos?: string; priority?: boolean}) {
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = box.current!, canvas = cv.current!;
    const done = () => wrap.setAttribute('data-state', 'done');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return done();
    const gl = canvas.getContext('webgl', {antialias: false});
    if (!gl) return done();
    const sh = (type: number, code: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, code);
      gl.compileShader(s);
      return s;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}'));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return done();
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = Object.fromEntries(['res', 'cover', 'focus', 'lv', 'tone'].map((n) => [n, gl.getUniformLocation(pr, n)]));
    const [fx, fy] = pos(imgPos);

    let raf = 0, t0 = 0;
    const im = new window.Image();
    im.onload = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      for (const [k, val] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]])
        gl.texParameteri(gl.TEXTURE_2D, k, val);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      const fa = canvas.width / canvas.height, ia = im.width / im.height;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform2f(u.cover, fa > ia ? 1 : fa / ia, fa > ia ? ia / fa : 1);
      gl.uniform2f(u.focus, fx, fy);
      const frame = (now: number) => {
        if (!t0) {
          t0 = now;
          wrap.setAttribute('data-state', 'play'); // 첫 장면부터 캔버스로
        }
        const k = Math.min(1, (now - t0) / MS);
        const e = 1 - Math.pow(1 - k, 2.2); // 처음엔 빨리, 끝은 천천히 맺힌다
        gl.uniform1f(u.lv, Math.max(0, MAXLV * (1 - e)) + Math.log2(dpr) * (1 - e));
        gl.uniform1f(u.tone, e);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
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
