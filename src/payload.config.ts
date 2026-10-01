import path from 'path';
import {fileURLToPath} from 'url';
import {buildConfig} from 'payload';
import {sqliteAdapter} from '@payloadcms/db-sqlite';
import {revalidateSite} from './lib/revalidate';
import {lexicalEditor} from '@payloadcms/richtext-lexical';
import {ko} from '@payloadcms/translations/languages/ko';
import {en} from '@payloadcms/translations/languages/en';
import sharp from 'sharp';

import {Users} from './collections/Users';
import {Media} from './collections/Media';
import {Notices} from './collections/Notices';
import {Popups} from './collections/Popups';
import {Reviews} from './collections/Reviews';
import {Reservations} from './collections/Reservations';
import {Inquiries} from './collections/Inquiries';
import {SiteSettings} from './globals/SiteSettings';
import {migrations} from './migrations';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  // 관리자는 병원 직원이 쓴다 — UI 기본 한국어.
  i18n: {supportedLanguages: {ko, en}, fallbackLanguage: 'ko'},
  admin: {user: Users.slug},
  collections: [Users, Media, Notices, Popups, Reviews, Reservations, Inquiries],
  // 배포 직후 deploy-server 가 한 번 부른다 — 빈 DB 로 빌드된 페이지를 실제 DB 내용으로 다시 그리게(POST, 비밀키 필요)
  endpoints: [
    {
      path: '/revalidate',
      method: 'post',
      handler: async (req) => {
        if (!process.env.PAYLOAD_SECRET || req.headers.get('x-revalidate') !== process.env.PAYLOAD_SECRET)
          return Response.json({ok: false}, {status: 401});
        revalidateSite();
        return Response.json({ok: true});
      }
    }
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  // ko 만 필수. en·zh·ja 는 비워두면 ko 가 대신 나간다 (브리프 §5).
  localization: {
    locales: [
      {label: '한국어', code: 'ko'},
      {label: '简体中文', code: 'zh'},
      {label: '繁體中文', code: 'zh-Hant'}
    ],
    defaultLocale: 'ko',
    fallback: true
  },
  secret: process.env.PAYLOAD_SECRET || '',
  db: sqliteAdapter({
    client: {url: process.env.DATABASE_URI || 'file:./dittocell.db'},
    // 서버(NODE_ENV=production)에서는 dev 의 자동 스키마 반영이 꺼진다 — 빈 DB 에 표를 만드는 건 이 마이그레이션.
    // 필드를 바꾸면 `npx payload migrate:create <이름>` 으로 한 장 더 만든다(src/migrations/).
    prodMigrations: migrations
  }),
  sharp,
  typescript: {outputFile: path.resolve(dirname, 'payload-types.ts')}
});
