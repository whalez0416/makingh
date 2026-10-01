import {getSettings} from '@/lib/settings';
import BtnLabel from '@/components/BtnLabel';

// 예약은 Phase 5 전까지 카카오톡 채널로 보낸다 (브리프 §4 서브페이지).
export default async function ConsultCta({
  label,
  variant = 'solid'
}: {
  label: string;
  variant?: 'solid' | 'underline' | 'light'; // light = 다크 배너 위용
}) {
  const s = await getSettings();

  if (variant === 'light') {
    return (
      <a
        href={s.kakao}
        target="_blank"
        rel="noreferrer"
        className="btn-fx text-ink inline-flex h-12 items-center rounded-[8px] bg-white px-7 text-[15px] font-bold hover:text-white"
      >
        <BtnLabel>{label}</BtnLabel>
      </a>
    );
  }
  if (variant === 'underline') {
    return (
      <a
        href={s.kakao}
        target="_blank"
        rel="noreferrer"
        className="text-ink group inline-block"
      >
        <span className="text-[16px] lg:text-[22px]">{label}</span>
        {/* 밑줄 드로잉: hover 시 선이 왼→오로 다시 그어진다 (globals.css .draw-line) */}
        <span className="relative mt-2 flex w-[140px] items-center justify-end pb-1 lg:w-[200px]">
          <span aria-hidden className="draw-line bg-ink absolute inset-x-0 bottom-0 h-px" />
          <span aria-hidden className="text-ink -mb-2 text-[16px] leading-none">
            ➞
          </span>
        </span>
      </a>
    );
  }

  return (
    <a
      href={s.kakao}
      target="_blank"
      rel="noreferrer"
      className="btn-fx bg-ink text-bg inline-flex h-12 items-center rounded-[8px] px-7 text-[15px]"
    >
      <BtnLabel>{label}</BtnLabel>
    </a>
  );
}
