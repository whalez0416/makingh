import type {CollectionConfig} from 'payload';

// 관리자 로그인 계정. 첫 계정은 /admin 최초 접속 때 화면에서 만든다.
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  labels: {singular: '관리자', plural: '관리자'},
  admin: {useAsTitle: 'email', group: '설정'},
  fields: [{name: 'name', type: 'text', label: '이름'}]
};
