import type {CollectionConfig} from 'payload';
import {siteHooks} from '@/lib/revalidate';

// 브리프 §5 notices — 제목/본문/분류/게시일/노출.
// 제목·본문만 localized: 분류·게시일·노출은 언어와 무관한 값이다.
export const Notices: CollectionConfig = {
  slug: 'notices',
  labels: {singular: '소식', plural: '소식'},
  admin: {useAsTitle: 'title', defaultColumns: ['title', 'category', 'publishedAt', 'published'], group: '콘텐츠'},
  access: {read: () => true},
  hooks: siteHooks,
  fields: [
    {name: 'title', type: 'text', label: '제목', required: true, localized: true},
    {name: 'body', type: 'richText', label: '본문', localized: true},
    {
      name: 'category',
      type: 'select',
      label: '분류',
      required: true,
      defaultValue: 'notice',
      options: [
        {label: '공지', value: 'notice'},
        {label: '이벤트', value: 'event'}
      ]
    },
    {name: 'publishedAt', type: 'date', label: '게시일', required: true, defaultValue: () => new Date()},
    {name: 'published', type: 'checkbox', label: '노출', defaultValue: true}
  ]
};
