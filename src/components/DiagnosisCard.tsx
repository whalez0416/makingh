import {Link} from '@/i18n/navigation';

// 환자 언어(Q) → 진료(A). Q→A 구조 자체가 AEO 자산이라 마크업을 흐트러뜨리지 않는다.
export default function DiagnosisCard({
  index,
  question,
  answer,
  href
}: {
  index: number;
  question: string;
  answer: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="border-line bg-surface rounded-card hover:border-accent group flex flex-col justify-between border p-7 transition-colors"
    >
      <p className="eyebrow mb-5">{String(index).padStart(2, '0')}</p>
      <p className="text-ink text-[17px] leading-relaxed">“{question}”</p>
      <p className="text-accent group-hover:text-ink mt-8 flex items-center gap-2 text-[15px] transition-colors">
        {answer}
        <span aria-hidden>→</span>
      </p>
    </Link>
  );
}
