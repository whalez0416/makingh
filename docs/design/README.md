# 메인 히어로 디자인 시안 (2026-09-29)

브라우저로 바로 여는 단독 HTML 두 장. 사이트 빌드와 무관하다(`docs/` 는 배포에 안 실림).

| 파일 | 내용 | 온라인 사본 |
|---|---|---|
| `hero-photo-proposal.html` | 메인 사진 교체 방향 3안(권장: 원장·세포처리실 실사, 임시: 피부 매크로), 촬영 컷 리스트·규격 | https://claude.ai/artifact/2TGv8kBRksTxPKbgLGPXxQ |
| `hero-skin-lift-motion.html` | 배경 피부가 마우스(폰은 손가락)를 따라 탄력 있게 당겨지는 모션 시안. 첫 화면 1회·스크롤 연동·세기 비교 | https://claude.ai/artifact/EkPsQqpiFoyhYdqPyNiPFq |

모션 시안의 피부는 합성 질감이다. 실제 적용은 `src/sections/Hero.tsx` 의 `hero-photo` 자리에 WebGL 캔버스(셰이더 약 3KB)를 얹고,
WebGL 이 없거나 움직임 줄이기면 지금의 정지 사진으로 둔다. 필요한 사진: 옆 45도 뺨·턱선·목 클로즈업, 가로 2400px 이상.
