import type {CollectionConfig} from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {singular: '이미지', plural: '이미지'},
  admin: {group: '설정'},
  upload: true,
  // 올린 파일은 홈페이지에 그대로 나가야 한다. 이게 없으면 방문자에게 403 이라
  // 팝업·소식·후기 이미지가 전부 깨진다.
  access: {read: () => true},
  fields: [
    // 대체 텍스트는 접근성·SEO 에 쓰이므로 필수로 둔다.
    {name: 'alt', type: 'text', label: '대체 텍스트', required: true}
  ]
};
