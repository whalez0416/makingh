import type {CollectionConfig} from 'payload';
import {siteHooks} from '@/lib/revalidate';

// 브리프 §5 popups — 기간이 지나면 자동으로 안 뜬다. 끄는 것을 잊어도 화면에 남지 않는다.
export const Popups: CollectionConfig = {
  slug: 'popups',
  labels: {singular: '팝업', plural: '팝업'},
  admin: {useAsTitle: 'title', defaultColumns: ['title', 'startAt', 'endAt', 'enabled'], group: '콘텐츠'},
  access: {read: () => true},
  hooks: siteHooks,
  fields: [
    {name: 'title', type: 'text', label: '제목', required: true, localized: true},
    {name: 'image', type: 'upload', relationTo: 'media', label: '이미지'},
    {name: 'body', type: 'richText', label: '내용', localized: true},
    {name: 'link', type: 'text', label: '연결 주소'},
    {
      type: 'row',
      fields: [
        {
          name: 'startAt',
          type: 'date',
          label: '노출 시작',
          required: true,
          admin: {width: '50%', date: {pickerAppearance: 'dayOnly'}}
        },
        {
          name: 'endAt',
          type: 'date',
          label: '노출 종료',
          required: true,
          admin: {
            width: '50%',
            date: {pickerAppearance: 'dayOnly'},
            description: '이 날짜 당일까지 보입니다. 다음 날 자동으로 사라집니다.'
          }
        }
      ]
    },
    {
      name: 'enabled',
      type: 'checkbox',
      label: '사용',
      defaultValue: true,
      admin: {description: '켜 둔 것 중 기간에 든 팝업 하나만 첫 화면에 뜹니다.'}
    }
  ]
};
