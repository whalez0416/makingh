'use client';

import {useState} from 'react';

// 개인정보 수집·이용 동의. 무엇을 왜 받는지 펼쳐 볼 수 있어야 한다.
export default function ConsentBox({
  label,
  required,
  checked,
  onChange,
  detail
}: {
  label: string;
  required?: boolean;
  checked: boolean;
  onChange: (v: boolean) => void;
  detail: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex min-h-11 items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="accent-accent h-5 w-5 shrink-0"
        />
        <span
          className="text-ink cursor-pointer text-[14px]"
          onClick={() => onChange(!checked)}
        >
          {label}
          <span className="text-sub ml-1">({required ? '필수' : '선택'})</span>
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-sub hover:text-ink ml-auto shrink-0 text-[13px] underline underline-offset-4"
        >
          {open ? '접기' : '보기'}
        </button>
      </div>
      {open && (
        <p className="border-line text-sub mt-2 rounded-[8px] border p-4 text-[13px] leading-relaxed whitespace-pre-line">
          {detail}
        </p>
      )}
    </div>
  );
}
