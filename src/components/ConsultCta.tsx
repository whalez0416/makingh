import {site} from '@/lib/site';

// 예약은 Phase 5 전까지 카카오톡 채널로 보낸다 (브리프 §4 서브페이지).
export default function ConsultCta({
  label,
  variant = 'solid'
}: {
  label: string;
  variant?: 'solid' | 'underline';
}) {
  const cls =
    variant === 'solid'
      ? 'bg-ink rounded-btn hover:bg-accent px-8 py-4 text-[15px] text-white transition-colors'
      : 'text-ink hover:text-accent border-b border-current pb-1 text-[15px] transition-colors';

  return (
    <a href={site.kakao} target="_blank" rel="noreferrer" className={cls}>
      {label}
    </a>
  );
}
