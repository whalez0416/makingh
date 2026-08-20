# 디토셀의원 홈페이지

Next.js 16 (App Router) · TypeScript · Tailwind v4 · next-intl.
작업 지침은 [`CLAUDE.md`](./CLAUDE.md) — 브리프 전문이 들어 있다. Phase 순서대로 진행한다.

## 셋업

```bash
npm install
npm run dev        # http://localhost:3000  → /ko 로 리다이렉트
```

Node 24 이상. 환경변수는 아직 없다 (Phase 2 Payload 도입 시 `DATABASE_URI`, `PAYLOAD_SECRET` 추가 예정).

## 명령

| 명령 | 하는 일 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 정적 내보내기 (`out/` 생성) |
| `npm run preview` | 내보낸 `out/` 을 그대로 열어보기 |
| `npm run check` | 언어 폴백(ko 로 메우기) 자체검사 |
| `npm run shots` | 375 / 768 / 1440 세 폭 × VI 3안 = 9장을 `shots/` 에 저장 (dev 서버가 떠 있어야 함) |

`npm run shots` 는 설치된 Edge·Chrome 을 그대로 쓴다. 브라우저를 따로 받지 않는다.
브리프 §3 이 Phase 완료마다 세 폭 확인을 요구하므로 이 스크립트로 찍어 확인한다.

## VI 3안 비교 (Phase 1)

**레이아웃은 셋이 완전히 같다. 색만 다르다.**
그리드·박스 위치·타이포 스케일·라운딩은 beauwell.kr 실측값으로 통일했다
(수치는 [`docs/beauwell-analysis.md`](./docs/beauwell-analysis.md)).

- 화면 왼쪽 아래 **VI 후보 비교** 스위처로 전환 (선택은 localStorage 에 남는다)
- 링크로 바로 열려면 `?vi=a` `?vi=b` `?vi=c`
  - a — 앤틱골드 (웜 베이지 + 골드)
  - b — 딥그린 (쿨 그레이 + 그린)
  - c — 모카골드 (포슬린 화이트 + 모카)

색은 `src/app/globals.css` 위쪽 세 블록이 전부다. 컴포넌트는 토큰만 쓴다.
**확정되면** 나머지 두 블록과 `ThemeSwitcher.tsx`,
`[locale]/layout.tsx` 의 복원 스크립트를 지우면 그 색으로 고정된다.

사진은 아직 없다. 히어로 카드는 테마 색 그라데이션 플레이스홀더다.

## 다국어

- `ko` / `en` / `zh` / `ja`, URL 은 `/ko/...` 형태 (`src/i18n/routing.ts`)
- 문구는 `messages/<locale>.json`. **ko 가 원본**이고, 나머지 언어는 비어 있는 키를 ko 로 메운다
  (`src/i18n/fallback.mjs`, 검사는 `npm run check`)
- 지금 en·zh·ja 는 빈 파일이라 한국어가 그대로 보인다. 번역 연결은 Phase 4.

## 구조

```
src/
  app/[locale]/     레이아웃(헤더·푸터·플로팅) + 메인
  sections/         메인 섹션 (Hero / NumbersStrip / Diagnosis)
  components/       공용 컴포넌트
  i18n/             next-intl 설정
  lib/site.ts       ★ 전화·주소·진료시간 단일 출처 (Phase 2 에 Payload site-settings 로 이관)
  lib/themes.ts     VI 테마 목록
messages/           언어별 문구
scripts/            자체검사·스크린샷
```

전화번호는 반드시 `lib/site.ts` 에서 가져온다. 하드코딩 금지 (브리프 §6-2).


## 배포 — GitHub Pages

정적 사이트로 내보내 GitHub Pages 로 올린다. `master` 에 푸시하면
`.github/workflows/deploy.yml` 이 빌드해서 배포한다.

- 주소: **https://whalez0416.github.io/makingh/**
- `next.config.ts` 가 `output: 'export'`. Pages 는 서버를 못 돌리므로 미들웨어(proxy)는 쓰지 않는다.
  locale 은 URL 접두어로만 정해진다 (`/ko/`, `/en/` …). 브라우저 언어 자동 감지는 없다.
- `basePath: '/makingh'` 는 **Pages 빌드에서만** 붙는다 (`GITHUB_PAGES=true`).
  로컬은 `localhost:3000/ko` 그대로다.
- `/` 로 들어오면 `src/app/page.tsx` 가 `./ko/` 로 넘긴다. 상대경로라 basePath 유무와 무관하다.
- `public/.nojekyll` 이 있어야 한다. 없으면 Jekyll 이 `_next` 폴더를 통째로 무시해 CSS·JS 가 전부 404 난다.

**저장소 최초 설정**: Settings → Pages → Source 를 **GitHub Actions** 로 지정한다.
비공개 저장소의 Pages 는 유료 플랜에서만 동작한다 — 무료 계정이면 저장소를 공개로 바꿔야 한다.

Vercel 로 옮길 때는 `output: 'export'` 와 `basePath` 만 걷어내고 `src/proxy.ts`(미들웨어)를
되살리면 언어 자동 감지까지 원래대로 돌아온다.
