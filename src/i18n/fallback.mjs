// 브리프 §5: en·zh·ja 는 선택 입력. 비어 있는 키만 ko 로 메운다.
// (얕은 병합이면 부분 번역된 네임스페이스의 형제 키가 통째로 사라진다.)
export function fillFromKo(base, over) {
  const out = {...base};
  for (const [k, v] of Object.entries(over)) {
    const b = out[k];
    out[k] =
      v && typeof v === 'object' && b && typeof b === 'object'
        ? fillFromKo(b, v)
        : v;
  }
  return out;
}
