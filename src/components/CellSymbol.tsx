// 겹친 두 원 — 복제 직후의 동일한 두 세포.
export default function CellSymbol({
  className = '',
  filled = false
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg viewBox="0 0 120 72" aria-hidden className={className} fill="none">
      <circle
        cx="44"
        cy="36"
        r="34"
        stroke="currentColor"
        strokeWidth="1.2"
        fill={filled ? 'var(--color-surface)' : 'none'}
      />
      <circle cx="76" cy="36" r="34" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
