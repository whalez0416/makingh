import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Reveal from '@/components/Reveal';
import SectionHeader from '@/components/SectionHeader';
import PackageRow from '@/components/PackageRow';

// 브리프 §4-5 시그니처 패키지 프리뷰 — 번호 인덱스 리스트 5개 + 전체보기.
const PREVIEW_COUNT = 5;

function MoreLink({label}: {label: string}) {
  return (
    <Link
      href="/signature"
      className="text-ink hover:text-accent inline-flex items-center gap-2 text-[15px] font-bold transition-colors lg:text-[17px]"
    >
      {label} <span aria-hidden>➞</span>
    </Link>
  );
}

export default function Packages() {
  const t = useTranslations('packages');
  const items = t.raw('items') as {name: string; tagline: string}[];

  return (
    <section className="px-5 py-24 lg:px-10 lg:py-[160px]">
      <SectionHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        right={<MoreLink label={t('more')} />}
      />
      <Reveal className="border-line border-t">
        {items.slice(0, PREVIEW_COUNT).map((item, i) => (
          <PackageRow
            key={item.name}
            no={i + 1}
            name={item.name}
            tagline={item.tagline}
            href="/signature"
          />
        ))}
      </Reveal>
      <div className="mt-8 flex justify-center lg:hidden">
        <MoreLink label={t('more')} />
      </div>
    </section>
  );
}
