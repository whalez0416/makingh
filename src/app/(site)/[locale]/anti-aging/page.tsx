import {use} from 'react';
import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {MagHero, ChapterNav, Chapter, Label, DeviceCards, TwoColList, Grid3} from '@/components/Editorial';
import ConsultBanner from '@/components/ConsultBanner';
import {pageMeta} from '@/lib/meta';

// 브리프 서브 /anti-aging — 레이저 / 주사 / 스킨부스터 / 고압산소.
// 2026-10-01 정보 중심 개선안: 레이저·스킨부스터 = 장비 카드(스펙 숫자 칩), 주사 = 이름|설명 목록. 문구는 병원 원문 그대로.
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

function Content() {
  const t = useTranslations('antiAgingPage');
  const items = (k: string) => t.raw(`${k}.items`) as Item[];
  const chapters = ['laser', 'injection', 'booster', 'hbot'].map((k) => ({id: k, label: t(`tabs.${k}`)}));

  return (
    <>
      <MagHero
        en="Anti-aging"
        title={t('title')}
        desc={t('desc')}
        img="hero/rolling-2.jpg"
        imgPos="60% center"
        facts={[
          {n: items('laser').length, label: t('tabs.laser')},
          {n: items('injection').length, label: t('tabs.injection')},
          {n: items('booster').length, label: t('tabs.booster')}
        ]}
      />
      <ChapterNav items={chapters} />

      <Chapter id="laser" no={0} title={t('tabs.laser')} intro={t('laser.intro')} first>
        <DeviceCards items={items('laser')} />
      </Chapter>
      <Chapter id="injection" no={1} title={t('tabs.injection')} intro={t('injection.intro')}>
        <TwoColList items={items('injection')} />
      </Chapter>
      <Chapter id="booster" no={2} title={t('tabs.booster')} intro={t('booster.intro')}>
        <DeviceCards items={items('booster')} />
      </Chapter>
      <Chapter id="hbot" no={3} title={t('hbot.name')} sub={t('hbot.tagline')} intro={<><p>{t('hbot.intro')}</p><p className="text-sub mt-4 text-[15px]">{t('hbot.desc')}</p></>}>
        <Label>{t('hbot.featuresTitle')}</Label>
        <Grid3 items={(t.raw('hbot.features') as string[]).map((desc) => ({desc}))} />
      </Chapter>

      <ConsultBanner />
    </>
  );
}
