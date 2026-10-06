import {revalidatePath} from 'next/cache';

// 관리자에서 소식·팝업·후기·병원정보를 저장·삭제하면 사이트 전체 페이지를 다시 그리게 한다(다음 방문 때 새 내용).
// 서버 배포본은 빌드 때 빈 DB 로 굳기 때문에, 이게 없으면 관리자에서 고친 내용이 사이트에 안 나온다.
// 빌드·시드 스크립트처럼 Next 요청 밖에서 불리면 revalidatePath 가 예외를 내는데, 그땐 할 일이 없으니 무시한다.
export function revalidateSite() {
  try {
    revalidatePath('/', 'layout');
  } catch {
    /* Next 요청 밖 */
  }
}

// 훅은 받은 문서를 그대로 돌려준다(저장 내용은 건드리지 않음)
const afterAny = <T extends {doc: unknown}>({doc}: T) => {
  revalidateSite();
  return doc;
};
export const siteHooks = {afterChange: [afterAny], afterDelete: [afterAny]};
export const globalHooks = {afterChange: [afterAny]};
