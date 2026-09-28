// 새 접수 1건 → 슬랙 한 장. 메이린(aeo-sync deploy/maylin_server/pb_hooks/inquiry_alert.pb.js)과 같은 규칙.
// 웹훅(SLACK_WEBHOOK)이 없거나 전송이 실패해도 접수 자체는 그대로 저장된다 — 알림은 덤이지 조건이 아니다.
// 테스트 건(이름이 e2e_ 로 시작)은 보내지 않는다.
export async function slackAlert(title: string, fields: Record<string, unknown>): Promise<void> {
  const hook = process.env.SLACK_WEBHOOK;
  if (!hook || /^e2e_/.test(String(fields['이름'] ?? ''))) return;
  const lines = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `*${k}* ${v}`)
    .join('\n');
  const admin = `${process.env.PUBLIC_URL || ''}/admin/`;
  try {
    await fetch(hook, {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify({text: `📝 ${title}\n${lines}\n<${admin}|관리자에서 보기>`}),
      signal: AbortSignal.timeout(10_000)
    });
  } catch (err) {
    console.log('slack alert failed', err);
  }
}
