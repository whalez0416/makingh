# 작업 기록 (최신이 위)

## 2026-10-07 글꼴 경량화 (튠업 2 재시도, 커밋 d2d2971·3b5d804·중국어·한자 제외)
- HTTP/2 위에서 Pretendard 자체 호스팅(d2d2971) → 메인 +, 서브 − 로 혼조. 원인 = 페이지당 글꼴 24개(약 550KB)
- `scripts/font-subset.py`: 사이트 글자(messages·src·라이브 사이트맵 27쪽)만 담은 `src/fonts/pretendard-site.woff2`(한글 666자 161KB) + 명조 `serif-kr-site.woff2`(Google text=, 116KB, serif.ts 를 next/font/local 로) + 보조 `pretendard-fallback.css`(Pretendard 조각 92개에서 한자 범위 제외 — 한국어 페이지 '前' 한 글자로 조각 받던 것)
- 중국어 페이지: `html:lang(zh) body` 는 사이트 글꼴 + 기기 중국어 글꼴(한자가 Pretendard 조각 13개를 끌어오던 것). 언어 메뉴 简体中文·繁體中文 도 기기 글꼴
- 검증: 라이브 27쪽 한글 누락 0, 드문 글자(똠·뷁)는 보조 조각으로 그려짐(로컬), 링크 30·WebP 88 전부 200
- 라이브 모바일(2회): 메인 66/85 · 시그니처 75/75 · 안티에이징 74/75 · 줄기세포 75/75 · 간체 69/77, 글꼴 3개. (시작 때 66·63·64·61·73)
- 문구를 많이 바꾸거나 새 페이지를 만들면 `python scripts/font-subset.py`(fonttools·brotli) 후 src/fonts 커밋 — 안 해도 깨지지 않고 보조 조각으로 그려짐
- 롤백: 해당 커밋들 `git revert`

## 2026-10-07 ESA HTTP/2 켜기 (튠업 4·3)
- ESA 콘솔 dittocellseoul.com → Speed and Network → Optimization → **HTTP/2 켬**(꺼져 있었음. HTTP/3 은 원래 켜짐). 확인: TLS ALPN h2, Lighthouse 프로토콜 h2
- 점수 변화 없음(모바일 65·64·66·69) — 병목은 연결 수가 아니라 렌더 차단 CSS(jsdelivr Pretendard 771ms 추정 + 우리 CSS 2개)
- 첫 방문 307 은 서버가 아니라 크롬 내부 리다이렉트("307 Internal Redirect", Location 동일 주소) — ESA 보안 설정 문제 아님, curl 로는 재현 안 됨. 손대지 않음
- 롤백: 같은 화면에서 HTTP/2 스위치 끄기

## 2026-10-07 모바일 속도 (튠업 1·5·6, 커밋 0135df1)
- 측정(로컬 Lighthouse, PSI API 429): 모바일 /ko/ 66 · 시그니처 63 · 안티에이징 64 · 줄기세포 61, 데스크톱 89~98. 첫 화면 4초대 = 렌더 차단 CSS + 글꼴 19개 + HTTP/1.1(ESA)
- 1 사진: `scripts/img-variants.mjs` → `public/_v/<경로>.<해시>.<폭>.webp`(384~1920) + `src/lib/img-manifest.json`, next/image 로더 `src/lib/img-loader.ts`. 메인 첫 사진 383→130KB
- 5 캐시: `next.config.ts` headers — `/_v/` 1년 immutable, 원본 사진 폴더 1주
- 6 히어로 캔버스(ResolveHero·ResolveImage)가 화면 <img> 의 currentSrc 를 재사용(중복 다운로드 없음)
- 2 글꼴 자체 호스팅은 **되돌림**: HTTP/1.1 동시 6개 제한에서 글꼴 19개가 같은 출처로 줄을 서 Lantern 점수 하락(메인 ~10점). jsdelivr preconnect 만 추가. HTTP/2 켠 뒤 재시도
- 라이브 검증: 13페이지·내부 링크 30개·WebP 88개 전부 200, 캐시 헤더 확인, 중문 카카오 → /zh/consult/ (위챗 미입력), 전화 tel:+82-2-564-7774, 깨진 사진 0
- 라이브 재측정(모바일, 2회): /ko/ 65 · 시그니처 65 · 안티에이징 65 · 줄기세포 70, 전송량 1,778→1,035KB. 점수는 거의 그대로 — 첫 화면은 글꼴·HTTP/1.1 에 묶임 → 다음: ESA HTTP/2 켜기(튠업 4), 첫 방문 307(ESA 보안 쿠키, 튠업 3)
- 롤백: `git revert 0135df1 && git push` (배포 자동)
- 사진 추가·교체 시: `node scripts/img-variants.mjs` 후 `public/_v`·manifest 커밋 (안 하면 원본 jpg 가 그대로 나감)
