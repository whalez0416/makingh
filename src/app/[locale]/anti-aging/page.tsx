import {use} from 'react';
import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import PageHero from '@/components/PageHero';
import Tabs from '@/components/Tabs';
import ConsultBanner from '@/components/ConsultBanner';
import Reveal from '@/components/Reveal';

// 브리프 서브 /anti-aging — 탭 4: 레이저 / 주사 / 스킨부스터 / 고압산소.
// 주사·스킨부스터 세부 시술명은 구 사이트에서 추출 불가 — 원고 수급 전까지 〈확인〉 (§9 의료광고).
export default function AntiAgingPage({params}: PageProps<'/[locale]/anti-aging'>) {
  const {locale} = use(params);
  setRequestLocale(locale);

  return <Content />;
}

function PendingNote({text}: {text: string}) {
  return (
    <p className="border-line text-sub rounded-[16px] border border-dashed p-8 text-center text-[14px] lg:p-12 lg:text-[16px]">
      {text}
    </p>
  );
}

function Content() {
  const t = useTranslations('antiAgingPage');
  const devices = t.raw('laser.devices') as string[];

  const laser = (
    <div>
      <article className="border-line bg-surface rounded-[16px] border p-6 lg:p-10">
        <p className="card-title text-ink">{t('laser.featured.name')}</p>
        <p className="text-sub mt-3 max-w-[720px] text-[14px] leading-relaxed lg:text-[16px]">
          {t('laser.featured.desc')}
        </p>
      </article>
      <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:mt-6 lg:grid-cols-4 lg:gap-4">
        {devices.map((name) => (
          <li
            key={name}
            className="border-line bg-surface text-ink flex min-h-[72px] items-center justify-center rounded-[12px] border text-[14px] font-bold lg:min-h-[96px] lg:text-[17px]"
          >
            {name}
          </li>
        ))}
      </ul>
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
            panels={[
              laser,
              <PendingNote key="i" text={t('injection.note')} />,
              <PendingNote key="b" text={t('booster.note')} />,
              hbot
            ]}
          />
        </Reveal>
      </section>
      <ConsultBanner />
    </>
  );
}
