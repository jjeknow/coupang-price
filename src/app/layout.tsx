import type { Metadata, Viewport } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SessionProvider from '@/components/providers/SessionProvider';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
  preload: true,
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://coupang-price.vercel.app';

// SEO 최적화 메타데이터 - 상위 0.01% 수준
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // 기본 메타데이터
  title: {
    default: '쿠팡 최저가 | 실시간 가격 추적 & 역대 최저가 알림 서비스',
    template: '%s | 쿠팡 최저가 - 가격 추적 서비스',
  },
  description:
    '쿠팡 상품의 실시간 가격 변동을 추적하고 역대 최저가 알림을 받으세요. 골드박스 특가, 로켓배송 할인 정보를 한눈에! 30일 가격 히스토리 차트로 최적의 구매 타이밍을 찾아보세요.',
  keywords: [
    '쿠팡 최저가',
    '쿠팡 가격 추적',
    '쿠팡 가격 비교',
    '쿠팡 할인',
    '쿠팡 골드박스',
    '쿠팡 로켓배송',
    '쿠팡 특가',
    '가격비교 사이트',
    '최저가 알림',
    '역대 최저가',
    '쿠팡 파트너스',
    '오늘의 특가',
    '쿠팡 베스트',
    '가격 변동 알림',
    '스마트 쇼핑',
  ],
  authors: [{ name: '쿠팡 최저가', url: BASE_URL }],
  creator: '쿠팡 최저가',
  publisher: '쿠팡 최저가',

  // 로봇 설정 - 크롤링 최적화
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph (페이스북, 카카오톡 등) - 상세 설정
  // OG 이미지는 opengraph-image.tsx에서 동적 생성됨
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: BASE_URL,
    siteName: '쿠팡 최저가',
    title: '쿠팡 최저가 | 실시간 가격 추적 & 역대 최저가 알림',
    description:
      '쿠팡 상품의 실시간 가격 변동을 추적하고 역대 최저가 알림을 받으세요. 30일 가격 차트로 최적의 구매 타이밍을 찾아보세요!',
    countryName: 'South Korea',
  },

  // 트위터 카드 - twitter-image.tsx에서 동적 생성됨
  twitter: {
    card: 'summary_large_image',
    site: '@coupang_price',
    creator: '@coupang_price',
    title: '쿠팡 최저가 | 실시간 가격 추적 서비스',
    description: '쿠팡 상품의 가격 변동을 추적하고 역대 최저가 알림을 받으세요. 스마트한 쇼핑의 시작!',
  },

  // 검색엔진 인증
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
    yandex: process.env.YANDEX_VERIFICATION || '',
    other: {
      'naver-site-verification': process.env.NAVER_SITE_VERIFICATION || '',
    },
  },

  // 기타 메타
  category: '쇼핑',
  classification: '가격비교',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Canonical URL 및 다국어 대체 링크
  alternates: {
    canonical: BASE_URL,
    languages: {
      'ko-KR': BASE_URL,
    },
  },

  // PWA 앱 설정
  applicationName: '쿠팡 최저가',
  appleWebApp: {
    capable: true,
    title: '쿠팡 최저가',
    statusBarStyle: 'black-translucent',
  },

  // 아이콘 (네이버 SEO: 파비콘 필수)
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
  },

  // 매니페스트
  manifest: '/manifest.json',

  // 기타 링크
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#3182f6',
    'msapplication-config': '/browserconfig.xml',
  },
};

// 뷰포트 설정
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#191f28' },
  ],
  colorScheme: 'light',
};

// JSON-LD 구조화 데이터 (Schema.org) - 여러 스키마 포함
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: '쿠팡 최저가',
  alternateName: ['Coupang Price Tracker', '쿠팡 가격 추적'],
  description: '쿠팡 상품의 실시간 가격 변동을 추적하고 역대 최저가 알림을 받으세요.',
  url: BASE_URL,
  inLanguage: 'ko-KR',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@id': `${BASE_URL}/#organization`,
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: '쿠팡 최저가',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'Korean',
  },
};

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '쿠팡 최저가',
  url: BASE_URL,
  applicationCategory: 'ShoppingApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KRW',
  },
  featureList: [
    '실시간 가격 추적',
    '역대 최저가 알림',
    '30일 가격 히스토리',
    '카테고리별 베스트 상품',
    '골드박스 특가 정보',
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '홈',
      item: BASE_URL,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* JSON-LD 구조화 데이터 - 다중 스키마 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        {/* 추가 SEO 메타 태그 */}
        <meta name="subject" content="쿠팡 가격 추적 서비스" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="revisit-after" content="1 days" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        {/* 네이버 SEO 특화 메타 태그 */}
        <meta name="NaverBot" content="All" />
        <meta name="Yeti" content="all" />
        {/* 다음 SEO */}
        <meta name="daumoa" content="index,follow" />
        {/* 빙 SEO */}
        <meta name="bingbot" content="index,follow" />
        {/* 지역 타겟팅 */}
        <meta name="geo.region" content="KR" />
        <meta name="geo.placename" content="South Korea" />
        {/* 콘텐츠 언어 */}
        <meta httpEquiv="content-language" content="ko-KR" />
        {/* 프리로드 - 성능 최적화 */}
        <link rel="preconnect" href="https://thumbnail6.coupangcdn.com" />
        <link rel="preconnect" href="https://thumbnail7.coupangcdn.com" />
        <link rel="preconnect" href="https://thumbnail8.coupangcdn.com" />
        <link rel="preconnect" href="https://thumbnail9.coupangcdn.com" />
        <link rel="preconnect" href="https://thumbnail10.coupangcdn.com" />
        <link rel="dns-prefetch" href="https://thumbnail6.coupangcdn.com" />
        <link rel="dns-prefetch" href="https://thumbnail7.coupangcdn.com" />
        {/* RSS 피드 */}
        <link rel="alternate" type="application/rss+xml" title="쿠팡 최저가 RSS" href="/rss.xml" />
        {/* 사이트맵 */}
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
      </head>
      <body className={`${notoSansKr.variable} font-sans antialiased bg-gray-50`}>
        <SessionProvider>
          {/* 스킵 네비게이션 - 접근성 */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#3182f6] focus:text-white focus:rounded-lg"
          >
            본문으로 바로가기
          </a>
          <Header />
          <main id="main-content" className="min-h-screen" role="main">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
