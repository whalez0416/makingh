import type {CollectionConfig} from 'payload';

// 관리자 로그인 계정. 첫 계정은 /admin 최초 접속 때 화면에서 만든다.
export const Users: CollectionConfig = {
  slug: 'users',
  // 이메일 대신 아이디로 로그인 (메일 발송 기능이 없어 이메일이 쓸모가 없다)
  auth: {loginWithUsername: {allowEmailLogin: false, requireEmail: false}},
  labels: {singular: '관리자', plural: '관리자'},
  admin: {useAsTitle: 'username', group: '설정'},
  fields: [{name: 'name', type: 'text', label: '이름'}]
};
