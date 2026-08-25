import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import InquiryForm from '@/components/InquiryForm';
import {getSettings, type Settings} from '@/lib/settings';
import type {Locale} from '@/i18n/routing';

// 온라인 상담 — 남긴 문의는 공개되지 않고 병원 접수함에만 들어간다.
export default async function ConsultPage({params}: PageProps<'/[locale]/consult'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  const s = await getSettings(locale as Locale);
  return <Content s={s} />;
}

function Content({s}: {s: Settings}) {
  const t = useTranslations('consultPage');
  const tc = useTranslations('common');

  return (
    <>
      <PageHero title={t('title')} desc={t('desc')} en="CONSULT" />

      <section className="px-5 pt-14 pb-20 lg:px-10 lg:pt-[100px] lg:pb-[120px]">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <Reveal>
            <h2 className="h2 text-ink mb-8 lg:mb-10">{t('formTitle')}</h2>
            <InquiryForm kakao={s.kakao} />
          </Reveal>

          <Reveal className="lg:pt-[72px]">
            <p className="eyebrow mb-5">{t('otherTitle')}</p>
            <div className="grid gap-4">
              <a
                href={s.kakao}
                target="_blank"
                rel="noreferrer"
                className="border-line bg-surface rounded-[16px] border p-6 transition-colors hover:border-[color:var(--color-accent)]"
              >
                <p className="card-title text-ink">{tc('kakao')}</p>
                <p className="text-sub mt-2 text-[14px]">{t('kakaoDesc')}</p>
              </a>

              <a
                href={s.telHref}
                className="border-line bg-surface rounded-[16px] border p-6 transition-colors hover:border-[color:var(--color-accent)]"
              >
                <p className="card-title text-ink">{tc('call')}</p>
                <p className="text-ink mt-2 text-[24px] font-bold lg:text-[28px]">{s.tel}</p>
                <p className="text-sub mt-2 text-[14px]">{t('telDesc')}</p>
              </a>
            </div>

            <Link
              href="/reservation"
              className="text-sub hover:text-ink mt-8 inline-block text-[14px] underline underline-offset-4"
            >
              {t('toReservation')} <span aria-hidden>➞</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
