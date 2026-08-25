import path from 'path';
import {fileURLToPath} from 'url';
import {buildConfig} from 'payload';
import {sqliteAdapter} from '@payloadcms/db-sqlite';
import {lexicalEditor} from '@payloadcms/richtext-lexical';
import {ko} from '@payloadcms/translations/languages/ko';
import {en} from '@payloadcms/translations/languages/en';
import sharp from 'sharp';

import {Users} from './collections/Users';
import {Media} from './collections/Media';
import {Notices} from './collections/Notices';
import {Popups} from './collections/Popups';
import {Reviews} from './collections/Reviews';
import {SiteSettings} from './globals/SiteSettings';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  // 관리자는 병원 직원이 쓴다 — UI 기본 한국어.
  i18n: {supportedLanguages: {ko, en}, fallbackLanguage: 'ko'},
  admin: {user: Users.slug},
  collections: [Users, Media, Notices, Popups, Reviews],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  // ko 만 필수. en·zh·ja 는 비워두면 ko 가 대신 나간다 (브리프 §5).
  localization: {
    locales: [
      {label: '한국어', code: 'ko'},
      {label: 'English', code: 'en'},
      {label: '中文', code: 'zh'},
      {label: '日本語', code: 'ja'}
    ],
    defaultLocale: 'ko',
    fallback: true
  },
  secret: process.env.PAYLOAD_SECRET || '',
  db: sqliteAdapter({
    client: {url: process.env.DATABASE_URI || 'file:./dittocell.db'}
  }),
  sharp,
  typescript: {outputFile: path.resolve(dirname, 'payload-types.ts')}
});
