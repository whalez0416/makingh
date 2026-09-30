import Image from 'next/image';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {cmsFind} from '@/lib/cms';
import type {Locale} from '@/i18n/routing';
import type {Review} from '@/payload-types';
import {MagHero} from '@/components/Editorial';
import ConsultBanner from '@/components/ConsultBanner';
import Reveal from '@/components/Reveal';
import {pageMeta} from '@/lib/meta';

// 브리프 §4 서브 /reviews — CMS reviews 카드 그리드. 메인 슬라이더와 같은 자료를 전부 편다.
export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMeta(locale, 'reviews', 'reviews/');
}

export default async function ReviewsPage({params}: PageProps<'/[locale]/reviews'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('reviewsPage');
  const docs = await cmsFind<Review>({
    collection: 'reviews',
    locale: locale as Locale,
    where: {published: {equals: true}},
    sort: 'order',
    limit: 60,
    depth: 1
  });

  return (
    <>
      <MagHero en="Reviews" title={t('title')} desc={t('desc')} />

      <section className="px-5 pt-14 pb-20 lg:px-10 lg:pt-[100px] lg:pb-[120px]">
        {docs.length === 0 ? (
          <p className="text-sub text-[15px]">{t('empty')}</p>
        ) : (
          <Reveal>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {docs.map((r) => {
                const thumb =
                  typeof r.thumbnail === 'object' && r.thumbnail?.url ? r.thumbnail.url : null;
                const Card = (
                  <>
                    <div className="bg-line relative aspect-[9/16] overflow-hidden rounded-[16px]">
                      {thumb && (
                        <Image
                          src={thumb}
                          alt=""
                          fill
                          sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <p className="card-title text-ink mt-3">{r.highlight}</p>
                    {r.desc && <p className="text-sub mt-1.5 text-[13px] lg:text-[15px]">{r.desc}</p>}
                  </>
                );
                return (
                  <li key={r.id}>
                    {r.instagramUrl ? (
                      <a href={r.instagramUrl} target="_blank" rel="noreferrer" className="block">
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
        )}
      </section>
      <ConsultBanner />
    </>
  );
}
