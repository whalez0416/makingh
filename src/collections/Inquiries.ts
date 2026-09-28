import type {CollectionConfig} from 'payload';
import {APIError} from 'payload';
import {slackAlert} from '@/lib/alert';

// 온라인 상담 문의함. 공개되지 않는다 — 병원만 본다.
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: {singular: '상담 문의', plural: '상담 문의'},
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'status', 'createdAt'],
    group: '접수함'
  },
  access: {
    create: () => true, // 공개 폼
    read: ({req}) => Boolean(req.user),
    update: ({req}) => Boolean(req.user),
    delete: ({req}) => Boolean(req.user)
  },
  hooks: {
    beforeValidate: [
      ({data}) => {
        if (data && typeof data.website === 'string' && data.website.trim() !== '') {
          throw new APIError('invalid submission', 400);
        }
        return data;
      }
    ],
    afterChange: [
      async ({doc, operation}) => {
        if (operation === 'create') {
          await slackAlert('디토셀 상담 문의 새 접수', {이름: doc.name, 연락처: doc.phone, 문의: doc.message});
        }
      }
    ]
  },
  fields: [
    {
      type: 'row',
      fields: [
        {name: 'name', type: 'text', label: '이름', required: true, admin: {width: '50%'}},
        {name: 'phone', type: 'text', label: '연락처', required: true, admin: {width: '50%'}}
      ]
    },
    {name: 'message', type: 'textarea', label: '문의 내용', required: true},
    {
      name: 'status',
      type: 'select',
      label: '처리 상태',
      required: true,
      defaultValue: 'new',
      options: [
        {label: '미확인', value: 'new'},
        {label: '처리 완료', value: 'done'}
      ]
    },
    {name: 'agreePrivacy', type: 'checkbox', label: '개인정보 수집 동의', required: true},
    {name: 'website', type: 'text', admin: {hidden: true}}
  ]
};
