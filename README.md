# 디토셀의원 홈페이지

Next.js 16 (App Router) · TypeScript · Tailwind v4 · next-intl.
작업 지침은 [`CLAUDE.md`](./CLAUDE.md) — 브리프 전문이 들어 있다. Phase 순서대로 진행한다.

## 셋업

```bash
npm install
npm run dev        # http://localhost:3000  → /ko 로 리다이렉트
```

Node 24 이상.

`.env` 두 줄이 필요하다 (커밋하지 않는다):

```
PAYLOAD_SECRET=<임의의 긴 문자열>
DATABASE_URI=file:./dittocell.db
```

`PAYLOAD_SECRET` 은 로그인 토큰 서명 키다. 바꾸면 기존 로그인 세션이 전부 끊긴다.
DB 는 SQLite 파일 하나(`dittocell.db`)이고 첫 실행 때 스키마가 자동으로 생긴다.
운영에서 Postgres 로 옮길 때는 `payload.config.ts` 의 어댑터만 갈아끼우면 된다.

## 명령

| 명령 | 하는 일 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 서버 빌드 (관리자·API 포함) |
| `npm run build:pages` | GitHub Pages 용 정적 내보내기 (`out/` 생성) |
| `npm run generate:types` | CMS 스키마 → `src/payload-types.ts` 갱신 |
| `npm run preview` | 내보낸 `out/` 을 그대로 열어보기 |
| `npm run check` | 언어 폴백(ko 로 메우기) 자체검사 |
| `npm run check:popup` | 팝업 노출기간 판정 자체검사 |
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

## 관리자 (Payload CMS)

`npm run dev` 뒤 **http://localhost:3000/admin**. 화면은 전부 한국어다.

첫 접속이면 계정 생성 화면이 뜬다. 이미 만들어 둔 로컬 개발 계정:

| 이메일 | 비밀번호 |
| --- | --- |
| `admin@dittocell.com` | `dittocell2026!` |

> 로컬 DB 전용이다. 병원에 넘길 때는 새 계정을 만들고 이 계정은 지운다.

### 무엇을 관리하나

| 메뉴 | 내용 | 화면 어디에 |
| --- | --- | --- |
| 소식 | 제목·본문·분류(공지/이벤트)·게시일·노출 | 메인 소식 피드 + `/notice` 목록·상세 |
| 후기 | 하이라이트·설명·인스타 주소·썸네일·정렬 | 메인 후기 슬라이더 |
| 팝업 | 제목·이미지·내용·연결 주소·노출기간·on/off | 첫 화면 진입 시 한 번 |
| 예약 신청 | 방문자가 넣은 예약 신청 — 확인 후 상태를 바꾼다 | `/reservation` 폼이 여기로 들어온다 |
| 상담 문의 | 방문자가 남긴 문의 — 공개되지 않는다 | `/consult` 폼이 여기로 들어온다 |
| 이미지 | 업로드 | 후기·팝업에서 고른다 |
| 병원 기본정보 | 전화·팩스·주소·지도·진료시간·SNS | 푸터, 예약 페이지, 플로팅 전화 버튼 |

**소식·후기는 등록된 것이 없으면 그 섹션이 화면에서 통째로 빠진다.** 빈 제목만 남지 않는다.

### 4개 언어 입력

편집 화면 우상단 `locale` 을 바꾸면 그 언어의 칸이 열린다.
**한국어만 필수**다. 나머지를 비워두면 그 자리에 한국어가 그대로 나간다.
언어와 무관한 값(분류·게시일·노출·정렬)은 언어를 바꿔도 하나로 공유된다.

### 전화번호

화면의 모든 `tel:` 링크는 **병원 기본정보의 대표전화 한 곳**에서 나온다 (브리프 §6-2).
`lib/site.ts` 의 값은 DB 를 못 읽을 때 쓰는 폴백으로만 남아 있다.

## 팝업

첫 화면에 들어오면 한 번 뜬다. **켜 둔 팝업이 여럿이어도 한 번에 하나만** 나온다
(브리프 §3 — 동시 다중 팝업은 차용하지 않는다). 여럿이면 노출 시작이 가장 최근인 것.

