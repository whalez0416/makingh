import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {assetBase} from '@/lib/site';
import {Link} from '@/i18n/navigation';
import SectionHeader from '@/components/SectionHeader';

// 브리프 §4-10 시설 갤러리 마퀴 — 저속으로 흐르는 이미지 띠. 애니메이션은 globals.css .marquee.
// 병원 제공 인테리어 이미지(2026-09-30) — public/facility/ 파일만 교체하면 된다. 순서는 messages tiles 와 짝.
const PHOTOS = ['consult', 'treat', 'waiting', 'counsel', 'recovery'] as const;

export default function GalleryMarquee() {
  const t = useTranslations('gallery');
  const c = useTranslations('common');
  const tiles = t.raw('tiles') as string[];
  const doubled = [...tiles, ...tiles]; // 끊김 없는 루프용 복제

  return (
    <section className="overflow-hidden py-24 lg:py-[160px]" aria-label={t('label')}>
      {/* 2026-09-30 발주자 피드백: 사진만 흐르고 제목이 없었다 */}
      <div className="px-5 lg:px-10">
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          right={
            <Link href="/about" className="text-sub hover:text-ink inline-flex items-center gap-2 text-[14px] transition-colors">
              {c('more')} <span aria-hidden>→</span>
            </Link>
          }
        />
      </div>
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
