import {use} from 'react';
import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {MagHero, ChapterNav, Chapter, Lead, EdList, Steps} from '@/components/Editorial';
import ConsultBanner from '@/components/ConsultBanner';
import {pageMeta} from '@/lib/meta';

// 브리프 서브 /stem-cell — 개요/자가혈/자가지방/고압산소 + 디토셀 시술.
// 2026-09-30 매거진 문법으로 재구성: 탭에 숨어 있던 내용을 챕터로 펼치고 위에 챕터 바로가기 띠.
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
  const type = (key: 'blood' | 'adipose', no: number, img: string) => (
    <Chapter id={key} no={no} title={t(`${key}.name`)} desc={t(`${key}.en`)} img={img}>
      <Lead>{t(`${key}.desc`)}</Lead>
      <EdList items={raw<Pair[]>(`${key}.features`)} />
      <Steps title={t(`${key}.processTitle`)} items={raw<Pair[]>(`${key}.process`)} />
    </Chapter>
  );

  return (
    <>
      <MagHero en="Stem Cell" title={t('title')} desc={t('desc')} img="pages/stem-twin.jpg" />
      <ChapterNav items={chapters} />

      <Chapter id="overview" no={0} title={t('tabs.overview')} img="hero/stem.jpg" first>
        <Lead sub={t('overview.features')}>{t('overview.definition')}</Lead>
        <EdList title={t('overview.traitsTitle')} items={raw<Pair[]>('overview.traits')} />
        <EdList title={t('overview.functionsTitle')} items={raw<Pair[]>('overview.functions')} cols={2} />
      </Chapter>

      {type('blood', 1, 'pages/vial.jpg')}
      {type('adipose', 2, 'facility/treat.jpg')}

      <Chapter id="hbot" no={3} title={t('hbot.name')} desc={t('hbot.tagline')} img="facility/recovery.jpg">
        <Lead>{t('hbot.desc')}</Lead>
        <p className="text-sub -mt-6 mb-10 text-[15px] leading-relaxed break-keep lg:-mt-8 lg:mb-14 lg:text-[16px]">{t('hbot.extra')}</p>
        <EdList title={t('hbot.featuresTitle')} items={raw<string[]>('hbot.features').map((desc) => ({desc}))} />
      </Chapter>

      <Chapter id="dittocell" no={4} title={t('dittocellTitle')} img="facility/doctor.jpg">
        <EdList items={raw<Pair[]>('dittocell')} />
      </Chapter>

      <ConsultBanner />
    </>
  );
}
