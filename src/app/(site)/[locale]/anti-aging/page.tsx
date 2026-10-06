import {use} from 'react';
import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import PageHero from '@/components/PageHero';
import Tabs from '@/components/Tabs';
import ConsultBanner from '@/components/ConsultBanner';
import WikiLinks from '@/components/WikiLinks';
import Reveal from '@/components/Reveal';
import {pageMeta} from '@/lib/meta';

// 브리프 서브 /anti-aging — 탭 4: 레이저 / 주사 / 스킨부스터 / 고압산소.
// 시술 설명은 전부 병원 원문 그대로다(§9 의료광고 — 효과 문구를 새로 짓지 않는다).
export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMeta(locale, 'antiAging', 'anti-aging/');
}

export default function AntiAgingPage({params}: PageProps<'/[locale]/anti-aging'>) {
  const {locale} = use(params);
  setRequestLocale(locale);

  return <Content />;
}

type Item = {name: string; desc: string; sub?: string};

function TreatmentList({intro, items}: {intro: string; items: Item[]}) {
  return (
    <div>
      <p className="text-sub max-w-[820px] text-[14px] leading-relaxed lg:text-[17px]">
        {intro}
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:mt-8 lg:gap-4">
        {items.map((it) => (
          <li
            key={it.name}
            className="border-line bg-surface rounded-[16px] border p-6 lg:p-8"
          >
            <p className="card-title text-ink">{it.name}</p>
            {it.sub ? (
              <p className="text-accent mt-1 text-[13px] font-bold lg:text-[15px]">
                {it.sub}
              </p>
            ) : null}
            <p className="text-sub mt-3 text-[13px] leading-relaxed lg:text-[15px]">
              {it.desc}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Content() {
  const t = useTranslations('antiAgingPage');
  const tab = (key: string) => (
    <TreatmentList
      intro={t(`${key}.intro`)}
      items={t.raw(`${key}.items`) as Item[]}
    />
  );

  const hbot = (
    <div>
      <article className="border-line bg-surface rounded-[16px] border p-6 lg:p-10">
        <p className="text-accent text-[13px] font-bold lg:text-[15px]">
          {t('hbot.tagline')}
        </p>
        <p className="card-title text-ink mt-2">{t('hbot.name')}</p>
        <p className="text-sub mt-4 max-w-[820px] text-[14px] leading-relaxed lg:text-[17px]">
          {t('hbot.intro')}
        </p>
        <p className="text-sub mt-3 max-w-[820px] text-[14px] leading-relaxed lg:text-[17px]">
          {t('hbot.desc')}
        </p>
      </article>
      <p className="card-title text-ink mt-10 lg:mt-14">
        {t('hbot.featuresTitle')}
      </p>
      <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:mt-6 lg:gap-4">
        {(t.raw('hbot.features') as string[]).map((f, i) => (
          <li
            key={f}
            className="border-line bg-surface rounded-[12px] border p-5 lg:p-7"
          >
            <p className="text-accent text-[13px] font-bold lg:text-[15px]">
              {String(i + 1).padStart(2, '0')}
            </p>
            <p className="text-ink mt-1 text-[14px] leading-relaxed lg:text-[17px]">
              {f}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <PageHero title={t('title')} desc={t('desc')} en="ANTI-AGING" />
      <section className="px-5 pt-14 pb-10 lg:px-10 lg:pt-[100px] lg:pb-[80px]">
        <Reveal>
          <Tabs
            labels={[
              t('tabs.laser'),
              t('tabs.injection'),
              t('tabs.booster'),
              t('tabs.hbot')
            ]}
            panels={[tab('laser'), tab('injection'), tab('booster'), hbot]}
          />
        </Reveal>
      </section>
      <WikiLinks cats={['lifting']} />
      <ConsultBanner />
    </>
  );
}
