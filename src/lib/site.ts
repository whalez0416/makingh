// 브리프 §7 고정 정보. Phase 2 에서 Payload global `site-settings` 로 옮긴다.
// 모든 tel: 링크는 반드시 여기서 가져온다 (§6-2 더미 번호 금지).
export const site = {
  name: '디토셀의원',
  nameEn: 'DITTOCELL',
  director: '성용완',
  directorTitle: '의학박사',
  bizNo: '140-90-04585',
  address: '서울 강남구 언주로 554, 3층',
  tel: '02.564.7774',
  fax: '02.564.7775',
  mapUrl: 'https://map.naver.com/p/search/서울 강남구 언주로 554',
  kakao: 'https://pf.kakao.com/_EGEgn',
  instagram: 'https://instagram.com/ditto.cell',
  hours: [
    {days: '월·금', time: '10:00 – 20:00'},
    {days: '화·수', time: '10:00 – 19:00'},
    {days: '토', time: '10:00 – 16:00'},
    {days: '점심', time: '13:00 – 14:00'},
    {days: '목·일', time: '휴진'}
  ]
} as const;

export const telHref = `tel:+82-2-564-7774`;

export const nav = [
  {key: 'signature', href: '/signature'},
  {key: 'antiAging', href: '/anti-aging'},
  {key: 'stemCell', href: '/stem-cell'},
  {key: 'about', href: '/about'},
  {key: 'reservation', href: '/reservation'}
] as const;
