import ProductGrid from '@/components/ui/ProductGrid';
import { getGoldboxProductsWithPriceData, getBestProductsWithPriceData } from '@/lib/coupang-api';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import RecentlyViewed from '@/components/home/RecentlyViewed';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ddokcheck.com';

// FAQ 데이터 (SEO용)
const faqData = [
  {
    question: '똑체크는 어떤 서비스인가요?',
    answer: '똑체크는 쿠팡 상품의 가격 변동을 추적하고, 최저가 알림을 제공하는 무료 서비스입니다. 30일간의 가격 히스토리를 그래프로 확인하고, 원하는 가격에 도달하면 알림을 받을 수 있습니다.',
  },
  {
    question: '가격 추적은 어떻게 하나요?',
    answer: '원하는 상품을 검색하거나 카테고리에서 선택한 후, 상품 상세 페이지에서 "최저가 알림" 버튼을 클릭하세요. 목표 가격을 설정하면, 해당 가격 이하로 떨어질 때 알림을 받을 수 있습니다.',
  },
  {
    question: '서비스 이용료가 있나요?',
    answer: '아니요, 똑체크는 완전 무료 서비스입니다. 쿠팡 파트너스 프로그램을 통해 운영되며, 사용자에게 추가 비용이 발생하지 않습니다.',
  },
  {
    question: '어떤 상품을 추적할 수 있나요?',
    answer: '쿠팡에서 판매되는 모든 상품의 가격을 추적할 수 있습니다. 로켓배송, 로켓프레시, 일반배송 상품 모두 지원됩니다.',
  },
  {
    question: '가격 데이터는 얼마나 정확한가요?',
    answer: '가격 데이터는 매일 업데이트되며, 쿠팡 API를 통해 실시간으로 수집됩니다. 단, 일부 프로모션 가격이나 쿠폰 할인은 반영되지 않을 수 있습니다.',
  },
];

// FAQ JSON-LD 스키마
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

// HowTo JSON-LD 스키마 (가격 추적 방법)
const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: '쿠팡 상품 최저가 알림 설정하는 방법',
  description: '똑체크에서 쿠팡 상품의 가격을 추적하고 최저가 알림을 설정하는 방법을 알아보세요.',
  totalTime: 'PT2M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'KRW',
    value: '0',
  },
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: '상품 검색',
      text: '상단 검색창에서 원하는 상품명이나 브랜드를 검색하세요.',
      url: `${BASE_URL}/search`,
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: '상품 선택',
      text: '검색 결과나 카테고리에서 가격을 추적할 상품을 선택하세요.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: '가격 그래프 확인',
      text: '상품 상세 페이지에서 30일간의 가격 변동 그래프를 확인하세요.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: '알림 설정',
      text: '"최저가 알림" 버튼을 클릭하고 목표 가격을 설정하면 알림을 받을 수 있습니다.',
    },
  ],
};

