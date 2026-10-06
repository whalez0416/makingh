import {getLocale, getTranslations} from 'next-intl/server';
import Reveal from '@/components/Reveal';
import {getWikiArticles, WIKI_HUB} from '@/lib/wiki';
import {siteUrl} from '@/lib/site';

// 시술 페이지 아래 "자주 묻는 질문" — 같은 분야의 위키 글로 바로 간다(검색엔진·AI 가 위키를 찾아오는 길이기도 하다).
export default async function WikiLinks({cats}: {cats: string[]}) {
  const locale = await getLocale();
  const t = await getTranslations('wiki');
  const items = (await getWikiArticles(locale)).filter((a) => cats.includes(a.cat));
  if (!items.length) return null;
  return (
    <section className="px-5 pt-16 pb-6 lg:px-10 lg:pt-[120px]">
      <Reveal>
        <p className="card-title text-ink">{t('faq')}</p>
        <ul className="border-line mt-6 border-t">
          {items.map((a) => (
            <li key={a.href} className="border-line border-b">
              <a href={a.href} className="text-ink hover:text-accent flex items-center justify-between gap-4 py-4 text-[15px] transition-colors lg:py-5 lg:text-[17px]">
                {a.title} <span aria-hidden>→</span>
              </a>
            </li>
          ))}
        </ul>
        <a href={`${siteUrl}${WIKI_HUB[locale] ?? WIKI_HUB.ko}`} className="text-sub hover:text-ink mt-5 inline-block text-[14px] underline underline-offset-4">
          {t('more')}
        </a>
      </Reveal>
    </section>
  );
}
