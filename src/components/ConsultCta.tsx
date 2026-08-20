import {site} from '@/lib/site';

// 예약은 Phase 5 전까지 카카오톡 채널로 보낸다 (브리프 §4 서브페이지).
export default function ConsultCta({
  label,
  variant = 'solid'
}: {
  label: string;
  variant?: 'solid' | 'underline';
}) {
  if (variant === 'underline') {
    return (
      <a
        href={site.kakao}
        target="_blank"
        rel="noreferrer"
        className="text-ink group inline-block"
      >
        <span className="text-[16px] lg:text-[22px]">{label}</span>
        <span className="border-ink mt-2 flex w-[140px] items-center justify-end border-b pb-1 lg:w-[200px]">
          <span aria-hidden className="text-ink -mb-2 text-[16px] leading-none">
            ➞
          </span>
        </span>
      </a>
    );
  }

  return (
    <a
      href={site.kakao}
      target="_blank"
      rel="noreferrer"
      className="bg-ink hover:bg-accent inline-flex h-12 items-center rounded-[8px] px-7 text-[15px] text-white transition-colors"
    >
      {label}
    </a>
  );
}
