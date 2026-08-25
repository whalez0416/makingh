import {use} from 'react';
import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import {site, telHref} from '@/lib/site';

// 브리프 서브 /reservation — Phase 5(예약 시스템) 전까지 카카오톡·전화 예약 안내.
export default function ReservationPage({params}: PageProps<'/[locale]/reservation'>) {
  const {locale} = use(params);
  setRequestLocale(locale);

  return <Content />;
}

function Content() {
  const t = useTranslations('reservationPage');
  const tc = useTranslations('common');

  return (
    <>
      <PageHero title={t('title')} desc={t('desc')} en="RESERVATION" />
      <section className="px-5 pt-14 pb-24 lg:px-10 lg:pt-[100px] lg:pb-[160px]">
        <Reveal className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <a
            href={site.kakao}
            target="_blank"
            rel="noreferrer"
            className="border-line bg-surface group rounded-[16px] border p-6 transition-colors hover:border-[color:var(--color-accent)] lg:p-10"
          >
            <p className="card-title text-ink">{t('kakaoTitle')}</p>
            <p className="text-sub mt-2 text-[14px] lg:text-[16px]">
              {t('kakaoDesc')}
            </p>
            <p className="text-accent mt-6 text-[15px] font-bold lg:mt-10">
              {tc('kakao')} <span aria-hidden>➞</span>
            </p>
          </a>

          <a
            href={telHref}
            className="border-line bg-surface group rounded-[16px] border p-6 transition-colors hover:border-[color:var(--color-accent)] lg:p-10"
          >
            <p className="card-title text-ink">{t('telTitle')}</p>
            <p className="text-ink mt-2 text-[24px] font-bold lg:text-[32px]">
              {site.tel}
            </p>
            <p className="text-accent mt-6 text-[15px] font-bold lg:mt-10">
              {tc('call')} <span aria-hidden>➞</span>
            </p>
          </a>
        </Reveal>

        <Reveal className="mt-10 lg:mt-16">
          <p className="eyebrow mb-4">{t('hoursTitle')}</p>
          <dl className="max-w-[420px]">
            {site.hours.map((h) => (
              <div
                key={h.days}
                className="border-line flex justify-between border-b py-3 text-[14px] lg:text-[16px]"
              >
                <dt className="text-sub">{h.days}</dt>
                <dd className="text-ink font-bold">{h.time}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>
    </>
  );
}
