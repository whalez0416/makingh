import {use} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {assetBase} from '@/lib/site';
import {setRequestLocale} from 'next-intl/server';
import Doctor from '@/sections/Doctor';
import ConsultBanner from '@/components/ConsultBanner';
import {MagHero, ChapterNav, Chapter} from '@/components/Editorial';
import {pageMeta} from '@/lib/meta';

// 브리프 서브 /about — 철학 · 원장 인사말 · 시설. 의료진 블록은 메인 §4-8 섹션 재사용.
// 2026-10-01 정보 중심 개선안(명조는 맨 위 제목만) + 병원이 보낸 인테리어 이미지를 공간 챕터에.
export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMeta(locale, 'about', 'about/');
}

export default function AboutPage({params}: PageProps<'/[locale]/about'>) {
  const {locale} = use(params);
  setRequestLocale(locale);

  return <Content />;
}

// 이름 붙은 3곳(facilities 배열과 짝) 다음에 나머지 공간을 이름 없이 잇는다
const NAMED = ['consult', 'treat', 'waiting'];
const MORE = ['reception', 'lobby', 'counsel', 'recovery', 'hall', 'powder']; // 6장 = 3열 두 줄 (한 장만 남는 줄 없게)

function Content() {
  const t = useTranslations('aboutPage');
  const facilities = t.raw('facilities') as {name: string; desc: string}[];
  const chapters = [
    {id: 'philosophy', label: t('philosophyTitle')},
    {id: 'greeting', label: t('greetingTitle')},
    {id: 'space', label: t('facilityTitle')}
  ];

  return (
    <>
      <MagHero en="About" title={t('title')} img="facility/reception.jpg" />
      <ChapterNav items={chapters} />

      <Chapter
        id="philosophy"
        no={0}
        title={t('philosophyTitle')}
        intro={<><p className="text-[20px] leading-[1.6] font-bold tracking-[-0.02em] lg:text-[24px]">{t('philosophy')}</p><p className="text-sub mt-4">{t('philosophyDesc')}</p></>}
        first
      />
      <Chapter id="greeting" no={1} title={t('greetingTitle')} intro={<p className="whitespace-pre-line">{t('greeting')}</p>} />
      <Doctor />

      <Chapter id="space" no={2} title={t('facilityTitle')}>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-6 lg:gap-4">
          {NAMED.map((img, i) => (
            <figure key={img} className={i === 0 ? 'col-span-2 lg:col-span-4 lg:row-span-2' : 'col-span-1 lg:col-span-2'}>
              <div className={`relative overflow-hidden ${i === 0 ? 'aspect-[4/3]' : 'aspect-[4/3]'}`}>
                <Image src={`${assetBase}/facility/${img}.jpg`} alt={facilities[i]?.name ?? ''} fill sizes="(min-width:1024px) 45vw, 50vw" className="object-cover" />
              </div>
              {facilities[i] && (
                <figcaption className="mt-2">
                  <b className="text-ink text-[15px] font-bold lg:text-[16px]">{facilities[i].name}</b>
                  <span className="text-sub ml-2 text-[13px]">{facilities[i].desc}</span>
                </figcaption>
              )}
            </figure>
          ))}
          {MORE.map((img) => (
            <div key={img} className="relative col-span-1 aspect-[4/3] overflow-hidden lg:col-span-2">
              <Image src={`${assetBase}/facility/${img}.jpg`} alt="" fill sizes="(min-width:1024px) 30vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </Chapter>

      <ConsultBanner />
    </>
  );
}
