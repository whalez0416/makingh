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
| `npm run build` / `npm start` | 프로덕션 빌드·구동 |
| `npm run check` | 언어 폴백(ko 로 메우기) 자체검사 |
| `npm run shots` | 375 / 768 / 1440 세 폭 × VI 3안 = 9장을 `shots/` 에 저장 (dev 서버가 떠 있어야 함) |

`npm run shots` 는 설치된 Edge·Chrome 을 그대로 쓴다. 브라우저를 따로 받지 않는다.
브리프 §3 이 Phase 완료마다 세 폭 확인을 요구하므로 이 스크립트로 찍어 확인한다.

## VI 3안 비교 (Phase 1)

- 화면 왼쪽 아래 **VI 후보 비교** 스위처로 전환 (선택은 localStorage 에 남는다)
- 링크로 바로 열려면 `?vi=a` `?vi=b` `?vi=c`
  - a — Ditto Mark 〃 (에디토리얼)
  - b — Bio Modern (바이오테크)
  - c — Porcelain Gallery (사진 주도)

색·서체·라운딩은 전부 `src/app/globals.css` 의 테마 토큰이다. 컴포넌트는 토큰만 쓴다.
**확정되면** `globals.css` 에서 나머지 두 테마 블록과 `[data-hero]` 규칙을,
`src/sections/Hero.tsx` 에서 나머지 두 히어로 함수를, 그리고 `ThemeSwitcher.tsx` 와
`[locale]/layout.tsx` 의 복원 스크립트를 지우면 그 테마로 고정된다.

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
