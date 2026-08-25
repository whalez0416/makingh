import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import {withPayload} from '@payloadcms/next/withPayload';

// GitHub Pages 는 서버를 못 돌린다 → 그 빌드에서만 정적 내보내기.
// Payload 관리자·API 는 서버가 있어야 하므로 로컬·Vercel 은 서버 모드로 둔다.
const isPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  ...(isPages ? {output: 'export' as const, basePath: '/makingh'} : {}),
  trailingSlash: true,
  images: {unoptimized: true}
};

export default withPayload(createNextIntlPlugin()(nextConfig));
