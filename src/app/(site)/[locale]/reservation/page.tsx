import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {MagHero} from '@/components/Editorial';
import Reveal from '@/components/Reveal';
import ReservationForm from '@/components/ReservationForm';
import {getSettings, type Settings} from '@/lib/settings';
import type {Locale} from '@/i18n/routing';
import {pageMeta} from '@/lib/meta';

// 브리프 서브 /reservation — 예약 신청 폼(Phase 5). 신청을 받고 병원이 전화로 확정한다.
// 카카오톡·전화는 그대로 남긴다. 폼이 막히거나 급한 사람에게는 그쪽이 빠르다.
export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMeta(locale, 'reservation', 'reservation/');
}

export default async function ReservationPage({params}: PageProps<'/[locale]/reservation'>) {
  const {locale} = await params;
  setRequestLocale(locale);

  // 훅(useTranslations)은 async 컴포넌트에서 못 쓴다 → CMS 는 여기서 읽어 내린다.
  const s = await getSettings(locale as Locale);
  return <Content s={s} />;
}

function Content({s}: {s: Settings}) {
  const t = useTranslations('reservationPage');
  const tc = useTranslations('common');

  return (
    <>
      <MagHero en="Reservation" title={t('title')} desc={t('desc')} />

      <section className="px-5 pt-14 pb-20 lg:px-10 lg:pt-[100px] lg:pb-[120px]">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <Reveal>
            <h2 className="h2 text-ink mb-8 lg:mb-10">{t('formTitle')}</h2>
            <ReservationForm kakao={s.kakao} />
          </Reveal>

          <Reveal className="lg:pt-[72px]">
            <p className="eyebrow mb-5">{t('otherTitle')}</p>
            <div className="grid gap-4">
              <a
                href={s.kakao}
                target="_blank"
                rel="noreferrer"
                className="card-fx border-line bg-surface rounded-[16px] border p-6 hover:border-[color:var(--color-accent)]"
              >
                <p className="card-title text-ink">{t('kakaoTitle')}</p>
                <p className="text-sub mt-2 text-[14px]">{t('kakaoDesc')}</p>
                <p className="text-accent mt-5 text-[15px] font-bold">
                  {tc('kakao')} <span aria-hidden>➞</span>
                </p>
              </a>

              <a
                href={s.telHref}
                className="card-fx border-line bg-surface rounded-[16px] border p-6 hover:border-[color:var(--color-accent)]"
              >
                <p className="card-title text-ink">{t('telTitle')}</p>
                <p className="text-ink mt-2 text-[24px] font-bold lg:text-[28px]">{s.tel}</p>
                <p className="text-accent mt-5 text-[15px] font-bold">
                  {tc('call')} <span aria-hidden>➞</span>
                </p>
              </a>
            </div>

            <div className="mt-8">
              <p className="eyebrow mb-4">{t('hoursTitle')}</p>
              <dl>
                {s.hours.map((h) => (
                  <div
                    key={h.days}
                    className="border-line flex justify-between border-b py-3 text-[14px] lg:text-[15px]"
                  >
                    <dt className="text-sub">{h.days}</dt>
                    <dd className="text-ink font-bold">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <Link
              href="/consult"
              className="text-sub hover:text-ink mt-8 inline-block text-[14px] underline underline-offset-4"
            >
              {t('toConsult')} <span aria-hidden>➞</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
