import { Metadata } from 'next';
import { Suspense } from 'react';
import SearchClient from './SearchClient';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ddokcheck.com';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q || '';

  if (!query) {
    return {
      title: '상품 검색 | 똑체크 - 쿠팡 가격비교',
      description: '쿠팡 상품을 검색하고 가격 변동을 추적하세요. 최저가 알림으로 똑똑하게 쇼핑하세요.',
      openGraph: {
        title: '상품 검색 | 똑체크',
        description: '쿠팡 상품 검색 및 가격 추적 서비스',
        url: `${BASE_URL}/search`,
        siteName: '똑체크',
        locale: 'ko_KR',
        type: 'website',
      },
      alternates: {
        canonical: `${BASE_URL}/search`,
      },
    };
  }

  return {
    title: `"${query}" 검색 결과 | 똑체크 - 쿠팡 가격비교`,
    description: `쿠팡에서 "${query}" 검색 결과를 확인하세요. 가격 변동 추적, 최저가 알림으로 최적의 구매 타이밍을 잡으세요.`,
    keywords: [query, `${query} 최저가`, `${query} 가격비교`, `쿠팡 ${query}`, `${query} 가격변동`],
    openGraph: {
      title: `"${query}" 검색 결과 | 똑체크`,
      description: `쿠팡 "${query}" 상품 검색 결과 및 가격 추적`,
      url: `${BASE_URL}/search?q=${encodeURIComponent(query)}`,
      siteName: '똑체크',
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `"${query}" 검색 결과 | 똑체크`,
      description: `쿠팡 "${query}" 가격 비교 및 추적`,
    },
    alternates: {
      canonical: `${BASE_URL}/search?q=${encodeURIComponent(query)}`,
    },
    robots: {
      index: query.length >= 2,
      follow: true,
    },
  };
}

// JSON-LD 구조화 데이터
function generateSearchActionJsonLd(query: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: query ? `"${query}" 검색 결과` : '상품 검색',
    description: query
      ? `쿠팡에서 "${query}" 검색 결과`
      : '쿠팡 상품 검색 페이지',
    url: query ? `${BASE_URL}/search?q=${encodeURIComponent(query)}` : `${BASE_URL}/search`,
    mainEntity: {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      name: '똑체크',
      url: BASE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  };
}

function generateBreadcrumbJsonLd(query: string) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: '홈',
      item: BASE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '검색',
      item: `${BASE_URL}/search`,
    },
  ];

  if (query) {
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: `"${query}" 검색 결과`,
      item: `${BASE_URL}/search?q=${encodeURIComponent(query)}`,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

function SearchLoading() {
  return (
    <div className="min-h-screen bg-[#f2f4f6]">
      <div className="bg-white border-b border-[#e5e8eb]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="h-8 w-48 skeleton rounded-lg" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="toss-card-flat p-16 text-center border border-[#e5e8eb]">
          <div className="spinner-lg mx-auto mb-4" />
          <p className="toss-body-1 text-[#6b7684]">로딩 중...</p>
        </div>
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || '';

  const searchActionJsonLd = generateSearchActionJsonLd(query);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(query);

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchActionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Suspense fallback={<SearchLoading />}>
        <SearchClient initialQuery={query} />
      </Suspense>
    </>
  );
}
