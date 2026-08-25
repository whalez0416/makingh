import {routing} from '@/i18n/routing';

// 정적 내보내기에는 미들웨어가 없어서 "/" 를 기본 언어로 보내는 일을 이 페이지가 한다.
// redirect() 는 export 하면 에러 페이지로 굳는다 → meta refresh 로 넘긴다.
// 상대경로라 basePath 가 있든(/makingh/) 없든(/) 그대로 동작한다.
const target = `./${routing.defaultLocale}/`;

export default function RootPage() {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
      </head>
      <body>
        <a href={target}>디토셀의원</a>
      </body>
    </html>
  );
}