- **노출기간**은 날짜만 고른다. **종료일 당일까지 보이고 다음 날 사라진다.**
  끄는 것을 잊어도 화면에 남지 않는다.
- **오늘 하루 열지 않기** — 누른 사람 브라우저에 그날 하루만 기억된다. 다음 날 다시 뜬다.
  방문자 기록은 서버에 남기지 않는다.
- 배경을 누르거나 `Esc` 로도 닫힌다. 열려 있는 동안 뒤 화면은 스크롤되지 않는다.
- 이미지만, 글만, 둘 다 — 넣은 것만 나온다. **연결 주소**를 채우면 '자세히 보기' 버튼이 생긴다.

기간 판정은 **방문자 브라우저 시각**으로 한다. 페이지가 빌드 시점에 굳는 정적 사이트라
서버에서 걸러 두면 지난 팝업이 그대로 박제되기 때문이다. 대신 **팝업을 새로 등록하면
다시 배포해야 화면에 나온다** — 소식·후기와 같은 조건이다.

## 온라인 예약 · 온라인 상담

| 페이지 | 하는 일 | 쌓이는 곳 |
| --- | --- | --- |
| `/[locale]/reservation` | 시술·희망일시·이름·연락처·요청사항을 받는다 | 관리자 → **예약 신청** |
| `/[locale]/consult` | 이름·연락처·문의내용만 받는다 | 관리자 → **상담 문의** |

**신청이 곧 확정은 아니다.** 병원이 접수함에서 보고 전화로 확정한 뒤 상태를 바꾸는 흐름이다.
휴대폰 본인인증은 넣지 않았다 — NICE·다날 같은 본인확인 서비스 계약과 월 비용이 필요하다.

### 개인정보를 다루는 곳이라 지킨 것

- **권한**: `create` 만 공개다. 조회·수정·삭제는 로그인한 관리자만 (`access` 설정).
  비로그인으로 `/api/reservations` 를 열면 403 이다. 이 잠금을 풀면 신청자 연락처가 그대로 공개된다.
- **동의**: 개인정보 수집·이용 동의 없이는 제출이 막힌다. 무엇을 왜 받는지 폼에서 펼쳐 볼 수 있다.
- **스팸**: 사람 눈에 안 보이는 칸(허니팟)이 채워져 오면 400 으로 거른다.
- 동의 문구의 **보유 기간은 〈확인〉 표시**를 달아 두었다. 병원이 확정해야 하는 값이라 임의로 정하지 않았다.
  `messages/ko.json` 의 `reservationForm.privacyDetail` · `inquiryForm.privacyDetail`.

> 정적 사본(GitHub Pages)에는 API 가 없어 폼 제출이 실패하고 카카오톡 안내로 떨어진다.
> 실제로 신청을 받으려면 서버가 있는 배포(Vercel)가 필요하다.

## 다국어

- `ko` / `en` / `zh` / `ja`, URL 은 `/ko/...` 형태 (`src/i18n/routing.ts`)
- 문구는 `messages/<locale>.json`. **ko 가 원본**이고, 나머지 언어는 비어 있는 키를 ko 로 메운다
  (`src/i18n/fallback.mjs`, 검사는 `npm run check`)
- 목록(배열)은 병합하지 않고 통째로 갈아끼운다. 사전처럼 합치면 `{0:…,1:…}` 객체가 되어
  화면의 `.map` 이 터진다 — en·zh·ja 가 빈 파일이던 동안 드러나지 않던 함정이라 검사에 박아 뒀다.

### 번역이 어디까지 들어와 있나

원문은 **병원이 이미 갖고 있던 자산**이다. 기존 dittocell.com 이 next-intl 로 4개 언어를
운영하고 있어, 그 문구를 그대로 옮겼다. 새로 지은 문장은 없다 (브리프 §9 의료광고).

| 들어온 것 | 아직 국문이 보이는 곳 |
| --- | --- |
| 메뉴·푸터 공용 문구 | 첫 화면 전 구간 (히어로·숫자·철학·자가진단·클리닉·원장·갤러리·클로징) |
| 안티에이징 4개 탭 전체 (시술 16종 설명) | 병원소개 / 온라인 예약 / 온라인 상담 / 소식 / 후기 |
| 줄기세포 4개 탭 전체 (기능 6·특징 4·과정) | 예약·상담 신청 폼의 라벨과 안내 |
| 시그니처 패키지 13종 | |

