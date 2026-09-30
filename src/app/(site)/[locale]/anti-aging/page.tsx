import {use} from 'react';
import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {MagHero, ChapterNav, Chapter, Lead, EdList} from '@/components/Editorial';
import ConsultBanner from '@/components/ConsultBanner';
import {pageMeta} from '@/lib/meta';

// 브리프 서브 /anti-aging — 레이저 / 주사 / 스킨부스터 / 고압산소.
// 2026-09-30 매거진 문법으로 재구성: 탭 대신 챕터로 펼치고 위에 챕터 바로가기 띠.
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
  const keys = ['laser', 'injection', 'booster'] as const;
  const imgs = ['hero/sub2.jpg', 'signature/model.jpg', 'hero/rolling-3.jpg'];
  const chapters = [...keys.map((k) => ({id: k, label: t(`tabs.${k}`)})), {id: 'hbot', label: t('tabs.hbot')}];

  return (
    <>
      <MagHero en="Anti-aging" title={t('title')} desc={t('desc')} img="hero/rolling-2.jpg" imgPos="60% center" />
      <ChapterNav items={chapters} />

      {keys.map((k, i) => (
        <Chapter key={k} id={k} no={i} title={t(`tabs.${k}`)} img={imgs[i]} first={i === 0}>
          <Lead>{t(`${k}.intro`)}</Lead>
          <EdList items={t.raw(`${k}.items`) as Item[]} />
        </Chapter>
      ))}

      <Chapter id="hbot" no={3} title={t('hbot.name')} desc={t('hbot.tagline')} img="facility/recovery.jpg">
        <Lead>{t('hbot.intro')}</Lead>
        <p className="text-sub -mt-6 mb-10 text-[15px] leading-relaxed break-keep lg:-mt-8 lg:mb-14 lg:text-[16px]">{t('hbot.desc')}</p>
        <EdList title={t('hbot.featuresTitle')} items={(t.raw('hbot.features') as string[]).map((desc) => ({desc}))} />
      </Chapter>

      <ConsultBanner />
    </>
  );
}
