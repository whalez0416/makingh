import Reveal from '@/components/Reveal';

// Diagnosis 섹션 헤더와 같은 문법 (eyebrow + h2 + 우측 액션). Phase 3 섹션들이 공유한다.
export default function SectionHeader({
  eyebrow,
  title,
  right
}: {
  eyebrow: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <Reveal className="mb-10 lg:mb-[60px]">
      <p className="eyebrow mb-1 lg:mb-2.5">{eyebrow}</p>
      <div className="flex items-end justify-between gap-8">
        <h2 className="h2 text-ink whitespace-pre-line">{title}</h2>
        {right && <div className="hidden shrink-0 pb-2 lg:block">{right}</div>}
      </div>
    </Reveal>
  );
}
