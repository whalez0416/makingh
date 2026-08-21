import Image from 'next/image';
import {useTranslations} from 'next-intl';
import HeroHeadline from '@/components/HeroHeadline';

// 레이아웃은 beauwell.kr 실측 (docs/beauwell-analysis.md §1):
// 1440 에서 좌 884 + gap 24 + 우 452, 우측은 504 / 220 상하 분할.
// 768 이하에서는 세로로 쌓인다.
// 사진은 병원 수급 전까지 임시 스톡(Unsplash). 병원 사진 오면 public/hero/ 3장만 교체.
// 그라데이션 배경은 로딩 중 폴백으로 남겨둔다.
export default function Hero() {
  const t = useTranslations('hero');
  const headlines = t.raw('headlines') as {lead: string; tail: string}[];

  return (
    <section className="px-5 pt-[76px] lg:px-10 lg:pt-[110px]">
      <div className="flex flex-col gap-4 lg:h-[748px] lg:flex-row lg:gap-6">
        {/* 좌: 헤드라인 + 큰 카드 (884 / 1360) */}
        <div className="flex flex-col lg:flex-[884]">
          <HeroHeadline items={headlines} />

          <article className="relative mt-6 flex min-h-[300px] flex-1 items-end overflow-hidden rounded-[20px] bg-[linear-gradient(150deg,var(--color-line),var(--color-accent)_58%,var(--color-ink))] p-6 lg:mt-[37px] lg:rounded-[30px] lg:p-10">
            <Image
              src="/hero/main.jpg"
              alt=""
              fill
              priority
              sizes="(min-width:1024px) 62vw, 100vw"
              className="object-cover"
            />
            <div className="photo-veil" />
            <div className="relative">
              <p className="text-accent text-[15px] font-bold lg:text-[18px]">
                {t('main.cat')}
              </p>
              <p className="card-title mt-2 text-white">{t('main.title')}</p>
              <p className="mt-2 text-[14px] text-white/85 lg:text-[16px]">
                {t('main.desc')}
              </p>
            </div>
          </article>
        </div>

        {/* 우: 504 / 220 (452 / 1360) */}
        <div className="flex flex-col gap-4 lg:flex-[452] lg:gap-6">
          <article className="relative flex min-h-[240px] items-end overflow-hidden rounded-[20px] bg-[linear-gradient(165deg,var(--color-line),var(--color-accent)_70%,var(--color-ink))] p-6 lg:h-[504px] lg:rounded-[30px] lg:p-10">
            <Image
              src="/hero/sub1.jpg"
              alt=""
              fill
              sizes="(min-width:1024px) 32vw, 100vw"
              className="object-cover"
            />
            <div className="photo-veil" />
            <div className="relative">
              <p className="text-accent text-[15px] font-bold lg:text-[18px]">
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

          <article className="relative flex min-h-[180px] items-end overflow-hidden rounded-[20px] bg-[linear-gradient(120deg,var(--color-ink),var(--color-accent))] p-6 lg:h-[220px] lg:rounded-[30px] lg:p-8">
            <Image
              src="/hero/sub2.jpg"
              alt=""
              fill
              sizes="(min-width:1024px) 32vw, 100vw"
              className="object-cover"
            />
            <div className="photo-veil" />
            <div className="relative">
              <p className="text-accent text-[15px] font-bold lg:text-[18px]">
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
