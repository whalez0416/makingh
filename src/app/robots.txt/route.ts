import {siteUrl} from '@/lib/site';

// robots.txt — 글자 그대로 내보낸다. Next 의 robots.ts(MetadataRoute) 는 주석 줄을 못 넣어서
// 다음(Daum) 웹마스터도구 인증 줄(#DaumWebMasterTool, 2026-10-06 발급)을 실을 수 없다.
// 정식 서버: 전부 허용(관리자·API 제외). GitHub Pages 미리보기는 중복 문서라 검색엔진에서 뺀다.
// 위키(/docs/)는 aeo-sync 가 따로 만드는 사이트맵이 언어별로 있다 — 같이 알려야 검색엔진이 찾아온다.
export const dynamic = 'force-static';

const DAUM = '#DaumWebMasterTool:7e7a2c97f91c7dcabb70411ce2c0bd7a0ff76c5d98470069e9e10d4c409bebff:n2D93vW3XW4Kmae1+d0oZQ==';

export function GET() {
  const body =
    process.env.GITHUB_PAGES === 'true'
      ? 'User-Agent: *\nDisallow: /\n'
      : [
          'User-Agent: *',
          'Allow: /',
          'Disallow: /admin/',
          'Disallow: /api/',
          '',
          `Host: ${siteUrl}`,
          ...['/sitemap.xml', '/docs/sitemap.xml', '/docs/zh/sitemap.xml', '/docs/zh-hant/sitemap.xml'].map((p) => `Sitemap: ${siteUrl}${p}`),
          '',
          DAUM,
          ''
        ].join('\n');
  return new Response(body, {headers: {'Content-Type': 'text/plain; charset=utf-8'}});
}
