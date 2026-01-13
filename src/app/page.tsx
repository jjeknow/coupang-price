import ProductGrid from '@/components/ui/ProductGrid';
import { getGoldboxProductsWithPriceData, getBestProductsWithPriceData } from '@/lib/coupang-api';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import HeroSearch from '@/components/home/HeroSearch';
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
      <HeroSearch />

      {/* 카테고리 선택 섹션 */}
      <CategorySection />

      {/* 최근 본 상품 */}
      <RecentlyViewed />

      {/* 골드박스 섹션 */}
      <section className="bg-[#f8f9fa] py-6 sm:py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[24px] sm:text-[32px]">🎁</span>
              <div>
                <h2 className="text-[17px] sm:text-[20px] font-bold text-[#191f28]">쿠팡 골드박스 가격변동</h2>
                <p className="text-[11px] sm:text-[13px] text-[#8b95a1]">실시간 최저가 추적 · 매일 업데이트</p>
              </div>
            </div>
          </div>
          {goldboxProducts.length > 0 ? (
            <ProductGrid products={goldboxProducts} />
          ) : (
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center">
              <p className="text-[32px] sm:text-[40px] mb-4">⏳</p>
              <p className="text-[#191f28] font-medium mb-2">상품을 준비 중입니다</p>
              <p className="text-[12px] sm:text-[13px] text-[#8b95a1]">잠시 후 다시 시도해주세요</p>
            </div>
          )}
        </div>
      </section>

      {/* 가전/디지털 섹션 */}
      <section className="bg-white py-6 sm:py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[24px] sm:text-[32px]">📺</span>
              <div>
                <h2 className="text-[17px] sm:text-[20px] font-bold text-[#191f28]">가전/디지털 가격비교</h2>
                <p className="text-[11px] sm:text-[13px] text-[#8b95a1]">쿠팡 가격 그래프로 최저가 확인</p>
              </div>
            </div>
            <Link
              href="/category/1016"
              className="flex items-center gap-0.5 sm:gap-1 text-[13px] sm:text-[14px] text-[#3182f6] font-medium min-h-[44px] px-2 active:bg-[#e8f3ff] rounded-lg"
            >
              전체보기
              <ChevronRight size={16} />
            </Link>
          </div>
          {electronicsProducts.length > 0 ? (
            <ProductGrid products={electronicsProducts} />
          ) : (
            <div className="bg-[#f8f9fa] rounded-2xl p-8 sm:p-12 text-center">
              <p className="text-[32px] sm:text-[40px] mb-4">⏳</p>
              <p className="text-[#191f28] font-medium mb-2">상품을 준비 중입니다</p>
              <p className="text-[12px] sm:text-[13px] text-[#8b95a1]">잠시 후 다시 시도해주세요</p>
            </div>
          )}
        </div>
      </section>

      {/* 식품 섹션 */}
      <section className="bg-[#f8f9fa] py-6 sm:py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[24px] sm:text-[32px]">🍎</span>
              <div>
                <h2 className="text-[17px] sm:text-[20px] font-bold text-[#191f28]">식품 가격변동 추적</h2>
                <p className="text-[11px] sm:text-[13px] text-[#8b95a1]">쿠팡 로켓배송 최저가 알림</p>
              </div>
            </div>
            <Link
              href="/category/1012"
              className="flex items-center gap-0.5 sm:gap-1 text-[13px] sm:text-[14px] text-[#3182f6] font-medium min-h-[44px] px-2 active:bg-[#e8f3ff] rounded-lg"
            >
              전체보기
              <ChevronRight size={16} />
            </Link>
          </div>
          {foodProducts.length > 0 ? (
            <ProductGrid products={foodProducts} />
          ) : (
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center">
              <p className="text-[32px] sm:text-[40px] mb-4">⏳</p>
              <p className="text-[#191f28] font-medium mb-2">상품을 준비 중입니다</p>
              <p className="text-[12px] sm:text-[13px] text-[#8b95a1]">잠시 후 다시 시도해주세요</p>
            </div>
          )}
        </div>
      </section>

      {/* 뷰티 섹션 */}
      <section className="bg-white py-6 sm:py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[24px] sm:text-[32px]">💄</span>
              <div>
                <h2 className="text-[17px] sm:text-[20px] font-bold text-[#191f28]">뷰티 가격변동 알리미</h2>
                <p className="text-[11px] sm:text-[13px] text-[#8b95a1]">쿠팡 가격비교로 똑똑한 쇼핑</p>
              </div>
            </div>
            <Link
              href="/category/1010"
              className="flex items-center gap-0.5 sm:gap-1 text-[13px] sm:text-[14px] text-[#3182f6] font-medium min-h-[44px] px-2 active:bg-[#e8f3ff] rounded-lg"
            >
              전체보기
              <ChevronRight size={16} />
            </Link>
          </div>
          {beautyProducts.length > 0 ? (
            <ProductGrid products={beautyProducts} />
          ) : (
            <div className="bg-[#f8f9fa] rounded-2xl p-8 sm:p-12 text-center">
              <p className="text-[32px] sm:text-[40px] mb-4">⏳</p>
              <p className="text-[#191f28] font-medium mb-2">상품을 준비 중입니다</p>
              <p className="text-[12px] sm:text-[13px] text-[#8b95a1]">잠시 후 다시 시도해주세요</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ 섹션 */}
      <section className="bg-[#f8f9fa] py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-[32px] sm:text-[40px]">❓</span>
            <h2 className="text-[20px] sm:text-[24px] font-bold text-[#191f28] mt-2">자주 묻는 질문</h2>
            <p className="text-[13px] sm:text-[14px] text-[#6b7684] mt-1">똑체크 서비스에 대해 궁금한 점을 확인하세요</p>
          </div>
          <div className="space-y-3">
            {faqData.map((faq, index) => (
              <details
                key={index}
                className="bg-white rounded-xl border border-[#e5e8eb] overflow-hidden group"
              >
                <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-[#f8f9fa] transition-colors">
                  <span className="text-[14px] sm:text-[15px] font-medium text-[#191f28] pr-4">{faq.question}</span>
                  <span className="text-[#8b95a1] flex-shrink-0 transition-transform group-open:rotate-180">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </summary>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                  <p className="text-[13px] sm:text-[14px] text-[#6b7684] leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 서비스 특징 섹션 */}
      <section className="bg-white py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-[20px] sm:text-[24px] font-bold text-[#191f28]">똑체크로 똑똑하게 쇼핑하세요</h2>
            <p className="text-[13px] sm:text-[14px] text-[#6b7684] mt-1">쿠팡 가격 추적의 모든 것</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-[#f8f9fa] rounded-2xl p-6 text-center">
              <span className="text-[36px] block mb-3">📊</span>
              <h3 className="text-[15px] font-bold text-[#191f28] mb-2">가격 그래프</h3>
              <p className="text-[13px] text-[#6b7684]">30일간의 가격 변동을 한눈에 확인</p>
            </div>
            <div className="bg-[#f8f9fa] rounded-2xl p-6 text-center">
              <span className="text-[36px] block mb-3">🔔</span>
              <h3 className="text-[15px] font-bold text-[#191f28] mb-2">최저가 알림</h3>
              <p className="text-[13px] text-[#6b7684]">목표 가격에 도달하면 알림</p>
            </div>
            <div className="bg-[#f8f9fa] rounded-2xl p-6 text-center">
              <span className="text-[36px] block mb-3">🚀</span>
              <h3 className="text-[15px] font-bold text-[#191f28] mb-2">로켓배송 추적</h3>
              <p className="text-[13px] text-[#6b7684]">로켓배송 상품 가격도 추적</p>
            </div>
            <div className="bg-[#f8f9fa] rounded-2xl p-6 text-center">
              <span className="text-[36px] block mb-3">💰</span>
              <h3 className="text-[15px] font-bold text-[#191f28] mb-2">완전 무료</h3>
              <p className="text-[13px] text-[#6b7684]">모든 기능 무료로 이용</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
