import {siteUrl} from './site';

// 위키(aeo-sync 가 서버 /docs/ 에 매일 발행하는 의료 정보) 글 목록 — 홈페이지에서 위키로 가는 길(2026-10-06).
// 위키 사이트맵을 읽어 글 주소·제목을 얻는다. 새 글은 다음 배포(또는 관리자 저장) 때 다시 그려지며 들어온다.
// 위키가 아직 없거나 못 읽으면 빈 목록 — 그 칸만 숨는다.
export const WIKI_HUB: Record<string, string> = {ko: '/docs/', zh: '/docs/zh/', 'zh-Hant': '/docs/zh-hant/'};

export type WikiArticle = {href: string; title: string; cat: string};

export async function getWikiArticles(locale: string): Promise<WikiArticle[]> {
  const hub = WIKI_HUB[locale] ?? WIKI_HUB.ko;
  try {
    const sm = await (await fetch(`${siteUrl}${hub}sitemap.xml`, {next: {tags: ['wiki']}})).text();
    const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => !/\/index\.html$|\/$/.test(u));
    const out = await Promise.all(
      urls.map(async (href) => {
        const html = await (await fetch(href, {next: {tags: ['wiki']}})).text();
        const t = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
        const cat = href.slice(href.indexOf(hub) + hub.length).split('/')[0];
        return {href, title: t.split(' - ')[0].trim(), cat};
      })
    );
    return out.filter((a) => a.title);
  } catch {
    return [];
  }
}