export default async function HomePage() {
  const [goldboxProducts, electronicsProducts, foodProducts, beautyProducts] =
    await Promise.all([
      getGoldboxProductsWithPriceData().catch(() => []),
      getBestProductsWithPriceData(1016, 10).catch(() => []),
      getBestProductsWithPriceData(1012, 10).catch(() => []),
      getBestProductsWithPriceData(1010, 10).catch(() => []),
    ]);

  return (
    <div className="min-h-screen">
      {/* JSON-LD 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      {/* 히어로 검색 섹션 */}
      <HeroSection />

      {/* 카테고리 선택 섹션 */}
      <CategorySection />

      {/* 최근 본 상품 */}
      <RecentlyViewed />

      {/* 골드박스 섹션 */}
      <section className="bg-[#f8f9fa] py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[24px]">🎁</span>
              <div>
                <h2 className="text-[17px] font-bold text-[#191f28]">쿠팡 골드박스 가격변동</h2>
                <p className="text-[11px] text-[#5c6470]">실시간 최저가 추적 · 매일 업데이트</p>
              </div>
            </div>
          </div>
          {goldboxProducts.length > 0 ? (
            <ProductGrid products={goldboxProducts} />
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center">
              <p className="text-[32px] mb-4">⏳</p>
              <p className="text-[#191f28] font-medium mb-2">상품을 준비 중입니다</p>
              <p className="text-[12px] text-[#5c6470]">잠시 후 다시 시도해주세요</p>
            </div>
          )}
        </div>
      </section>

      {/* 가전/디지털 섹션 */}
      <section className="bg-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[24px]">📺</span>
              <div>
                <h2 className="text-[17px] font-bold text-[#191f28]">가전/디지털 가격비교</h2>
                <p className="text-[11px] text-[#5c6470]">쿠팡 가격 그래프로 최저가 확인</p>
              </div>
            </div>
            <Link
              href="/category/1016"
              className="flex items-center gap-0.5 text-[13px] text-[#1d4ed8] font-medium min-h-[44px] px-2 active:bg-[#e8f3ff] rounded-lg"
            >
              전체보기
              <ChevronRight size={16} />
            </Link>
          </div>
          {electronicsProducts.length > 0 ? (
            <ProductGrid products={electronicsProducts} />
          ) : (
            <div className="bg-[#f8f9fa] rounded-2xl p-8 text-center">
              <p className="text-[32px] mb-4">⏳</p>
              <p className="text-[#191f28] font-medium mb-2">상품을 준비 중입니다</p>
              <p className="text-[12px] text-[#5c6470]">잠시 후 다시 시도해주세요</p>
            </div>
          )}
        </div>
      </section>

      {/* 식품 섹션 */}
      <section className="bg-[#f8f9fa] py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[24px]">🍎</span>
              <div>
                <h2 className="text-[17px] font-bold text-[#191f28]">식품 가격변동 추적</h2>
                <p className="text-[11px] text-[#5c6470]">쿠팡 로켓배송 최저가 알림</p>
              </div>
            </div>
            <Link
              href="/category/1012"
              className="flex items-center gap-0.5 text-[13px] text-[#1d4ed8] font-medium min-h-[44px] px-2 active:bg-[#e8f3ff] rounded-lg"
            >
              전체보기
              <ChevronRight size={16} />
            </Link>
          </div>
          {foodProducts.length > 0 ? (
            <ProductGrid products={foodProducts} />
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center">
              <p className="text-[32px] mb-4">⏳</p>
              <p className="text-[#191f28] font-medium mb-2">상품을 준비 중입니다</p>
              <p className="text-[12px] text-[#5c6470]">잠시 후 다시 시도해주세요</p>
            </div>
          )}
        </div>
      </section>

      {/* 뷰티 섹션 */}
      <section className="bg-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[24px]">💄</span>
              <div>
                <h2 className="text-[17px] font-bold text-[#191f28]">뷰티 가격변동 알리미</h2>
                <p className="text-[11px] text-[#5c6470]">쿠팡 가격비교로 똑똑한 쇼핑</p>
              </div>
            </div>
            <Link
              href="/category/1010"
              className="flex items-center gap-0.5 text-[13px] text-[#1d4ed8] font-medium min-h-[44px] px-2 active:bg-[#e8f3ff] rounded-lg"
            >
              전체보기
              <ChevronRight size={16} />
            </Link>
          </div>
          {beautyProducts.length > 0 ? (
            <ProductGrid products={beautyProducts} />
          ) : (
            <div className="bg-[#f8f9fa] rounded-2xl p-8 text-center">
              <p className="text-[32px] mb-4">⏳</p>
              <p className="text-[#191f28] font-medium mb-2">상품을 준비 중입니다</p>
              <p className="text-[12px] text-[#5c6470]">잠시 후 다시 시도해주세요</p>
            </div>
          )}
        </div>
      </section>

      {/* 파트너스 고지 */}
      <footer className="py-3 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-[11px] text-[#5c6470] leading-[1.5]">
            본 서비스는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다. 가격 및 재고는 쿠팡에서 실시간으로 변동될 수 있으며, 수수료는 서비스 운영에 사용됩니다.
          </p>
        </div>
      </footer>

    </div>
  );
}
