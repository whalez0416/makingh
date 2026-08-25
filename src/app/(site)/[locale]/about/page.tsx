import {use} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {assetBase} from '@/lib/site';
import {setRequestLocale} from 'next-intl/server';
import PageHero from '@/components/PageHero';
import Doctor from '@/sections/Doctor';
import ConsultBanner from '@/components/ConsultBanner';
import Reveal from '@/components/Reveal';

// 브리프 서브 /about — 철학 · 원장 인사말 · 시설. 의료진 블록은 메인 §4-8 섹션 재사용.
export default function AboutPage({params}: PageProps<'/[locale]/about'>) {
  const {locale} = use(params);
  setRequestLocale(locale);

  return <Content />;
}

function Content() {
  const t = useTranslations('aboutPage');
  const facilities = t.raw('facilities') as {name: string; desc: string}[];

  return (
    <>
      <PageHero title={t('title')} en={t('en')} />

      <section className="px-5 pt-14 pb-14 lg:px-10 lg:pt-[100px] lg:pb-[80px]">
        <Reveal>
          <p className="h2 text-ink max-w-[860px]">{t('philosophy')}</p>
          <p className="text-sub mt-4 max-w-[640px] text-[14px] leading-relaxed lg:mt-6 lg:text-[17px]">
            {t('philosophyDesc')}
          </p>
        </Reveal>
      </section>

      <section className="px-5 py-14 lg:px-10 lg:py-[80px]">
        <Reveal>
          <p className="eyebrow mb-3">{t('greetingTitle')}</p>
          <p className="text-ink max-w-[760px] text-[15px] leading-relaxed lg:text-[19px]">
            {t('greeting')}
          </p>
        </Reveal>
      </section>

      <Doctor />

      <section className="px-5 pb-10 lg:px-10 lg:pb-[80px]">
        <Reveal>
          <p className="eyebrow mb-6">{t('facilityTitle')}</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
            {/* 사진은 갤러리 마퀴와 같은 임시 스톡 재사용 — 순서는 facilities 배열과 짝 */}
            {facilities.map((f, i) => (
              <figure key={f.name}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-[linear-gradient(145deg,var(--color-line),var(--color-accent)_80%)]">
                  <Image
                    src={`${assetBase}/facility/${['consult', 'treat', 'waiting'][i]}.jpg`}
                    alt=""
                    fill
                    sizes="(min-width:768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3">
                  <p className="text-ink text-[15px] font-bold lg:text-[18px]">
                    {f.name}
                  </p>
                  <p className="text-sub mt-0.5 text-[13px] lg:text-[15px]">
                    {f.desc}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </section>
      <ConsultBanner />
    </>
  );
}