국문으로 남은 쪽은 **우리가 새로 쓴 카피**라 원문에 짝이 없다. 번역은 사람이 정해야 한다.

## 구조

```
src/
  app/[locale]/     레이아웃(헤더·푸터·플로팅) + 메인 + 서브 5p (signature / anti-aging / stem-cell / about / reservation)
  sections/         메인 섹션 (Hero / NumbersStrip / Philosophy / Diagnosis / Packages / ClinicGrid / Doctor / GalleryMarquee / Closing)
  components/       공용 컴포넌트
  i18n/             next-intl 설정
  app/(site)/       사이트 (위 라우트 전부 이 그룹 안에 있다)
  app/(payload)/    관리자·API — Payload 가 만든 파일이라 직접 고치지 않는다
  payload.config.ts CMS 설정 (컬렉션·언어·DB)
  collections/      소식·후기·팝업·이미지·관리자·예약신청·상담문의
  lib/treatments.ts 예약 폼 시술 목록 (폼과 CMS 가 같은 목록을 쓴다)
  globals/          병원 기본정보
  lib/settings.ts   ★ 병원 기본정보 읽기 (CMS → 없으면 site.ts 폴백)
  lib/cms.ts        CMS 조회 안전 래퍼 (DB 가 없으면 빈 값)
  lib/site.ts       폴백용 고정값
  lib/themes.ts     VI 테마 목록
messages/           언어별 문구
scripts/            자체검사·스크린샷
```

전화번호는 반드시 `lib/settings.ts` 의 `getSettings()` 로 가져온다. 하드코딩 금지 (브리프 §6-2).
클라이언트 컴포넌트(Header·Floating)는 CMS 를 직접 못 읽으므로 layout 이 props 로 내린다.


## 배포 — GitHub Pages

정적 사이트로 내보내 GitHub Pages 로 올린다. `master` 에 푸시하면
`.github/workflows/deploy.yml` 이 빌드해서 배포한다.

- 주소: **https://whalez0416.github.io/makingh/**
- `output: 'export'` 는 **`GITHUB_PAGES=true` 일 때만** 켜진다. 그래야 로컬·Vercel 에서 관리자가 살아 있다.
  Pages 는 서버를 못 돌리므로 미들웨어(proxy)는 쓰지 않는다.
  locale 은 URL 접두어로만 정해진다 (`/ko/`, `/en/` …). 브라우저 언어 자동 감지는 없다.
- **관리자·API 는 정적 사이트에 담기지 않는다.** `npm run build:pages` 가 빌드 동안만
  `src/app/(payload)` 를 치웠다가 되돌린다. Pages 주소에는 `/admin` 이 없다.
- Actions 러너에는 DB 파일이 없다. 그래서 **Pages 사본의 소식·후기는 비어 있다** — 그 섹션이 빠진 채로 나온다.
  콘텐츠까지 보이는 사본이 필요하면 Vercel 로 배포한다.
- `basePath: '/makingh'` 는 **Pages 빌드에서만** 붙는다 (`GITHUB_PAGES=true`).
  로컬은 `localhost:3000/ko` 그대로다.
- `/` 로 들어오면 `src/app/page.tsx` 가 `./ko/` 로 넘긴다. 상대경로라 basePath 유무와 무관하다.
- `public/.nojekyll` 이 있어야 한다. 없으면 Jekyll 이 `_next` 폴더를 통째로 무시해 CSS·JS 가 전부 404 난다.

**저장소 최초 설정**: Settings → Pages → Source 를 **GitHub Actions** 로 지정한다.
비공개 저장소의 Pages 는 유료 플랜에서만 동작한다 — 무료 계정이면 저장소를 공개로 바꿔야 한다.

Vercel 로 옮길 때는 `output: 'export'` 와 `basePath` 만 걷어내고 `src/proxy.ts`(미들웨어)를
되살리면 언어 자동 감지까지 원래대로 돌아온다.
