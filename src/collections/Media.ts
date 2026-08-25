import type {CollectionConfig} from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {singular: '이미지', plural: '이미지'},
  admin: {group: '설정'},
  upload: true,
  fields: [
    // 대체 텍스트는 접근성·SEO 에 쓰이므로 필수로 둔다.
    {name: 'alt', type: 'text', label: '대체 텍스트', required: true}
  ]
};
