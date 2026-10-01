'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {TREATMENTS, TIME_SLOTS} from '@/lib/treatments';
import {Field, inputCls, areaCls} from '@/components/FormField';
import ConsentBox from '@/components/ConsentBox';
import BtnLabel from '@/components/BtnLabel';

// 브리프 Phase 5 — 예약 신청. 병원이 접수함에서 보고 전화로 확정한다.
// 제출은 Payload REST 로 보낸다. 서버가 없는 정적 사본에서는 실패하고 카톡 안내로 떨어진다.
export default function ReservationForm({kakao}: {kakao: string}) {
  const t = useTranslations('reservationForm');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [agree, setAgree] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // 오늘 이전 날짜는 못 고른다.
  const today = new Date().toISOString().slice(0, 10);

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
      const res = await fetch('/api/reservations/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: fd.get('name'),
          phone: fd.get('phone'),
          treatment: fd.get('treatment'),
          gender: fd.get('gender') || undefined,
          preferredDate: fd.get('preferredDate'),
          preferredTime: fd.get('preferredTime'),
          message: fd.get('message') || undefined,
          agreePrivacy: true,
          agreeMarketing: marketing,
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

      <div className="grid gap-5 md:grid-cols-2">
        <Field label={t('treatment')} required>
          <select name="treatment" required defaultValue="" className={inputCls}>
            <option value="" disabled>
              {t('choose')}
            </option>
            {TREATMENTS.map((tr) => (
              <option key={tr.value} value={tr.value}>
                {tr.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t('gender')}>
          <select name="gender" defaultValue="" className={inputCls}>
            <option value="">{t('choose')}</option>
            <option value="female">{t('female')}</option>
            <option value="male">{t('male')}</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label={t('date')} required>
          <input name="preferredDate" required type="date" min={today} className={inputCls} />
        </Field>
        <Field label={t('time')} required>
          <select name="preferredTime" required defaultValue="" className={inputCls}>
            <option value="" disabled>
              {t('choose')}
            </option>
            {TIME_SLOTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={t('message')}>
        <textarea name="message" maxLength={1000} className={areaCls} />
      </Field>

      {/* 허니팟 — 사람에게는 안 보인다. 채워져 오면 봇으로 보고 거른다. */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />

      <div className="border-line grid gap-3 border-t pt-5">
        <ConsentBox
          label={t('privacy')}
          required
          checked={agree}
          onChange={setAgree}
          detail={t('privacyDetail')}
        />
        <ConsentBox
          label={t('marketing')}
          checked={marketing}
          onChange={setMarketing}
          detail={t('marketingDetail')}
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
        className="btn-fx bg-ink h-14 rounded-[8px] text-[16px] font-bold text-white disabled:opacity-50"
      >
        <BtnLabel>{sending ? t('sending') : t('submit')}</BtnLabel>
      </button>

      <p className="text-sub text-center text-[13px]">{t('confirmNote')}</p>
    </form>
  );
}
