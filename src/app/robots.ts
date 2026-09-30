import type {MetadataRoute} from 'next';
import {siteUrl} from '@/lib/site';

// 정식 서버: 전부 허용(관리자·API 제외). GitHub Pages 미리보기는 중복 문서라 검색엔진에서 뺀다.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  if (process.env.GITHUB_PAGES === 'true') return {rules: {userAgent: '*', disallow: '/'}};
  return {
    rules: {userAgent: '*', allow: '/', disallow: ['/admin/', '/api/']},
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
