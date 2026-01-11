import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://coupang-price.vercel.app';

export const metadata: Metadata = {
  title: '상품 검색 | 쿠팡 최저가 - 실시간 가격 비교',
  description: '쿠팡 상품을 검색하고 실시간 가격을 비교하세요. 로켓배송, 무료배송 상품을 한눈에 확인! 최저가 알림으로 최적의 구매 타이밍을 잡으세요.',
  keywords: ['쿠팡 검색', '쿠팡 상품 검색', '가격 비교', '최저가 검색', '쿠팡 할인'],
  openGraph: {
    title: '상품 검색 | 쿠팡 최저가',
    description: '쿠팡 상품을 검색하고 실시간 가격을 비교하세요.',
    url: `${BASE_URL}/search`,
    siteName: '쿠팡 최저가',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '상품 검색 | 쿠팡 최저가',
    description: '쿠팡 상품을 검색하고 가격을 비교하세요.',
  },
  alternates: {
    canonical: `${BASE_URL}/search`,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
