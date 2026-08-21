import Reveal from '@/components/Reveal';

// 서브 페이지 히어로 밴드 (뷰웰 상세 1번 패턴 — docs/beauwell-analysis.md 서브 실측).
// 투명 헤더의 가독성 때문에 풀블리드 대신 메인 히어로 카드와 같은 라운딩 카드로,
// 헤더 아래에서 시작한다. 라이트 톤 메인과 페이지 문법이 구분된다.
export default function PageHero({
  title,
  desc,
  en
}: {
  title: string;
  desc?: string;
  en?: string;
}) {
  return (
    <div className="px-5 pt-[76px] lg:px-10 lg:pt-[110px]">
      <Reveal>
        <div className="flex min-h-[240px] flex-col justify-between gap-6 rounded-[20px] bg-[linear-gradient(135deg,var(--color-ink)_30%,var(--color-accent)_140%)] p-6 lg:min-h-[360px] lg:flex-row lg:items-end lg:rounded-[30px] lg:p-12">
          <div>
            {en && (
              <p className="text-accent text-[13px] font-bold tracking-[0.18em] uppercase lg:text-[15px]">
                {en}
              </p>
            )}
            <h1 className="h1 mt-2 text-white">{title}</h1>
          </div>
          {desc && (
            <p className="max-w-[420px] shrink-0 text-[14px] leading-relaxed text-white/85 lg:pb-2 lg:text-[16px]">
              {desc}
            </p>
          )}
        </div>
      </Reveal>
    </div>
  );
}
