'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Field, inputCls, areaCls} from '@/components/FormField';
import ConsentBox from '@/components/ConsentBox';

// 온라인 상담 — 이름·연락처·내용만. 공개되지 않고 병원 접수함에만 쌓인다.
export default function InquiryForm({kakao}: {kakao: string}) {
  const t = useTranslations('inquiryForm');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [agree, setAgree] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (!agree) {
      setError(t('needConsent'));
      return;
    }
    const fd = new FormData(e.currentTarget);
    setSending(true);
    try {
      const res = await fetch('/api/inquiries/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: fd.get('name'),
          phone: fd.get('phone'),
          message: fd.get('message'),
          agreePrivacy: true,
          website: fd.get('website') || ''
        })
      });
      if (!res.ok) throw new Error(String(res.status));
      setDone(true);
    } catch {
      setError(t('failed'));
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="border-line bg-surface rounded-[16px] border p-8 text-center lg:p-12">
        <p className="card-title text-ink">{t('doneTitle')}</p>
        <p className="text-sub mt-3 text-[14px] leading-relaxed lg:text-[16px]">
          {t('doneDesc')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label={t('name')} required>
          <input name="name" required maxLength={40} className={inputCls} />
        </Field>
        <Field label={t('phone')} required>
          <input
            name="phone"
            required
            type="tel"
            inputMode="tel"
            maxLength={20}
            placeholder="010-0000-0000"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label={t('message')} required>
        <textarea name="message" required maxLength={2000} className={areaCls} />
      </Field>

      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />

      <div className="border-line border-t pt-5">
        <ConsentBox
          label={t('privacy')}
          required
          checked={agree}
          onChange={setAgree}
          detail={t('privacyDetail')}
        />
      </div>

      {error && (
        <p className="text-[14px] text-red-600">
          {error}{' '}
          <a href={kakao} target="_blank" rel="noreferrer" className="underline">
            {t('useKakao')}
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="bg-ink hover:bg-accent h-14 rounded-[8px] text-[16px] font-bold text-white transition-colors disabled:opacity-50"
      >
        {sending ? t('sending') : t('submit')}
      </button>
    </form>
  );
}
