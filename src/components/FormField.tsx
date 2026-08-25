// 폼 입력 한 칸. 라벨·필수표시·에러문구를 한 군데서 그린다.
export function Field({
  label,
  required,
  children
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sub mb-2 block text-[13px] lg:text-[14px]">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}

// 터치 타깃 44px 이상 (브리프 §3 반응형).
export const inputCls =
  'border-line bg-surface text-ink focus:border-accent h-12 w-full rounded-[8px] border px-4 text-[15px] outline-none transition-colors';
export const areaCls =
  'border-line bg-surface text-ink focus:border-accent min-h-[120px] w-full rounded-[8px] border p-4 text-[15px] outline-none transition-colors';
