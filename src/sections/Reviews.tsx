import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {cmsFind} from '@/lib/cms';
import type {Locale} from '@/i18n/routing';
import type {Review} from '@/payload-types';
import SectionHeader from '@/components/SectionHeader';
import Reveal from '@/components/Reveal';

// 브리프 §4-7 고객 후기 — CMS reviews 카드 슬라이더.
// 문구는 병원이 관리자에서 직접 넣는다 (§9 의료광고: 효과 문구를 만들지 않는다).
// 슬라이더는 CSS scroll-snap — 스와이프가 네이티브로 되고 의존성이 늘지 않는다.
export default async function Reviews({locale}: {locale: Locale}) {
  const t = await getTranslations('reviews');
  const docs = await cmsFind<Review>({
    collection: 'reviews',
    locale,
    where: {published: {equals: true}},
    sort: 'order',
    limit: 12,
    depth: 1
  });

  if (docs.length === 0) return null;

  return (
    <section className="py-20 lg:py-[120px]">
      <div className="px-5 lg:px-10">
        <SectionHeader eyebrow={t('eyebrow')} title={t('title')} />
      </div>
      <Reveal>
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 lg:gap-6 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {docs.map((r) => {
            const thumb = typeof r.thumbnail === 'object' && r.thumbnail?.url ? r.thumbnail.url : null;
            const Card = (
              <>
                <div className="bg-line relative aspect-[9/16] overflow-hidden rounded-[16px]">
                  {thumb && (
                    <Image
                      src={thumb}
                      alt=""
                      fill
                      sizes="(min-width:1024px) 300px, 85vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <p className="card-title text-ink mt-4">{r.highlight}</p>
                {r.desc && <p className="text-sub mt-1.5 text-[14px]">{r.desc}</p>}
              </>
            );
            return (
              <li
                key={r.id}
                className="w-[85vw] shrink-0 snap-start sm:w-[320px] lg:w-[300px]"
              >
                {r.instagramUrl ? (
                  <a href={r.instagramUrl} target="_blank" rel="noreferrer" className="group block">
                    {Card}
                  </a>
                ) : (
                  Card
                )}
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
