import {Cormorant_Garamond, Noto_Serif_KR} from 'next/font/google';

// 명조·이탤릭 (2026-09-30 발주자 선택: 매거진 시안 A — 서브 페이지 제목에 쓴다). 본문은 Pretendard 그대로.
// 한글 글리프는 Google 이 unicode-range 로 쪼개 주므로 미리 받지 않는다(preload: false).
export const serifKr = Noto_Serif_KR({weight: ['500'], subsets: ['latin'], preload: false, display: 'swap', variable: '--font-serif'});
export const italic = Cormorant_Garamond({weight: ['500'], style: ['italic'], subsets: ['latin'], display: 'swap', variable: '--font-italic'});
