// 〃 — 브랜드 모티프. 크기·투명도만 받는다.
export default function DittoMark({className = ''}: {className?: string}) {
  return (
    <span aria-hidden className={`font-roman leading-none select-none ${className}`}>
      〃
    </span>
  );
}
