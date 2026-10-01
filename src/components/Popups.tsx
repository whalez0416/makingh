import Image from 'next/image';
import {RichText} from '@payloadcms/richtext-lexical/react';
import {getTranslations} from 'next-intl/server';
import {cmsFind} from '@/lib/cms';
import type {Locale} from '@/i18n/routing';
import type {Popup} from '@/payload-types';
import PopupModal, {type PopupItem} from './PopupModal';
import BtnLabel from '@/components/BtnLabel';

// 브리프 §5 popups. 켜 둔 것만 내려보내고, 기간 판정·닫기 기억은 브라우저가 한다.
export default async function Popups({locale}: {locale: Locale}) {
  const t = await getTranslations('popup');
  const docs = await cmsFind<Popup>({
    collection: 'popups',
    locale,
    where: {enabled: {equals: true}},
    sort: '-startAt',
    limit: 10,
    depth: 1
  });

  if (docs.length === 0) return null;

  const items: PopupItem[] = docs.map((p) => {
    const img = typeof p.image === 'object' && p.image?.url ? p.image : null;
    return {
      id: p.id,
      startAt: p.startAt,
      endAt: p.endAt,
      link: p.link,
      node: (
        <div>
          {img ? (
            <Image
              src={img.url!}
              alt={img.alt || p.title}
              width={img.width || 840}
              height={img.height || 840}
              className="w-full"
            />
          ) : null}
          <div className="px-6 py-6">
            <h2 className="card-title text-ink">{p.title}</h2>
            {p.body ? (
              <div className="rich text-sub mt-3 text-[14px] leading-relaxed">
                <RichText data={p.body} />
              </div>
            ) : null}
            {p.link ? (
              <a
                href={p.link}
                className="btn-fx btn-fx-ink border-line text-ink hover:text-bg mt-5 flex h-12 items-center justify-center rounded-[8px] border text-[14px]"
              >
                <BtnLabel>{t('more')}</BtnLabel>
              </a>
            ) : null}
          </div>
        </div>
      )
    };
  });

  return <PopupModal items={items} />;
}
