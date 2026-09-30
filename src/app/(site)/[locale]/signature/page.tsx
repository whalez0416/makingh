import {use} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import SignatureBody from '@/components/SignatureBody';
import ConsultBanner from '@/components/ConsultBanner';
import Reveal from '@/components/Reveal';
import {assetBase} from '@/lib/site';
import {getSettings} from '@/lib/settings';
import {italic, serifKr} from '@/lib/serif';
import {pageMeta} from '@/lib/meta';

// 브리프 서브 /signature — 패키지 13종.
// 2026-09-30 재구성: 매거진 시안 A(사진+주석, 세 챕터, 명조) + 고민 가이드 시안 C(고민 버튼, 상담 4단계).
export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMeta(locale, 'signature', 'signature/');
}

export default function SignaturePage({params}: PageProps<'/[locale]/signature'>) {
  const {locale} = use(params);
  setRequestLocale(locale);
  const s = use(getSettings());

  return <Content kakao={s.kakao} />;
}

function Content({kakao}: {kakao: string}) {
  const t = useTranslations('signaturePage');
  const tp = useTranslations('packages');
  const td = useTranslations('doctor');
  const steps = t.raw('steps') as {t: string; d: string}[];

  return (
    <div className={`${serifKr.variable} ${italic.variable}`}>
      <SignatureBody
        items={tp.raw('items') as {name: string; tagline: string; desc: string}[]}
        kakao={kakao}
        t={{
          eyebrow: t('eyebrow'),
          headline: t('headline'),
          lead: t('lead'),
          spots: t.raw('spots'),
          concernQ: t('concernQ'),
          concerns: t.raw('concerns'),
          concernHint: t('concernHint'),
          groups: t.raw('groups'),
          badge: t('badge'),
          ask: t('ask')
        }}
      />

      {/* 상담 4단계 (시안 C) — 원장 사진·인용은 의료진 섹션 문구 그대로 */}
      <section className="px-5 pb-16 lg:px-10 lg:pb-[100px]">
        <Reveal className="bg-surface grid gap-8 rounded-[24px] p-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center lg:gap-14 lg:rounded-[30px] lg:p-12">
          <div className="relative aspect-[4/5] w-full max-w-[260px] overflow-hidden rounded-[18px]">
            <Image src={`${assetBase}/facility/doctor.jpg`} alt={`${td('title')} ${td('sub')}`} fill sizes="260px" className="object-cover object-top" />
          </div>
          <div>
            <h2 className="sig-serif text-ink text-[24px] lg:text-[32px]">{t('processTitle')}</h2>
            <p className="text-sub mt-4 max-w-[640px] text-[15px] leading-relaxed whitespace-pre-line break-keep">{td('quote')}</p>
            <p className="text-ink mt-3 text-[14px] font-bold">
              {td('title')} <span className="text-sub font-normal">{td('sub')}</span>
            </p>
            <ol className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.t} className="border-ink border-t-2 pt-3">
                  <span className="text-accent text-[11px] font-bold tracking-[0.08em]">STEP {i + 1}</span>
                  <b className="text-ink mt-1 block text-[15px]">{s.t}</b>
                  <span className="text-sub text-[13px]">{s.d}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </section>

      <ConsultBanner title={t('consultTitle')} desc={t('consultDesc')} />
    </div>
  );
}
