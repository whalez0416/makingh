export default function SectionHeader({
  eyebrow,
  title,
  sub
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-10 md:mb-12">
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="display text-ink text-[clamp(26px,3.2vw,40px)]">{title}</h2>
      {sub && <p className="text-sub mt-4 text-[15px]">{sub}</p>}
    </div>
  );
}
