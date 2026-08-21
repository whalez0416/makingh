import Reveal from '@/components/Reveal';

// 서브 페이지 공통 타이틀 블록. 고정 헤더 높이만큼 상단 패딩을 갖는다.
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
    <div className="px-5 pt-[100px] pb-10 lg:px-10 lg:pt-[170px] lg:pb-[60px]">
      <Reveal>
        {en && (
          <p className="text-accent text-[13px] font-bold tracking-[0.18em] uppercase lg:text-[15px]">
            {en}
          </p>
        )}
        <h1 className="h1 text-ink mt-2">{title}</h1>
        {desc && (
          <p className="text-sub mt-3 max-w-[640px] text-[14px] leading-relaxed lg:mt-5 lg:text-[17px]">
            {desc}
          </p>
        )}
      </Reveal>
    </div>
  );
}
