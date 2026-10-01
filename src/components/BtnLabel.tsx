// 버튼 글자 — 마우스를 올리면 글자가 위로 굴러가고 같은 글자(ditto)가 아래에서 올라온다. 모양은 globals.css .btn-fx
export default function BtnLabel({children}: {children: string}) {
  return (
    <span className="btn-label" data-t={children}>
      <span>{children}</span>
    </span>
  );
}
