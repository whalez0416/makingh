// 예약 폼의 시술 선택지. 폼과 CMS 가 같은 목록을 쓰도록 여기 하나만 둔다.
// DB 에는 value 가 저장된다 — 라벨을 저장하면 언어를 바꿀 때마다 값이 달라진다.
export const TREATMENTS = [
  {value: 'signature', label: '시그니처 패키지'},
  {value: 'laser', label: '레이저 리프팅'},
  {value: 'injection', label: '주사 · 스킨부스터'},
  {value: 'hbot', label: '고압산소 치료 HBOT'},
  {value: 'stemBlood', label: '호밍셀 자가혈 줄기세포'},
  {value: 'stemFat', label: '호밍셀 자가지방 줄기세포'},
  {value: 'etc', label: '기타 · 상담 후 결정'}
] as const;

// 진료시간 10:00~20:00 안에서 30분 단위. 실제 가능 여부는 병원이 전화로 확정한다.
export const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
] as const;
