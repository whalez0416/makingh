import manifest from './img-manifest.json';

// next/image 사용자 정의 로더 (2026-10-07) — scripts/img-variants.mjs 가 만든 폭별 WebP 중 요청 폭 이상인 가장 작은 것.
// 목록에 없는 주소(관리자 업로드 /api/media/… 등)는 그대로 돌려준다.
const m = manifest as Record<string, {v: string; w: number[]}>;

export function variant(src: string, width: number) {
  const [, prefix = '', key = ''] = src.match(/^(\/makingh)?\/(.+)$/) ?? [];
  const e = m[key];
  if (!e) return src;
  const w = e.w.find((x) => x >= width) ?? e.w.at(-1);
  return `${prefix}/_v/${key.replace(/\.\w+$/, '')}.${e.v}.${w}.webp`;
}

// next/image 가 부르는 기본 내보내기 (quality 는 미리 만든 파일이라 안 쓴다)
export default function loader({src, width}: {src: string; width: number}) {
  return variant(src, width);
}

// 일반 <img> 용 srcset (캔버스 히어로 첫 장면)
export function srcSet(src: string) {
  const e = m[src.replace(/^(\/makingh)?\//, '')];
  return e ? e.w.map((w) => `${variant(src, w)} ${w}w`).join(', ') : undefined;
}
