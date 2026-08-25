// next-intl: 실제 <html> 은 [locale]/layout.tsx 가 그린다 (lang 속성이 locale 에 달려 있어서).
export default function RootLayout({children}: {children: React.ReactNode}) {
  return children;
}
