import {getCms} from './payload';

// CMS 조회의 안전 래퍼.
// GitHub Pages 정적 빌드에는 DB 파일이 없다 — 그때 예외가 나면 빌드가 통째로 죽는다.
// 콘텐츠가 없으면 그 섹션만 비는 편이 낫다.
export async function cmsFind<T>(args: Parameters<Awaited<ReturnType<typeof getCms>>['find']>[0]): Promise<T[]> {
  try {
    const cms = await getCms();
    const {docs} = await cms.find(args);
    return docs as T[];
  } catch {
    return [];
  }
}

export async function cmsFindByID<T>(
  args: Parameters<Awaited<ReturnType<typeof getCms>>['findByID']>[0]
): Promise<T | null> {
  try {
    const cms = await getCms();
    return (await cms.findByID(args)) as T;
  } catch {
    return null;
  }
}
