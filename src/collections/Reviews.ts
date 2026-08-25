import type {CollectionConfig} from 'payload';

// 브리프 §5 reviews — 인스타 릴스 카드. 메인 §4-7 슬라이더가 이걸 읽는다.
export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: {singular: '후기', plural: '후기'},
  admin: {useAsTitle: 'highlight', defaultColumns: ['highlight', 'order', 'published'], group: '콘텐츠'},
  access: {read: () => true},
  defaultSort: 'order',
  fields: [
    {name: 'highlight', type: 'text', label: '한 줄 하이라이트', required: true, localized: true},
    {name: 'desc', type: 'textarea', label: '설명', localized: true},
    {name: 'instagramUrl', type: 'text', label: '인스타그램 주소'},
    {name: 'thumbnail', type: 'upload', relationTo: 'media', label: '썸네일'},
    {name: 'order', type: 'number', label: '정렬 순서', defaultValue: 0},
    {name: 'published', type: 'checkbox', label: '노출', defaultValue: true}
  ]
};
