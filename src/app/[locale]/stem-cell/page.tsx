import {use} from 'react';
import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import PageHero from '@/components/PageHero';
import Tabs from '@/components/Tabs';
import ConsultBanner from '@/components/ConsultBanner';
import Reveal from '@/components/Reveal';

// 브리프 서브 /stem-cell — 탭 4(개요/자가혈/자가지방/고압산소) + 기능 6종 + 시술 과정.
export default function StemCellPage({params}: PageProps<'/[locale]/stem-cell'>) {
  const {locale} = use(params);
  setRequestLocale(locale);

  return <Content />;
}

function TypeCard({
  name,
  en,
  points
}: {
  name: string;
  en: string;
  points: string[];
}) {
  return (
    <article className="border-line bg-surface rounded-[16px] border p-6 lg:p-10">
      <p className="text-accent text-[13px] font-bold tracking-[0.14em] uppercase lg:text-[15px]">
        {en}
      </p>
      <p className="card-title text-ink mt-2">{name}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {points.map((p) => (
          <li
            key={p}
            className="border-line text-sub rounded-full border px-4 py-2 text-[13px] font-bold lg:text-[15px]"
          >
            {p}
          </li>
        ))}
      </ul>
    </article>
  );
}

function Content() {
  const t = useTranslations('stemCellPage');
  const functions = t.raw('overview.functions') as {name: string; desc: string}[];
  const process = t.raw('process') as string[];

  const overview = (
    <div>
      <p className="text-ink max-w-[760px] text-[17px] leading-relaxed font-bold lg:text-[24px]">
        {t('overview.definition')}
      </p>
      <p className="text-accent mt-4 text-[14px] font-bold lg:text-[16px]">
        {t('overview.features')}
      </p>

      <p className="card-title text-ink mt-10 lg:mt-14">
        {t('overview.functionsTitle')}
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:mt-6 lg:grid-cols-3 lg:gap-4">
        {functions.map((f, i) => (
          <article
            key={f.name}
            className="border-line bg-surface rounded-[12px] border p-5 lg:p-7"
          >
            <p className="text-accent text-[13px] font-bold lg:text-[15px]">
              {String(i + 1).padStart(2, '0')}
            </p>
            <p className="text-ink mt-1 text-[15px] font-bold lg:text-[18px]">
              {f.name}
            </p>
            <p className="text-sub mt-1 text-[13px] lg:text-[15px]">{f.desc}</p>
          </article>
        ))}
      </div>
    </div>
  );

  const hbot = (
    <article className="border-line bg-surface rounded-[16px] border p-6 lg:p-10">
      <p className="card-title text-ink">{t('hbot.name')}</p>
      <p className="text-sub mt-3 text-[14px] leading-relaxed lg:text-[16px]">
        {t('hbot.desc')}
      </p>
    </article>
  );

  return (
    <>
      <PageHero title={t('title')} desc={t('desc')} en="STEM CELL" />
      <section className="px-5 pt-14 lg:px-10 lg:pt-[100px]">
        <Reveal>
          <Tabs
            labels={[
              t('tabs.overview'),
              t('tabs.blood'),
              t('tabs.adipose'),
              t('tabs.hbot')
            ]}
            panels={[
              overview,
              <TypeCard
                key="blood"
                name={t('blood.name')}
                en={t('blood.en')}
                points={t.raw('blood.points') as string[]}
              />,
              <TypeCard
                key="adipose"
                name={t('adipose.name')}
                en={t('adipose.en')}
                points={t.raw('adipose.points') as string[]}
              />,
              hbot
            ]}
          />
        </Reveal>
      </section>

      <section className="px-5 pt-24 pb-10 lg:px-10 lg:pt-[160px] lg:pb-[80px]">
        <Reveal>
          <p className="card-title text-ink">{t('processTitle')}</p>
          <ol className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 lg:mt-6 lg:gap-4">
            {process.map((step, i) => (
              <li
                key={step}
                className="border-line bg-surface rounded-[12px] border p-5 lg:p-7"
              >
                <p className="text-accent text-[13px] font-bold lg:text-[15px]">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="text-ink mt-1 text-[14px] font-bold lg:text-[17px]">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>
      <ConsultBanner />
    </>
  );
}
