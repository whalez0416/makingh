import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {assetBase} from '@/lib/site';

// 브리프 §4-10 시설 갤러리 마퀴 — 저속으로 흐르는 이미지 띠. 애니메이션은 globals.css .marquee.
// 병원 사진 수급 전 임시 스톡 — public/facility/ 파일만 교체하면 된다. 순서는 messages tiles 와 짝.
const PHOTOS = ['consult', 'treat', 'waiting', 'counsel', 'recovery'] as const;

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
            <Image
              src={`${assetBase}/facility/${PHOTOS[i % PHOTOS.length]}.jpg`}
              alt=""
              fill
              sizes="440px"
              className="object-cover"
            />
            <div className="photo-veil" />
            <figcaption className="absolute bottom-4 left-5 text-[13px] font-bold text-white/90 lg:bottom-6 lg:left-7 lg:text-[15px]">
              {name}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
