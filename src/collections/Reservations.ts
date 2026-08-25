import type {CollectionConfig} from 'payload';
import {APIError} from 'payload';
import {TREATMENTS, TIME_SLOTS} from '@/lib/treatments';

// 온라인 예약 신청함. 방문자가 넣고 병원이 본다.
// 개인정보가 들어오는 곳이라 create 만 열고 조회·수정·삭제는 로그인한 관리자로 잠근다.
export const Reservations: CollectionConfig = {
  slug: 'reservations',
  labels: {singular: '예약 신청', plural: '예약 신청'},
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'treatment', 'preferredDate', 'status'],
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
        // 허니팟: 사람 눈에 안 보이는 칸이라 값이 있으면 봇이다.
        if (data && typeof data.website === 'string' && data.website.trim() !== '') {
          throw new APIError('invalid submission', 400);
        }
        return data;
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
    {
      type: 'row',
      fields: [
        {
          name: 'treatment',
          type: 'select',
          label: '희망 시술',
          required: true,
          options: TREATMENTS.map((t) => ({label: t.label, value: t.value})),
          admin: {width: '50%'}
        },
        {
          name: 'gender',
          type: 'select',
          label: '성별',
          options: [
            {label: '여성', value: 'female'},
            {label: '남성', value: 'male'}
          ],
          admin: {width: '50%'}
        }
      ]
    },
    {
      type: 'row',
      fields: [
        {name: 'preferredDate', type: 'text', label: '희망 날짜', required: true, admin: {width: '50%'}},
        {
          name: 'preferredTime',
          type: 'select',
          label: '희망 시간',
          required: true,
          options: TIME_SLOTS.map((t) => ({label: t, value: t})),
          admin: {width: '50%'}
        }
      ]
    },
    {name: 'message', type: 'textarea', label: '요청사항'},
    {
      name: 'status',
      type: 'select',
      label: '처리 상태',
      required: true,
      defaultValue: 'new',
      options: [
        {label: '접수', value: 'new'},
        {label: '확정', value: 'confirmed'},
        {label: '취소', value: 'cancelled'}
      ]
    },
    {
      type: 'row',
      fields: [
        {name: 'agreePrivacy', type: 'checkbox', label: '개인정보 수집 동의', required: true, admin: {width: '50%'}},
        {name: 'agreeMarketing', type: 'checkbox', label: '마케팅 수신 동의', admin: {width: '50%'}}
      ]
    },
    // 저장은 되지만 관리자 화면에는 숨긴다 — 봇 판별에만 쓴다.
    {name: 'website', type: 'text', admin: {hidden: true}}
  ]
};
