import {useTranslations} from 'next-intl';
import {site, telHref} from '@/lib/site';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-line text-sub border-t px-5 py-14 md:px-6 md:py-16 text-[14px]">
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-ink mb-4 text-[19px] font-bold tracking-[0.22em]">
            {site.nameEn}
          </p>
          <p>
            {site.name} · {t('director')} {site.director}({site.directorTitle})
          </p>
          <p>
            {t('bizNo')} {site.bizNo}
          </p>
          <p className="mt-4">
            <a href={telHref} className="hover:text-ink">
              T. {site.tel}
            </a>{' '}
            · F. {site.fax}
          </p>
        </div>

        <div>
          <p className="text-ink mb-3">{t('address')}</p>
          <p>{site.address}</p>
          <a
            href={site.mapUrl}
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
            {site.hours.map((h) => (
              <div key={h.days} className="contents">
                <dt>{h.days}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex gap-4">
            <a href={site.instagram} target="_blank" rel="noreferrer" className="hover:text-ink">
              Instagram
            </a>
            <a href={site.kakao} target="_blank" rel="noreferrer" className="hover:text-ink">
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
