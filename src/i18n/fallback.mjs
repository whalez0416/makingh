// 브리프 §5: en·zh·ja 는 선택 입력. 비어 있는 키만 ko 로 메운다.
// (얕은 병합이면 부분 번역된 네임스페이스의 형제 키가 통째로 사라진다.)
export function fillFromKo(base, over) {
  const out = {...base};
  for (const [k, v] of Object.entries(over)) {
    const b = out[k];
    // 목록(배열)은 통째로 갈아끼운다. 사전처럼 병합하면 {0:…,1:…} 객체가 되어
    // 화면에서 .map 이 터진다 — en·zh·ja 가 빈 파일일 때는 드러나지 않던 함정.
    const mergeable =
      v && typeof v === 'object' && !Array.isArray(v) &&
      b && typeof b === 'object' && !Array.isArray(b);
    out[k] = mergeable ? fillFromKo(b, v) : v;
  }
  return out;
}
