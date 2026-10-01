import {use} from 'react';
import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {MagHero, ChapterNav, Chapter, Label, Grid3, Steps, Definition} from '@/components/Editorial';
import ConsultBanner from '@/components/ConsultBanner';
import {pageMeta} from '@/lib/meta';

// 브리프 서브 /stem-cell — 개요/자가혈/자가지방/고압산소 + 디토셀 시술.
// 2026-10-01 정보 중심 개선안: 탭 대신 챕터 + 바로가기 띠, 짧은 항목은 3칸 격자, 과정은 STEP 카드. 문구는 병원 원문 그대로.
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

function Content() {
  const t = useTranslations('stemCellPage');
  const raw = <T,>(k: string) => t.raw(k) as T;
  const chapters = [
    {id: 'overview', label: t('tabs.overview')},
    {id: 'blood', label: t('tabs.blood')},
    {id: 'adipose', label: t('tabs.adipose')},
    {id: 'hbot', label: t('tabs.hbot')},
    {id: 'dittocell', label: t('dittocellTitle')}
  ];

  // 자가혈·자가지방은 구성이 같다 — 소개 → 특징 → 시술 과정.
  const type = (key: 'blood' | 'adipose', no: number) => (
    <Chapter id={key} no={no} title={t(`${key}.name`)} sub={t(`${key}.en`)} intro={t(`${key}.desc`)}>
      <Grid3 items={raw<Pair[]>(`${key}.features`)} />
      <Label>{t(`${key}.processTitle`)}</Label>
      <Steps items={raw<Pair[]>(`${key}.process`)} />
    </Chapter>
  );

  return (
    <>
      <MagHero
        en="Stem Cell"
        title={t('title')}
        desc={t('desc')}
        img="hero/stem.jpg"
        facts={[
          {n: 2, label: `${t('tabs.blood')} · ${t('tabs.adipose')}`},
          {n: raw<Pair[]>('overview.functions').length, label: t('overview.functionsTitle')}
        ]}
      />
      <ChapterNav items={chapters} />

      <Chapter id="overview" no={0} title={t('tabs.overview')} first>
        <Definition text={t('overview.definition')} sub={t('overview.features')} img="pages/skin-layer.jpg" />
        <Label>{t('overview.traitsTitle')}</Label>
        <Grid3 items={raw<Pair[]>('overview.traits')} />
        <Label>{t('overview.functionsTitle')}</Label>
        <Grid3 items={raw<Pair[]>('overview.functions')} />
      </Chapter>

      {type('blood', 1)}
      {type('adipose', 2)}

      <Chapter id="hbot" no={3} title={t('hbot.name')} sub={t('hbot.tagline')} intro={<><p>{t('hbot.desc')}</p><p className="text-sub mt-4 text-[15px]">{t('hbot.extra')}</p></>}>
        <Label>{t('hbot.featuresTitle')}</Label>
        <Grid3 items={raw<string[]>('hbot.features').map((desc) => ({desc}))} />
      </Chapter>

      <Chapter id="dittocell" no={4} title={t('dittocellTitle')}>
        <Grid3 items={raw<Pair[]>('dittocell')} />
      </Chapter>

      <ConsultBanner />
    </>
  );
}
