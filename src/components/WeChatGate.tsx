'use client';

import {useEffect, useRef, useState} from 'react';

// 중국어(간체·번체) 페이지 전용 — 상담 링크(카카오톡 채널)를 누르면 위챗 창으로 바꿔 준다 (2026-10-01).
// 카카오 링크를 쓰는 곳(헤더·첫 화면·배너·떠 있는 버튼·하단·폼 안내)을 하나하나 고치지 않고, 여기서 클릭을 가로챈다.
// 위챗은 웹에서 바로 친구 추가가 안 돼 QR·위챗 ID 를 보여 준다. 관리자 "병원 기본정보"에 위챗이 아직 없으면 상담 폼으로 보낸다.
export default function WeChatGate({
  kakao,
  wechatId,
  qr,
  consultHref,
  t
}: {
  kakao: string;
  wechatId?: string;
  qr?: string;
  consultHref: string;
  t: {title: string; desc: string; idLabel: string; copy: string; copied: string; close: string};
}) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  const ready = Boolean(wechatId || qr);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || !kakao || !a.href.startsWith(kakao)) return;
      e.preventDefault();
      if (!ready) {
        window.location.href = consultHref;
        return;
      }
      setCopied(false);
      dlg.current?.showModal();
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [kakao, ready, consultHref]);

  if (!ready) return null;
  return (
    <dialog
      ref={dlg}
      className="bg-surface text-ink m-auto w-[min(92vw,360px)] rounded-[16px] p-0 backdrop:bg-black/60"
      onClick={(e) => e.target === dlg.current && dlg.current?.close()}
    >
      <div className="grid justify-items-center gap-4 px-6 pt-7 pb-6 text-center">
        <p className="text-[19px] font-bold">{t.title}</p>
        <p className="text-sub text-[14px] leading-relaxed">{t.desc}</p>
        {/* eslint-disable-next-line @next/next/no-img-element -- 관리자가 올린 QR 그대로 */}
        {qr && <img src={qr} alt="WeChat QR" className="border-line h-[200px] w-[200px] rounded-[8px] border object-contain" />}
        {wechatId && (
          <div className="grid gap-2">
            <p className="text-sub text-[13px]">
              {t.idLabel} <b className="text-ink text-[16px]">{wechatId}</b>
            </p>
            <button
              type="button"
              className="echo bg-ink hover:bg-accent h-11 rounded-[8px] px-6 text-[14px] font-bold text-white transition-colors"
              onClick={() => navigator.clipboard?.writeText(wechatId).then(() => setCopied(true), () => {})}
            >
              {copied ? t.copied : t.copy}
            </button>
          </div>
        )}
        <button type="button" className="text-sub mt-1 text-[14px] underline underline-offset-4" onClick={() => dlg.current?.close()}>
          {t.close}
        </button>
      </div>
    </dialog>
  );
}
