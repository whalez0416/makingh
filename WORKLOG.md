# 작업 기록 (최신이 위)

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
