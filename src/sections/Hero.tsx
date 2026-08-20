import {useTranslations} from 'next-intl';
import ConsultCta from '@/components/ConsultCta';
import DittoMark from '@/components/DittoMark';
import CellSymbol from '@/components/CellSymbol';

// Phase 1: 세 안을 모두 심고 CSS 가 현재 테마 것만 보여준다 (globals.css).
// 확정되면 나머지 두 함수와 그 CSS 규칙을 지운다.
export default function Hero() {
  return (
    <>
      <HeroA />
      <HeroB />
      <HeroC />
    </>
  );
}

const shell =
  'relative flex min-h-screen items-center overflow-hidden px-5 pt-20 md:px-6 md:pt-24';

function HeroA() {
  const t = useTranslations('hero.a');
  return (
    <section data-hero="a" className={shell}>
      {/* 모바일에서는 워터마크를 줄이고 투명도를 낮춘다 */}
      <DittoMark className="text-accent pointer-events-none absolute -top-[4vw] right-[-2vw] text-[62vw] opacity-[0.07] md:-top-[6vw] md:right-[2vw] md:text-[46vw] md:opacity-[0.13]" />
      <div className="relative mx-auto w-full max-w-[1180px]">
        <p className="eyebrow mb-5 md:mb-7">{t('eyebrow')}</p>
        <h1 className="display text-ink text-[clamp(28px,7.4vw,62px)] leading-[1.34]">
          {t('lead')}
          <br />
          <DittoMark className="text-accent mr-2 align-[-0.08em] text-[0.9em] italic md:mr-3" />
          {t('tail')}
        </h1>
        <p className="text-sub mt-6 max-w-[36rem] text-[15px] leading-relaxed whitespace-pre-line md:mt-8 md:text-[16px]">
          {t('sub')}
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-8 md:mt-12">
          <ConsultCta label={t('secondary')} variant="underline" />
        </div>
      </div>
    </section>
  );
}

function HeroB() {
  const t = useTranslations('hero.b');
  return (
    <section data-hero="b" className={shell}>
      {/* 도트 그리드는 모바일에서도 유지, 서클 장식만 축소 */}
      <div className="dotgrid pointer-events-none absolute inset-0" />
      <CellSymbol className="text-accent spin-slow pointer-events-none absolute top-[16%] right-[-18vw] w-[62vw] opacity-15 md:top-1/2 md:right-[-8vw] md:w-[46vw] md:-translate-y-1/2 md:opacity-25" />
      <div className="relative mx-auto w-full max-w-[1180px]">
        <p className="eyebrow border-line bg-surface mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-2 md:mb-7 md:px-4">
          <span className="bg-accent inline-block h-1.5 w-1.5 shrink-0 rounded-full" />
          {t('badge')}
        </p>
        <h1 className="display text-ink text-[clamp(28px,7vw,60px)] leading-[1.2]">
          {t('lead')}
          <br />
          {t('tail')}
        </h1>
        <p className="text-sub mt-6 max-w-[38rem] text-[15px] leading-relaxed whitespace-pre-line md:mt-8 md:text-[16px]">
          {t('sub')}
        </p>
        <div className="mt-9 md:mt-12">
          <ConsultCta label={t('secondary')} />
        </div>
      </div>
    </section>
  );
}

function HeroC() {
  const t = useTranslations('hero.c');
  return (
    <section
      data-hero="c"
      className="relative flex min-h-screen flex-col md:grid md:grid-cols-[1fr_0.9fr] md:items-center"
    >
      {/* 사진이 주인공인 테마라 모바일에서도 숨기지 않는다 — 위로 올려 상하 스택 */}
      <div className="relative order-1 h-[42vh] w-full shrink-0 bg-[linear-gradient(150deg,#EFE6DA,#DFD2C2_55%,#CFBEA9)] md:order-2 md:h-auto md:self-stretch">
        <CellSymbol
          filled
          className="text-ink/25 absolute bottom-[-38px] left-6 w-[110px] md:bottom-[8%] md:left-[-70px] md:w-[150px]"
        />
      </div>
      <div className="order-2 px-5 pt-14 pb-16 md:order-1 md:px-0 md:pt-28 md:pl-[7vw]">
        <p className="eyebrow mb-5 md:mb-6">{t('eyebrow')}</p>
        <h1 className="display text-ink text-[clamp(26px,6.4vw,50px)]">
          {t('lead')}
          <br />
          {t('tail')}
        </h1>
        <p className="text-sub mt-6 max-w-[30rem] text-[15px] leading-relaxed md:mt-8">
          {t('sub')}
        </p>
        <div className="mt-9 md:mt-12">
          <ConsultCta label={t('secondary')} variant="underline" />
        </div>
      </div>
    </section>
  );
}
