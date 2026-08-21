import Image from 'next/image';
import {useTranslations} from 'next-intl';
import HeroHeadline from '@/components/HeroHeadline';
import {assetBase} from '@/lib/site';

// 2026-08-21 개편: 대형 히어로 사진 한 장(헤드라인 오버레이) + 그 아래 클리닉 3카드 벤토.
// 벤토 비율은 beauwell 실측(좌 884 + gap 24 + 우 452, 우측 504/220) 유지.
// 사진은 병원 수급 전 임시 스톡 — public/hero/ 파일만 교체하면 된다.
export default function Hero() {
  const t = useTranslations('hero');
  const headlines = t.raw('headlines') as {lead: string; tail: string}[];

  return (
    <section className="px-5 pt-[76px] lg:px-10 lg:pt-[110px]">
      {/* 대형 히어로 — 이미지 한 장 + 헤드라인 */}
      <div className="relative flex min-h-[440px] items-end overflow-hidden rounded-[20px] p-6 lg:min-h-[620px] lg:rounded-[30px] lg:p-12">
        <Image
          src={`${assetBase}/hero/main.jpg`}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="photo-veil" />
        <div className="relative w-full">
          <HeroHeadline items={headlines} />
        </div>
      </div>

      {/* 클리닉 3카드 벤토 */}
      <div className="mt-4 flex flex-col gap-4 lg:mt-6 lg:h-[748px] lg:flex-row lg:gap-6">
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
  );
}
