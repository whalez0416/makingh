import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {cmsFind} from '@/lib/cms';
import type {Locale} from '@/i18n/routing';
import type {Notice} from '@/payload-types';
import SectionHeader from '@/components/SectionHeader';
import Reveal from '@/components/Reveal';

// 브리프 §4-9 소식 피드 — CMS notices 최신 3건. 등록된 것이 없으면 섹션째 나오지 않는다.
export default async function NewsFeed({locale}: {locale: Locale}) {
  const t = await getTranslations('news');
  const docs = await cmsFind<Notice>({
    collection: 'notices',
    locale,
    where: {published: {equals: true}},
    sort: '-publishedAt',
    limit: 3,
    depth: 0
  });

  if (docs.length === 0) return null;

  return (
    <section className="px-5 py-20 lg:px-10 lg:py-[120px]">
      <SectionHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        right={
          <Link href="/notice" className="text-sub hover:text-ink text-[15px] underline underline-offset-4">
            {t('more')}
          </Link>
        }
      />
      <Reveal>
        <ul className="border-line border-t">
          {docs.map((n) => (
            <li key={n.id} className="border-line border-b">
              <Link
                href={`/notice/${n.id}`}
                className="group flex flex-col gap-2 py-6 lg:flex-row lg:items-center lg:gap-8 lg:py-7"
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
        <Link
          href="/notice"
          className="text-sub hover:text-ink mt-8 block text-center text-[14px] underline underline-offset-4 lg:hidden"
        >
          {t('more')}
        </Link>
      </Reveal>
    </section>
  );
}
