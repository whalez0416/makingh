import {useTranslations} from 'next-intl';

// 브리프 §4-10 시설 갤러리 마퀴 — 저속으로 흐르는 이미지 띠.
// 사진 수급 전이라 그라데이션 타일 + 시설명. 애니메이션은 globals.css .marquee.
export default function GalleryMarquee() {
  const t = useTranslations('gallery');
  const tiles = t.raw('tiles') as string[];
  const doubled = [...tiles, ...tiles]; // 끊김 없는 루프용 복제

  return (
    <section className="overflow-hidden py-24 lg:py-[160px]" aria-label={t('label')}>
      <div className="marquee flex w-max gap-4 lg:gap-6">
        {doubled.map((name, i) => (
          <figure
            key={`${name}-${i}`}
            aria-hidden={i >= tiles.length}
            className="relative h-[220px] w-[300px] shrink-0 overflow-hidden rounded-[16px] bg-[linear-gradient(145deg,var(--color-line),var(--color-accent)_80%)] lg:h-[320px] lg:w-[440px] lg:rounded-[20px]"
          >
            <figcaption className="absolute bottom-4 left-5 text-[13px] font-bold text-white/90 lg:bottom-6 lg:left-7 lg:text-[15px]">
              {name}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
