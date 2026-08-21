'use client';

import {useEffect, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {nav, site} from '@/lib/site';

const LOCALE_LABEL: Record<string, string> = {
  ko: 'KO',
  en: 'EN',
  zh: '中文',
  ja: '日本語'
};

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 오버레이가 열린 동안 뒤 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const localeLinks = (cls: string, active: string, inactive = 'hover:text-ink') =>
    routing.locales.map((l) => (
      <Link
        key={l}
        href={pathname}
        locale={l}
        onClick={() => setOpen(false)}
        className={`${cls} ${l === locale ? active : inactive}`}
      >
        {LOCALE_LABEL[l]}
      </Link>
    ));

  // 홈 최상단은 풀스크린 히어로 사진 위라 헤더를 화이트 톤으로 (스크롤·오버레이 시 원복)
  const overHero = pathname === '/' && !solid && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid || open
          ? 'bg-bg/95 border-line border-b backdrop-blur'
          : 'bg-transparent'
      }`}
    >
      <div className="flex h-14 items-center gap-4 px-5 lg:h-20 lg:gap-8 lg:px-10">
        <button
          type="button"
          aria-label="메뉴"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`-ml-2 flex h-11 w-11 items-center justify-center lg:hidden ${overHero ? 'text-white' : 'text-ink'}`}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`${overHero ? 'bg-white' : 'bg-ink'} absolute left-0 block h-px w-5 transition-transform ${
                open ? 'top-2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`${overHero ? 'bg-white' : 'bg-ink'} absolute top-2 left-0 block h-px w-5 transition-opacity ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`${overHero ? 'bg-white' : 'bg-ink'} absolute left-0 block h-px w-5 transition-transform ${
                open ? 'top-2 -rotate-45' : 'top-4'
              }`}
            />
          </span>
        </button>

        <Link
          href="/"
          onClick={() => setOpen(false)}
          className={`text-[17px] font-bold tracking-[0.22em] transition-colors lg:text-[20px] ${
            overHero ? 'text-white' : 'text-ink'
          }`}
        >
          {site.nameEn}
        </Link>

        <nav
          className={`ml-4 hidden items-center gap-7 text-[15px] lg:flex ${
            overHero ? 'text-white/80' : 'text-sub'
          }`}
        >
          {nav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`transition-colors ${overHero ? 'hover:text-white' : 'hover:text-ink'}`}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <div
            className={`hidden items-center gap-3 text-[12px] tracking-wider lg:flex ${
              overHero ? 'text-white/70' : 'text-sub'
            }`}
          >
            {localeLinks(
              'transition-colors',
              overHero ? 'text-white' : 'text-ink',
              overHero ? 'hover:text-white' : 'hover:text-ink'
            )}
          </div>
          {/* 예약 CTA 는 모바일에서도 유지 */}
          <a
            href={site.kakao}
            target="_blank"
            rel="noreferrer"
            className={`flex h-11 items-center rounded-[8px] px-4 text-[13px] transition-colors lg:px-5 lg:text-[15px] ${
              overHero
                ? 'text-ink hover:bg-accent bg-white hover:text-white'
                : 'bg-ink hover:bg-accent text-white'
            }`}
          >
            {t('common.reserve')}
          </a>
        </div>
      </div>

      {/* 모바일 풀스크린 오버레이 */}
      {open && (
        <div className="bg-bg fixed inset-0 top-14 z-40 flex flex-col px-5 pt-6 pb-10 lg:hidden">
          <nav className="flex flex-col">
            {nav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-line text-ink flex min-h-14 items-center border-b text-[20px] font-bold"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>
          <div className="text-sub mt-auto flex gap-2 pt-10 text-[14px]">
            {localeLinks(
              'flex min-h-11 min-w-11 items-center justify-center px-3 transition-colors',
              'text-ink border-line border'
            )}
          </div>
        </div>
      )}
    </header>
  );
}
