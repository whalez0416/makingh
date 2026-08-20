import {Link} from '@/i18n/navigation';

// 말풍선 구조는 beauwell.kr 실측 (docs/beauwell-analysis.md §3):
// [분류 라벨] + [고민 문장] + 우상단 따옴표, 꼬리쪽 모서리만 각지게.
// 답(치료명)은 브리프 §4-4 가 요구하는 연결이라 하단에 남긴다.
// accent 솔리드는 쓰지 않는다 — 세 테마의 accent 명도가 달라 흰 글씨 대비가 한쪽에서 무너진다.
const TONE = {
  ink: 'bg-ink text-white [--bubble-bg:var(--color-ink)]',
  surface: 'bg-surface border-line border [--bubble-bg:var(--color-surface)]'
} as const;

export default function DiagnosisCard({
  category,
  question,
  answer,
  href,
  tail,
  tone
}: {
  category: string;
  question: string;
  answer: string;
  href: string;
  tail: 'l' | 'r';
  tone: keyof typeof TONE;
}) {
  const dark = tone !== 'surface';

  return (
    <Link
      href={href}
      className={`bubble bubble-${tail} ${TONE[tone]} group flex h-full flex-col`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute top-4 right-4 text-[34px] leading-none lg:top-5 lg:right-6 lg:text-[46px] ${
          dark ? 'text-white/25' : 'text-accent/30'
        }`}
      >
        &rdquo;
      </span>

      <p
        className={`text-[15px] font-bold lg:text-[18px] ${
          dark ? 'text-white/75' : 'text-accent'
        }`}
      >
        {category}
      </p>
      <p className={`q-text mt-1 ${dark ? 'text-white' : 'text-ink'}`}>{question}</p>

      <p
        className={`mt-auto flex items-center gap-1.5 pt-5 text-[13px] transition-opacity lg:text-[15px] ${
          dark ? 'text-white/80 group-hover:text-white' : 'text-sub group-hover:text-ink'
        }`}
      >
        {answer}
        <span aria-hidden>→</span>
      </p>
    </Link>
  );
}
