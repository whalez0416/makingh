import {Link} from '@/i18n/navigation';

// 번호 인덱스 리스트 한 줄 (브리프 §4-5). href 가 있으면 링크(메인 프리뷰 → /signature),
// 없으면 일반 행(/signature 목록 자체).
export default function PackageRow({
  no,
  name,
  tagline,
  desc,
  href
}: {
  no: number;
  name: string;
  tagline: string;
  desc?: string;
  href?: '/signature';
}) {
  const inner = (
    <>
      <span className="text-accent w-7 shrink-0 text-[14px] font-bold lg:w-10 lg:text-[18px]">
        {String(no).padStart(2, '0')}
      </span>
      <span className="min-w-0 flex-1">
        <span className="card-title text-ink block">{name}</span>
        <span className="text-sub mt-1 block text-[13px] lg:text-[15px]">{tagline}</span>
        {desc && (
          <span className="text-sub mt-2 block text-[13px] leading-relaxed lg:text-[15px]">
            {desc}
          </span>
        )}
      </span>
    </>
  );
  const cls = 'border-line flex items-baseline gap-4 border-b py-5 lg:gap-8 lg:py-7';

  if (!href) {
    return <div className={cls}>{inner}</div>;
  }
  return (
    <Link href={href} className={`group ${cls}`}>
      {inner}
      <span
        aria-hidden
        className="text-sub group-hover:text-accent shrink-0 transition-colors"
      >
        ➞
      </span>
    </Link>
  );
}
