import {use} from 'react';
import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import PageHero from '@/components/PageHero';
import Tabs from '@/components/Tabs';
import ConsultBanner from '@/components/ConsultBanner';
import Reveal from '@/components/Reveal';
import {pageMeta} from '@/lib/meta';

// 브리프 서브 /stem-cell — 탭 4(개요/자가혈/자가지방/고압산소) + 기능 6종 + 시술 과정.
// 설명은 전부 병원 원문 그대로다(§9 의료광고 — 효과 문구를 새로 짓지 않는다).
export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMeta(locale, 'stemCell', 'stem-cell/');
}

export default function StemCellPage({params}: PageProps<'/[locale]/stem-cell'>) {
  const {locale} = use(params);
  setRequestLocale(locale);

  return <Content />;
}

type Pair = {name: string; desc: string};

// 번호가 붙은 이름+설명 카드. 기능·특징·시술 과정이 전부 같은 모양이라 하나로 쓴다.
function NumberedCards({items, cols = 'lg:grid-cols-3'}: {items: Pair[]; cols?: string}) {
  return (
    <div className={`mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:mt-6 lg:gap-4 ${cols}`}>
      {items.map((it, i) => (
        <article
          key={it.name}
          className="border-line bg-surface rounded-[12px] border p-5 lg:p-7"
        >
          <p className="text-accent text-[13px] font-bold lg:text-[15px]">
            {String(i + 1).padStart(2, '0')}
          </p>
          <p className="text-ink mt-1 text-[15px] font-bold lg:text-[18px]">
            {it.name}
          </p>
          <p className="text-sub mt-2 text-[13px] leading-relaxed lg:text-[15px]">
            {it.desc}
          </p>
        </article>
      ))}
    </div>
  );
}

function Content() {
  const t = useTranslations('stemCellPage');
  const raw = <T,>(k: string) => t.raw(k) as T;

  const overview = (
    <div>
      <p className="text-ink max-w-[760px] text-[17px] leading-relaxed font-bold lg:text-[24px]">
        {t('overview.definition')}
      </p>
      <p className="text-accent mt-4 text-[14px] font-bold lg:text-[16px]">
        {t('overview.features')}
      </p>

      <p className="card-title text-ink mt-10 lg:mt-14">
        {t('overview.traitsTitle')}
      </p>
      <NumberedCards items={raw<Pair[]>('overview.traits')} />

      <p className="card-title text-ink mt-10 lg:mt-14">
        {t('overview.functionsTitle')}
      </p>
      <NumberedCards items={raw<Pair[]>('overview.functions')} />
    </div>
  );

  // 자가혈·자가지방은 구성이 같다 — 소개 → 특징 → 시술 과정.
  const type = (key: 'blood' | 'adipose') => (
    <div>
      <article className="border-line bg-surface rounded-[16px] border p-6 lg:p-10">
        <p className="text-accent text-[13px] font-bold tracking-[0.14em] uppercase lg:text-[15px]">
          {t(`${key}.en`)}
        </p>
        <p className="card-title text-ink mt-2">{t(`${key}.name`)}</p>
        <p className="text-sub mt-4 max-w-[820px] text-[14px] leading-relaxed lg:text-[17px]">
          {t(`${key}.desc`)}
        </p>
      </article>
      <NumberedCards items={raw<Pair[]>(`${key}.features`)} />
      <p className="card-title text-ink mt-10 lg:mt-14">
        {t(`${key}.processTitle`)}
      </p>
      <NumberedCards items={raw<Pair[]>(`${key}.process`)} cols="lg:grid-cols-4" />
    </div>
  );

  const hbot = (
    <div>
      <article className="border-line bg-surface rounded-[16px] border p-6 lg:p-10">
        <p className="text-accent text-[13px] font-bold lg:text-[15px]">
          {t('hbot.tagline')}
        </p>
        <p className="card-title text-ink mt-2">{t('hbot.name')}</p>
        <p className="text-sub mt-4 max-w-[820px] text-[14px] leading-relaxed lg:text-[17px]">
          {t('hbot.desc')}
        </p>
        <p className="text-sub mt-3 max-w-[820px] text-[14px] leading-relaxed lg:text-[17px]">
          {t('hbot.extra')}
        </p>
      </article>
      <p className="card-title text-ink mt-10 lg:mt-14">
        {t('hbot.featuresTitle')}
      </p>
      <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:mt-6 lg:gap-4">
        {raw<string[]>('hbot.features').map((f, i) => (
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
            panels={[overview, type('blood'), type('adipose'), hbot]}
          />
        </Reveal>
      </section>

      <section className="px-5 pt-24 pb-10 lg:px-10 lg:pt-[160px] lg:pb-[80px]">
        <Reveal>
          <p className="card-title text-ink">{t('dittocellTitle')}</p>
          <NumberedCards items={raw<Pair[]>('dittocell')} cols="lg:grid-cols-4" />
        </Reveal>
      </section>
      <ConsultBanner />
    </>
  );
}
