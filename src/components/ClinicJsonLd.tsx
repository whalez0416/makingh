import {site, siteUrl} from '@/lib/site';

// 병원 구조화 데이터(브리프 §6-4 JSON-LD MedicalClinic + Physician). 전 페이지 공통이라 layout 에서 한 번.
// sameAs 에 옛 사이트(www.dittocell.com)를 넣어 두 사이트가 같은 병원이라는 걸 검색엔진에 알린다 — 두 사이트 병행 운영(2026-10-06 결정).
// ponytail: 고정값은 lib/site.ts 그대로 — 관리자에서 주소·전화를 바꾸면 여기도 바꿔야 한다. 바뀌는 일이 드물어 CMS 연동은 생략.
export default function ClinicJsonLd({locale, name}: {locale: string; name: string}) {
  const clinicId = `${siteUrl}/#clinic`;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalClinic',
        '@id': clinicId,
        name,
        alternateName: [site.name, '디토셀', site.nameEn, 'DITTOCELL Clinic'],
        url: `${siteUrl}/${locale}/`,
        image: `${siteUrl}/og.jpg`,
        logo: `${siteUrl}/icon.png`,
        telephone: '+82-2-564-7774',
        faxNumber: '+82-2-564-7775',
        medicalSpecialty: ['Dermatology', 'RegenerativeMedicine'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: '언주로 554, 3층',
          addressLocality: '강남구',
          addressRegion: '서울특별시',
          addressCountry: 'KR'
        },
        openingHoursSpecification: [
          {'@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Friday'], opens: '10:00', closes: '20:00'},
          {'@type': 'OpeningHoursSpecification', dayOfWeek: ['Tuesday', 'Wednesday'], opens: '10:00', closes: '19:00'},
          {'@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '16:00'}
        ],
        sameAs: ['https://www.dittocell.com/', site.instagram, site.kakao],
        employee: {'@id': `${siteUrl}/#director`}
      },
      {
        '@type': 'Physician',
        '@id': `${siteUrl}/#director`,
        name: site.director,
        jobTitle: '대표원장',
        honorificSuffix: site.directorTitle,
        worksFor: {'@id': clinicId},
        url: `${siteUrl}/${locale}/about/`
      }
    ]
  };
  return (
    <script
      type="application/ld+json"
      // JSON 안의 '<' 를 이스케이프해 </script> 로 끊기는 일을 막는다.
      dangerouslySetInnerHTML={{__html: JSON.stringify(data).replace(/</g, '\\u003c')}}
    />
  );
}
