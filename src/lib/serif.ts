import {Cormorant_Garamond} from 'next/font/google';
import localFont from 'next/font/local';

// 명조·이탤릭 (2026-09-30 발주자 선택: 매거진 시안 A — 서브 페이지 제목에 쓴다). 본문은 Pretendard 그대로.
// 한글 명조는 사이트에 쓰는 글자만 담은 파일 한 장(scripts/font-subset.py, 2026-10-07 — Google 조각 11개를 받던 것). 없는 글자는 기기 명조로.
export const serifKr = localFont({src: '../fonts/serif-kr-site.woff2', weight: '500', preload: false, display: 'swap', variable: '--font-serif'});
export const italic = Cormorant_Garamond({weight: ['500'], style: ['italic'], subsets: ['latin'], display: 'swap', variable: '--font-italic'});
