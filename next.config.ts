import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// GitHub Pages 는 서버를 못 돌린다 → 정적 내보내기.
// 미들웨어(proxy)를 쓸 수 없어 지웠다. locale 은 URL 접두어로만 정해진다.
// basePath 는 Pages 빌드에서만 붙인다 — 로컬은 localhost:3000/ko 그대로.
const basePath = process.env.GITHUB_PAGES === 'true' ? '/makingh' : undefined;

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: {unoptimized: true}
};

export default createNextIntlPlugin()(nextConfig);
