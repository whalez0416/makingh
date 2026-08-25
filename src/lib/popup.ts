// 팝업 노출 판정 한 곳.
// 관리자가 날짜만 고르므로 endAt 은 그날 00:00 이다 — 그대로 비교하면 종료일 아침에 사라진다.
// 하루를 더해 "종료일 당일까지" 로 맞춘다.
const DAY = 86_400_000;

export const isLive = (p: {startAt: string; endAt: string}, now: number) =>
  Date.parse(p.startAt) <= now && now < Date.parse(p.endAt) + DAY;
