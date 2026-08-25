import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {cmsFind} from '@/lib/cms';
import type {Locale} from '@/i18n/routing';
import type {Notice} from '@/payload-types';
import PageHero from '@/components/PageHero';
import ConsultBanner from '@/components/ConsultBanner';
import Reveal from '@/components/Reveal';

// 브리프 §4 서브 /notice — CMS notices 목록. 노출 켜진 것만, 게시일 내림차순.
export default async function NoticePage({params}: PageProps<'/[locale]/notice'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('noticePage');
  const docs = await cmsFind<Notice>({
    collection: 'notices',
    locale: locale as Locale,
    where: {published: {equals: true}},
    sort: '-publishedAt',
    limit: 50,
    depth: 0
  });

  return (
    <>
      <PageHero title={t('title')} en={t('en')} />

      <section className="px-5 pt-14 pb-20 lg:px-10 lg:pt-[100px] lg:pb-[120px]">
        {docs.length === 0 ? (
          <p className="text-sub text-[15px]">{t('empty')}</p>
        ) : (
          <ul className="border-line border-t">
            {docs.map((n) => (
              <li key={n.id} className="border-line border-b">
                <Link
                  href={`/notice/${n.id}`}
                  className="group flex flex-col gap-2 py-6 lg:flex-row lg:items-center lg:gap-8 lg:py-8"
                >
                  <span className="text-accent shrink-0 text-[13px] font-bold lg:w-[80px] lg:text-[14px]">
                    {t(n.category === 'event' ? 'event' : 'notice')}
                  </span>
                  <span className="card-title text-ink flex-1 group-hover:underline">
                    {n.title}
                  </span>
                  <time
                    dateTime={n.publishedAt}
                    className="text-sub shrink-0 text-[13px] lg:text-[15px]"
                  >
                    {n.publishedAt.slice(0, 10).replace(/-/g, '.')}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <ConsultBanner />
    </>
  );
}
