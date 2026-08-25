import {notFound} from 'next/navigation';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {RichText} from '@payloadcms/richtext-lexical/react';
import {Link} from '@/i18n/navigation';
import {getCms} from '@/lib/payload';
import {routing, type Locale} from '@/i18n/routing';
import PageHero from '@/components/PageHero';
import ConsultBanner from '@/components/ConsultBanner';

// 정적 내보내기에서도 상세가 나오도록 전 언어 × 전 글을 빌드 시점에 펼친다.
export async function generateStaticParams() {
  const cms = await getCms();
  const {docs} = await cms.find({
    collection: 'notices',
    where: {published: {equals: true}},
    limit: 500,
    depth: 0
  });
  return routing.locales.flatMap((locale) =>
    docs.map((n) => ({locale, id: String(n.id)}))
  );
}

export default async function NoticeDetail({params}: PageProps<'/[locale]/notice/[id]'>) {
  const {locale, id} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('noticePage');
  const cms = await getCms();
  const doc = await cms
    .findByID({collection: 'notices', id, locale: locale as Locale, depth: 0})
    .catch(() => null);

  if (!doc || !doc.published) notFound();

  return (
    <>
      <PageHero title={doc.title} en={t('en')} />

      <article className="px-5 pt-10 pb-20 lg:px-10 lg:pt-[70px] lg:pb-[120px]">
        <div className="mx-auto max-w-[760px]">
          <div className="border-line flex items-center gap-4 border-b pb-5">
            <span className="text-accent text-[13px] font-bold lg:text-[14px]">
              {t(doc.category === 'event' ? 'event' : 'notice')}
            </span>
            <time dateTime={doc.publishedAt} className="text-sub text-[13px] lg:text-[15px]">
              {doc.publishedAt.slice(0, 10).replace(/-/g, '.')}
            </time>
          </div>

          {/* 본문 서식은 globals.css .rich 가 잡는다 — 관리자가 넣은 태그를 그대로 받는다 */}
          <div className="rich text-ink mt-8 text-[15px] leading-relaxed lg:text-[17px]">
            {doc.body ? <RichText data={doc.body} /> : null}
          </div>

          <Link
            href="/notice"
            className="text-sub mt-12 inline-block text-[14px] underline lg:text-[15px]"
          >
            {t('back')}
          </Link>
        </div>
      </article>
      <ConsultBanner />
    </>
  );
}
