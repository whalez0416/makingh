# 다음에 이어서 할 일 (2026-10-01 기록)

> 이 파일만 읽으면 이어서 할 수 있게. 위에서부터 순서대로.

## 라이브(dittocellseoul.com, master facc9b6)에 이미 올라간 것

- 메인 히어로 "내 피부의 해상도를 높이다" — 스크롤하면 저해상도 피부가 선명해짐 (`src/components/ResolveHero.tsx`, 시안 아티팩트 3trM29GvvHfWVvzhV4ouyh)
- 버튼 "디토 에코" — 어긋난 복제 선이 마우스를 올리면 겹침 (`globals.css .echo`, 시안 Awx4nwfnseecTVvTMJHDQS ⑤)
- 관리자 저장 → 사이트 즉시 반영 (소식·팝업·후기·병원정보 훅 + 배포 직후 `POST /api/revalidate/`)

## 올리기만 하면 되는 브랜치 (원격에 푸시됨, 검증 끝)

### 1. `feat/zh-wechat-langs` — ✅ 2026-10-06 배포
- 영어·일본어 제거 → 한국어·간체·번체 3개. `/en/` `/ja/` 는 `/ko/` 로 308.
- 중국어 페이지 상담 = 위챗 창(QR·ID·복사). 관리자 "병원 기본정보 → 위챗 ID / 위챗 QR" 이 비어 있으면 `/zh/consult/` 로.
- DB 마이그레이션 `20261001_082704_zh_only_wechat` (칸 2개 추가만). 서버 기동 때 prodMigrations 가 자동 적용.
- 올리는 법: `git checkout master && git merge --ff-only feat/zh-wechat-langs && git push` → 배포 후 링크·버튼 전수 확인(메모리 deploy-test-section).
- **병원에 받을 것: 위챗 ID, 위챗 QR 이미지.**

### 2. `feat/resolve-hero` — 아직 보류 (master 보다 오래된 줄기에서 갈라짐, 합칠 때 충돌 정리 필요)
- 서브 페이지 정보 중심 개선안(발주자 확정 Pzr1toCYPY5mxYay2jcRhp) + 서브 히어로 해상도 모션(`ResolveImage`) + 제목 한 글자씩
- 사진 해상도: 실내 렌더 10장 AI 2배(로컬 Real-ESRGAN), 시그니처 모델·메인 카드·실험실·원장 원본 재출력 (전후 비교 아티팩트 2ikqAGde8MhVWZ14B5XaNm)
- **버튼은 "디토 롤"(btn-fx/BtnLabel)로 들어가 있음 → 사용자가 디토 에코를 골랐으니 합칠 때 `.echo` 로 바꿀 것.**
- 합칠 때 master 의 변경(메인 히어로·에코·관리자 반영·언어 3개)과 겹치는 파일: Editorial.tsx, globals.css, Header.tsx, messages/*.

## 2026-10-06 위키 노출 작업

- ✅ 홈페이지 → 위키 길: 줄기세포·안티에이징 페이지 '자주 묻는 질문'(위키 사이트맵에서 자동), 하단 '의료 정보', robots 에 위키 사이트맵 3개 (makingh d28bf47)
- ✅ 위키 발행 뒤 홈페이지 다시 그리기 (aeo-sync PR #46)
- ✅ 구글 서치콘솔: 도메인 속성 `sc-domain:dittocellseoul.com`(Cloudflare TXT 자동 확인), 사이트맵 4개 제출 — 홈·간체 성공, 한국어·번체 위키는 제출 직후 '가져올 수 없음'(봇 접근 정상 확인) → 다시 볼 것
- ✅ Bing: 서치콘솔에서 디토셀만 가져오기(다른 병원·NC 사이트 체크 해제), 사이트맵 4개 Processing
- ⏳ 네이버 서치어드바이저: 브라우저 도구가 차단 → 사용자가 사이트 등록·HTML 태그 받아 주면 layout 에 meta 넣고 배포

## 다음 주 할 일

1. **위키** — 사용자: "다음 주부터 위키 올리자". 참고로 aeo-sync `daily-publish-dittocell` 은 이미 평일 KST 09:40 자동 발행 중(10-01 첫 발행 확인, 한국어·간체·번체, `dittocellseoul.com/docs/`). 무엇을 "올릴지"(새 주제·노출 위치·메인에서 위키로 가는 길 등) 사용자에게 먼저 확인.
   - 영어·일본어를 빼는 브랜치를 올리면 위키는 원래 ko·zh·zh-hant 라 영향 없음.
2. ~~`feat/zh-wechat-langs` 배포~~ (10-06 완료) — 병원 위챗 ID·QR 받으면 관리자에 입력
3. `feat/resolve-hero` 정리·배포 (위 2번)
4. **방문 로그 보관** — 메이린은 매일 액세스 로그를 gz 로 떠 두고(aeo-sync `deploy/maylin_server/maylin_logdump.sh`) AEO 대시보드가 가져감. 디토셀은 nginx `/var/log/nginx/dittocell.access.log` 만 있고 보관이 없음 → 같은 방식 추가 필요(서버 SSH 키는 회사 PC 에만).
5. 사용자가 할 것: 슬랙 #디토셀-보고 웹훅 → 터미널에서 `gh secret set SLACK_WEBHOOK_DITTOCELL --repo whalez0416/aeo-sync` (대화창에 URL 붙이지 않기)
6. 병원에 받을 것: 위챗 ID·QR, 로고 원본(AI/SVG), 실내 실사 사진, 바이알 원본(있으면)

## 폐기·참고

- `feat/skin-motion`(얼굴 피부 당김 WebGL) — 사용자 "이상한데" → 쓰지 않음
- 시안 아티팩트: 1차 VV99ceQeVDsoUZ2rUUt8sb, 2차 6VR6JVDU9kKFn9wCHCT4wL, 3차 인터랙션 ASDgPpZ12LHEety8cDhZHm, 해상도 3trM29GvvHfWVvzhV4ouyh, 버튼 Awx4nwfnseecTVvTMJHDQS, 사진 전후 2ikqAGde8MhVWZ14B5XaNm
- 시안·원본 작업 파일: `reference/old-site/concept/` (깃 제외)
- 서버비 청구(10-01): 1년치 디토셀 약 11만·메이린 약 15만 — 원장 aeo-sync `deploy/dittocell_server/COSTS.md`, `sites/maylin_zh/COSTS.md`
