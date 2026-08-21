import {use} from 'react';
import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import PageHero from '@/components/PageHero';
import PackageRow from '@/components/PackageRow';
import ConsultBanner from '@/components/ConsultBanner';
import Reveal from '@/components/Reveal';

// 브리프 서브 /signature — 패키지 13종 번호 인덱스 리스트.
export default function SignaturePage({params}: PageProps<'/[locale]/signature'>) {
  const {locale} = use(params);
  setRequestLocale(locale);

  return <Content />;
}

function Content() {
  const t = useTranslations('signaturePage');
  const tp = useTranslations('packages');
  const items = tp.raw('items') as {name: string; tagline: string; desc: string}[];

  return (
    <>
      <PageHero title={t('title')} desc={t('desc')} en="SIGNATURE" />
      <section className="px-5 pt-14 pb-10 lg:px-10 lg:pt-[100px] lg:pb-[80px]">
        <Reveal className="border-line border-t">
          {items.map((item, i) => (
            <PackageRow
              key={item.name}
              no={i + 1}
              name={item.name}
              tagline={item.tagline}
              desc={item.desc}
            />
          ))}
        </Reveal>
      </section>
      <ConsultBanner />
    </>
  );
}
