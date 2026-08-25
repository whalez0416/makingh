import type {GlobalConfig} from 'payload';

// 브리프 §5 globals site-settings — 전화·주소·진료시간·SNS.
// §6-2 "더미 전화번호 금지" 의 단일 출처. 화면의 모든 tel: 이 여기서 나온다.
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: '병원 기본정보',
  admin: {group: '설정'},
  access: {read: () => true},
  fields: [
    {
      type: 'row',
      fields: [
        {name: 'tel', type: 'text', label: '대표전화', required: true, admin: {width: '50%'}},
        {name: 'fax', type: 'text', label: '팩스', admin: {width: '50%'}}
      ]
    },
    {name: 'address', type: 'text', label: '주소', required: true, localized: true},
    {name: 'mapUrl', type: 'text', label: '지도 링크'},
    {
      name: 'hours',
      type: 'array',
      label: '진료시간',
      labels: {singular: '줄', plural: '줄'},
      fields: [
        {
          type: 'row',
          fields: [
            {name: 'days', type: 'text', label: '요일', required: true, admin: {width: '40%'}},
            {name: 'time', type: 'text', label: '시간', required: true, admin: {width: '60%'}}
          ]
        }
      ]
    },
    {
      type: 'row',
      fields: [
        {name: 'instagram', type: 'text', label: '인스타그램', admin: {width: '50%'}},
        {name: 'kakao', type: 'text', label: '카카오톡 채널', admin: {width: '50%'}}
      ]
    }
  ]
};
