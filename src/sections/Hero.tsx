import Image from 'next/image';
import {useTranslations} from 'next-intl';
import HeroHeadline from '@/components/HeroHeadline';
import ConsultCta from '@/components/ConsultCta';
import {assetBase} from '@/lib/site';

// 2026-08-21 재개편: 풀스크린(풀블리드) 히어로 섹션 + 그 아래 클리닉 3카드 벤토 (브리프 §4-1 풀스크린).
// 헤더는 홈 최상단에서 화이트 톤으로 전환된다 (Header.tsx overHero).
// 벤토 비율은 beauwell 실측(좌 884 + gap 24 + 우 452, 우측 504/220) 유지.
// 2026-09-30 기존 dittocell.com 자산으로 교체: 메인 = 롤링 영상 3개(헤드라인과 짝), 카드 = 기존 사이트 사진.
export default function Hero() {
  const t = useTranslations('hero');
  const headlines = t.raw('headlines') as {lead: string; tail: string}[];

  return (
    <>
      {/* 풀스크린 히어로 */}
      <section className="relative h-[92svh] min-h-[560px] overflow-hidden">
        <HeroHeadline
          items={headlines}
          videos={[1, 2, 3].map((n) => ({
            src: `${assetBase}/hero/rolling-${n}.mp4`,
            srcMobile: `${assetBase}/hero/rolling-${n}-m.mp4`,
            poster: `${assetBase}/hero/rolling-${n}.jpg`
          }))}
        >
          <p className="hero-rise mt-4 max-w-[560px] text-[14px] leading-relaxed text-white/85 lg:mt-6 lg:text-[17px]">
            {t('tagline')}
          </p>
          <div className="hero-rise hero-rise-2 mt-7 lg:mt-9">
            <ConsultCta label={t('cta')} variant="light" />
          </div>
        </HeroHeadline>
      </section>

      {/* 클리닉 3카드 벤토 */}
      <section className="px-5 pt-4 pb-20 lg:px-10 lg:pt-6 lg:pb-[120px]">
        <div className="flex flex-col gap-4 lg:h-[748px] lg:flex-row lg:gap-6">
          {/* 좌: 큰 카드 (884 / 1360) — 줄기세포 */}
          <article className="relative flex min-h-[300px] items-end overflow-hidden rounded-[20px] bg-[linear-gradient(150deg,var(--color-line),var(--color-accent)_58%,var(--color-ink))] p-6 lg:h-full lg:flex-[884] lg:rounded-[30px] lg:p-10">
            <Image
              src={`${assetBase}/hero/stem.jpg`}
              alt=""
              fill
              sizes="(min-width:1024px) 62vw, 100vw"
              className="object-cover"
            />
            <div className="photo-veil" />
            <div className="relative">
              <p className="text-[13px] font-bold tracking-[0.06em] text-white/75 lg:text-[15px]">
                {t('main.cat')}
              </p>
              <p className="card-title mt-2 text-white">{t('main.title')}</p>
              <p className="mt-2 text-[14px] text-white/85 lg:text-[16px]">
                {t('main.desc')}
              </p>
            </div>
          </article>

          {/* 우: 504 / 220 (452 / 1360) */}
          <div className="flex flex-col gap-4 lg:flex-[452] lg:gap-6">
            <article className="relative flex min-h-[240px] items-end overflow-hidden rounded-[20px] bg-[linear-gradient(165deg,var(--color-line),var(--color-accent)_70%,var(--color-ink))] p-6 lg:flex-1 lg:rounded-[30px] lg:p-10">
              <Image
                src={`${assetBase}/hero/sub1.jpg`}
                alt=""
                fill
                sizes="(min-width:1024px) 32vw, 100vw"
                className="object-cover"
              />
              <div className="photo-veil" />
              <div className="relative">
                <p className="text-[13px] font-bold tracking-[0.06em] text-white/75 lg:text-[15px]">
                  {t('sub1.cat')}
                </p>
                <p className="card-title mt-2 whitespace-pre-line text-white">
                  {t('sub1.title')}
                </p>
                <p className="mt-2 text-[14px] text-white/85 lg:text-[16px]">
                  {t('sub1.desc')}
                </p>
              </div>
            </article>

            <article className="relative flex min-h-[180px] items-end overflow-hidden rounded-[20px] bg-[linear-gradient(120deg,var(--color-ink),var(--color-accent))] p-6 lg:h-[220px] lg:shrink-0 lg:rounded-[30px] lg:p-8">
              <Image
                src={`${assetBase}/hero/sub2.jpg`}
                alt=""
                fill
                sizes="(min-width:1024px) 32vw, 100vw"
                className="object-cover"
              />
              <div className="photo-veil" />
              <div className="relative">
                <p className="text-[13px] font-bold tracking-[0.06em] text-white/75 lg:text-[15px]">
                  {t('sub2.cat')}
                </p>
                <p className="mt-2 text-[18px] leading-snug font-bold text-white lg:text-[22px]">
                  {t('sub2.title')}
                </p>
                <p className="mt-1 text-[14px] text-white/85">{t('sub2.desc')}</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
