export default function SectionHeader({
  eyebrow,
  title,
  sub,
  action
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 md:mb-12">
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <div className="flex items-end justify-between gap-8">
        <h2 className="display text-ink text-[clamp(26px,3.2vw,40px)]">{title}</h2>
        {/* 뷰웰 패턴: 데스크톱은 헤더 우측, 모바일은 섹션 하단 중앙 */}
        {action && <div className="hidden shrink-0 pb-1 md:block">{action}</div>}
      </div>
      {sub && <p className="text-sub mt-4 text-[15px]">{sub}</p>}
    </div>
  );
}
