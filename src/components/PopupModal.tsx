'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {isLive} from '@/lib/popup';

export type PopupItem = {
  id: number;
  startAt: string;
  endAt: string;
  link?: string | null;
  node: React.ReactNode;
};

// localStorage 는 사생활 보호 모드에서 던진다 — 팝업 하나 때문에 페이지가 죽으면 안 된다.
const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};

export default function PopupModal({items}: {items: PopupItem[]}) {
  const t = useTranslations('popup');
  const [open, setOpen] = useState<PopupItem | null>(null);

  // 기간 판정은 브라우저에서 한다. 페이지가 빌드 시점에 굳는 정적 사이트라
  // 서버에서 걸러 두면 "지난 팝업"이 그대로 박제된다.
  useEffect(() => {
    const now = Date.now();
    const today = new Date().toDateString();
    // 브리프 §3: 동시 다중 팝업 금지 — 기간에 든 것 중 최신 하나만 보고 끝낸다.
    // 닫힌 것을 건너뛰고 다음 팝업을 띄우면 새로고침마다 하나씩 더 나와 성가시다.
    const live = items.find((p) => isLive(p, now));
    if (live && read(`popup:${live.id}`) !== today) setOpen(live);
  }, [items]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const hideToday = () => {
    write(`popup:${open.id}`, new Date().toDateString());
    setOpen(null);
  };

  const btn =
    'text-sub hover:text-ink flex h-12 flex-1 items-center justify-center text-[14px] transition-colors';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('label')}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label={t('close')}
        onClick={() => setOpen(null)}
        className="absolute inset-0 bg-black/60"
      />
      <div className="bg-surface border-line relative w-full max-w-[420px] overflow-hidden rounded-[10px] border shadow-2xl">
        <div className="max-h-[70vh] overflow-y-auto">{open.node}</div>
        <div className="border-line flex border-t">
          <button type="button" onClick={hideToday} className={btn}>
            {t('today')}
          </button>
          <button type="button" onClick={() => setOpen(null)} className={`${btn} border-line border-l`}>
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
