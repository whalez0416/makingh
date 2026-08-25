'use client';

import {useEffect, useState} from 'react';
import {DEFAULT_THEME, THEMES, THEME_META, isTheme, type Theme} from '@/lib/themes';

// Phase 1 비교 전용. 테마 확정되면 이 파일과 layout 의 복원 스크립트를 함께 지운다.
// 기본은 접힌 상태다 — 펼쳐두면 화면 왼쪽 아래 내용(히어로 카드·예약 폼)을 가린다.
export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current && isTheme(current)) setTheme(current);
  }, []);

  const pick = (t: Theme) => {
    document.documentElement.dataset.theme = t;
    localStorage.setItem('vi', t);
    setTheme(t);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 md:bottom-5 md:left-5">
      {open && (
        <div className="border-line bg-surface mb-2 border p-1.5 text-[12px] shadow-sm md:p-2">
          <p className="text-sub hidden px-2 pb-2 md:block">VI 후보 비교</p>
          <div className="flex md:flex-col">
            {THEMES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => pick(t)}
                className={`flex min-h-11 min-w-11 items-center justify-center px-3 transition-colors md:justify-start md:px-3 md:py-2 ${
                  theme === t ? 'bg-ink text-white' : 'text-sub hover:text-ink'
                }`}
              >
                <span className="font-mono uppercase md:mr-2">{t}</span>
                <span className="hidden md:inline">{THEME_META[t].name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="VI 후보 비교"
        className="border-line bg-surface text-sub hover:text-ink flex h-11 w-11 items-center justify-center rounded-full border text-[12px] shadow-sm transition-colors"
      >
        <span className="font-mono uppercase">{theme}</span>
      </button>
    </div>
  );
}
