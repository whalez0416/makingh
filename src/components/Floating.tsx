'use client';

import {useTranslations} from 'next-intl';


// 브리프 §4: 카톡·전화·TOP 셋만. 과다 플로팅 금지.
export default function Floating({kakao, telHref}: {kakao: string; telHref: string}) {
  const t = useTranslations('common');
  const cls =
    'float-fx border-line bg-surface text-sub hover:text-ink rounded-[8px] flex h-11 w-11 md:h-12 md:w-12 items-center justify-center border text-[11px]';

  return (
    <div className="fixed right-4 bottom-4 md:right-5 md:bottom-5 z-40 flex flex-col gap-2">
      <a href={kakao} target="_blank" rel="noreferrer" className={cls} title={t('kakao')}>
        톡
      </a>
      <a href={telHref} className={cls} title={t('call')}>
        전화
      </a>
      <button
        type="button"
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        className={cls}
        title={t('top')}
      >
        TOP
      </button>
    </div>
  );
}
