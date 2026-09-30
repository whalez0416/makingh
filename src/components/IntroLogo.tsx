import Logo from '@/components/Logo';

// 홈 첫 진입 인트로 (2026-09-29, 09-30 로고로 교체): 로고가 왼쪽부터 그려지고, 옅은 복제본이 겹쳐 들어온 뒤(Ditto = 다시 한 번)
// 헤더 로고 자리로 날아가며 어두운 막이 걷힌다. 세션당 1회, 동작 줄이기 설정이면 생략.
// 순서 전체를 인라인 스크립트로 돌린다 — 첫 페인트 전에 생략 여부가 정해지고(재방문 깜빡임 없음),
// React 가 컴포넌트를 다시 붙여도 타이머가 끊기지 않는다.
// 확인용: 주소 뒤에 ?intro 를 붙이면 본 적 있어도 다시 나온다.
// 인트로 동안 메인 1번 영상을 받아 두고, 막이 걷히면 영상이 처음부터 재생된다(HeroHeadline).
// JS 가 죽어도 CSS 안전장치(intro-failsafe)가 4.5초 뒤 막을 걷는다.
const SEEN = 'ditto-intro-seen';

const run = `(function(){
var d=document.documentElement,K='${SEEN}';
function skip(){d.classList.remove('intro-on','intro-fly');d.classList.add('intro-skip')}
try{if((sessionStorage.getItem(K)&&location.search.indexOf('intro')<0)||matchMedia('(prefers-reduced-motion: reduce)').matches){skip();return}sessionStorage.setItem(K,'1')}catch(e){skip();return}
d.classList.add('intro-on');
// 1.5초 연출이 끝나도 메인 영상이 아직이면 준비될 때까지(최대 1.5초 더) 기다렸다가 걷는다
function ready(go){var v=document.querySelector('.hero-photo video'),f=0;function once(){if(!f){f=1;go()}}
  if(!v||v.readyState>=3){once();return}v.addEventListener('canplay',once);setTimeout(once,1500)}
setTimeout(function(){ready(function(){
  var el=document.querySelector('.intro'),w=document.querySelector('.intro-word'),t=document.querySelector('[data-site-logo]');
  d.classList.remove('intro-on');d.classList.add('intro-fly');
  if(!el||!w||!el.animate){skip();return}
  var ease='cubic-bezier(0.7, 0, 0.2, 1)';
  if(t&&t.offsetWidth){
    var a=w.getBoundingClientRect(),b=t.getBoundingClientRect();
    w.animate([{transform:'none'},{transform:'translate('+(b.left-a.left)+'px,'+(b.top+b.height/2-a.top-a.height/2)+'px) scale('+(b.width/a.width)+')'}],{duration:900,easing:ease,fill:'forwards'});
  }
  el.animate([{backgroundColor:getComputedStyle(el).backgroundColor},{backgroundColor:'transparent'}],{duration:900,easing:ease,fill:'forwards'});
  setTimeout(skip,900);
})},1500);
})();`;

export default function IntroLogo() {
  return (
    <>
      <script dangerouslySetInnerHTML={{__html: run}} />
      <div className="intro" aria-hidden>
        <span className="intro-word">
          <Logo className="intro-logo" />
          <Logo className="intro-echo" />
        </span>
      </div>
    </>
  );
}
