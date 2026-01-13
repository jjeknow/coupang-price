import ProductGrid from '@/components/ui/ProductGrid';
import { getGoldboxProducts, getBestProducts } from '@/lib/coupang-api';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import HeroSearch from '@/components/home/HeroSearch';
import CategorySection from '@/components/home/CategorySection';
import RecentlyViewed from '@/components/home/RecentlyViewed';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [goldboxProducts, electronicsProducts, foodProducts, beautyProducts] =
    await Promise.all([
      getGoldboxProducts().catch(() => []),
      getBestProducts(1016, 10).catch(() => []),
      getBestProducts(1012, 10).catch(() => []),
      getBestProducts(1010, 10).catch(() => []),
    ]);

  return (
    <div className="min-h-screen">
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
    </div>
  );
}
