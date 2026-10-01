import {getTranslations} from 'next-intl/server';
import Logo from '@/components/Logo';
import {Link} from '@/i18n/navigation';
import {site} from '@/lib/site';
import {getSettings} from '@/lib/settings';
import type {Locale} from '@/i18n/routing';

// 브리프 §4-12 오시는길 정보 블록 — 주소·지도·대표전화·진료시간은 CMS site-settings 에서 온다.
export default async function Footer({locale}: {locale: Locale}) {
  const t = await getTranslations('footer');
  const s = await getSettings(locale);

  return (
    <footer className="border-line text-sub border-t px-5 py-14 md:px-6 md:py-16 text-[14px]">
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo className="text-ink mb-5 h-9 w-auto" />
          <p>
            {site.name} · {t('director')} {site.director}({site.directorTitle})
          </p>
          <p>
            {t('bizNo')} {site.bizNo}
          </p>
          <p className="mt-4">
            <a href={s.telHref} className="link-fx hover:text-ink">
              T. {s.tel}
            </a>{' '}
            · F. {s.fax}
          </p>
        </div>

        <div>
          <p className="text-ink mb-3">{t('address')}</p>
          <p>{s.address}</p>
          <a
            href={s.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink mt-2 inline-block underline underline-offset-4"
          >
            지도 보기
          </a>
        </div>

        <div>
          <p className="text-ink mb-3">{t('hours')}</p>
          <dl className="grid grid-cols-[3.5rem_1fr] gap-y-1">
            {s.hours.map((h) => (
              <div key={h.days} className="contents">
                <dt>{h.days}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
          <div className="border-line mt-6 flex gap-4 border-t pt-4">
            <Link href="/consult" className="link-fx hover:text-ink">
              {t('consult')}
            </Link>
            <Link href="/notice" className="link-fx hover:text-ink">
              {t('notice')}
            </Link>
            <Link href="/reviews" className="link-fx hover:text-ink">
              {t('reviews')}
            </Link>
          </div>
          <div className="mt-4 flex gap-4">
            <a href={s.instagram} target="_blank" rel="noreferrer" className="link-fx hover:text-ink">
              Instagram
            </a>
            <a href={s.kakao} target="_blank" rel="noreferrer" className="link-fx hover:text-ink">
              KakaoTalk
            </a>
          </div>
        </div>
      </div>
      <p className="border-line mt-12 border-t pt-6 text-[12px]">
        {t('rights')}
      </p>
    </footer>
  );
}
