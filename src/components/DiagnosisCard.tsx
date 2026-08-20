import {Link} from '@/i18n/navigation';
import DittoMark from '@/components/DittoMark';

// 뷰웰 자가진단의 말풍선 구조를 가져왔다 (docs/beauwell-analysis.md §3):
// [분류 라벨] + [환자 고민 문장] + 우상단 따옴표, 꼬리는 좌·우 교차.
// 따옴표 자리에는 〃 를 쓴다 — 브랜드 모티프가 곧 따옴표다.
// 답(치료명)은 브리프 §4-4 가 요구하는 연결이라 하단에 남긴다.
export default function DiagnosisCard({
  category,
  question,
  answer,
  href,
  tail,
  size,
  solid = false
}: {
  category: string;
  question: string;
  answer: string;
  href: string;
  tail: 'l' | 'r';
  size: 1 | 2 | 3;
  solid?: boolean;
}) {
  const minH = {1: 'md:min-h-[172px]', 2: 'md:min-h-[214px]', 3: 'md:min-h-[268px]'}[size];

  return (
    <Link
      href={href}
      className={`bubble bubble-${tail} rounded-card group relative flex flex-col p-6 ${minH} ${
        solid
          ? 'bubble-solid bg-ink text-white'
          : 'border-line bg-surface hover:border-accent border transition-colors'
      }`}
    >
      <DittoMark
        className={`pointer-events-none absolute top-3 right-4 text-[46px] ${
          solid ? 'text-white/25' : 'text-accent/25'
        }`}
      />
      <p className={`cat-label mb-3 ${solid ? '!text-white/70' : ''}`}>{category}</p>
      <p className={`text-[17px] leading-relaxed ${solid ? 'text-white' : 'text-ink'}`}>
        {question}
      </p>
      <p
        className={`mt-auto flex items-center gap-2 pt-6 text-[14px] transition-colors ${
          solid ? 'text-white/80 group-hover:text-white' : 'text-accent group-hover:text-ink'
        }`}
      >
        {answer}
        <span aria-hidden>→</span>
      </p>
    </Link>
  );
}
