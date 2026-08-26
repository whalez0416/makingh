import {networkInterfaces} from 'node:os';
import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import {withPayload} from '@payloadcms/next/withPayload';

// GitHub Pages 는 서버를 못 돌린다 → 그 빌드에서만 정적 내보내기.
// Payload 관리자·API 는 서버가 있어야 하므로 로컬·Vercel 은 서버 모드로 둔다.
const isPages = process.env.GITHUB_PAGES === 'true';

// 개발 서버는 localhost 아닌 주소에서 온 /_next/* 요청을 403 으로 막는다.
// 그러면 HTML 은 오는데 스크립트가 죽어 화면이 통째로 빈다(휴대폰·같은 와이파이 PC).
// 이 컴퓨터의 랜 주소를 그때그때 읽어 넣는다 — 공유기가 주소를 바꿔도 손댈 것이 없다.
const lanHosts = Object.values(networkInterfaces())
  .flat()
  .filter((n) => n && n.family === 'IPv4' && !n.internal)
  .map((n) => n!.address);

const nextConfig: NextConfig = {
  ...(isPages ? {output: 'export' as const, basePath: '/makingh'} : {}),
  trailingSlash: true,
  images: {unoptimized: true},
  allowedDevOrigins: lanHosts
};

export default withPayload(createNextIntlPlugin()(nextConfig));
