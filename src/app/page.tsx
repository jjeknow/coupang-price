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
      <section className="bg-[#f8f9fa] py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-[32px]">🎁</span>
              <div>
                <h2 className="text-[20px] font-bold text-[#191f28]">오늘의 골드박스</h2>
                <p className="text-[13px] text-[#8b95a1]">매일 오전 7:30 업데이트</p>
              </div>
            </div>
          </div>
          {goldboxProducts.length > 0 ? (
            <ProductGrid products={goldboxProducts} />
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center">
              <p className="text-[40px] mb-4">⏳</p>
              <p className="text-[#191f28] font-medium mb-2">상품을 준비 중입니다</p>
              <p className="text-[13px] text-[#8b95a1]">잠시 후 다시 시도해주세요</p>
            </div>
          )}
        </div>
      </section>

      {/* 가전/디지털 섹션 */}
      <section className="bg-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-[32px]">📺</span>
              <div>
                <h2 className="text-[20px] font-bold text-[#191f28]">가전/디지털 인기상품</h2>
                <p className="text-[13px] text-[#8b95a1]">지금 가장 많이 찾는 제품</p>
              </div>
            </div>
            <Link
              href="/category/1016"
              className="flex items-center gap-1 text-[14px] text-[#3182f6] font-medium hover:underline"
            >
              전체보기
              <ChevronRight size={16} />
            </Link>
          </div>
          {electronicsProducts.length > 0 ? (
            <ProductGrid products={electronicsProducts} />
          ) : (
            <div className="bg-[#f8f9fa] rounded-2xl p-12 text-center">
              <p className="text-[40px] mb-4">⏳</p>
              <p className="text-[#191f28] font-medium mb-2">상품을 준비 중입니다</p>
              <p className="text-[13px] text-[#8b95a1]">잠시 후 다시 시도해주세요</p>
            </div>
          )}
        </div>
      </section>

      {/* 식품 섹션 */}
      <section className="bg-[#f8f9fa] py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-[32px]">🍎</span>
              <div>
                <h2 className="text-[20px] font-bold text-[#191f28]">식품 인기상품</h2>
                <p className="text-[13px] text-[#8b95a1]">신선하고 맛있는 먹거리</p>
              </div>
            </div>
            <Link
              href="/category/1012"
              className="flex items-center gap-1 text-[14px] text-[#3182f6] font-medium hover:underline"
            >
              전체보기
              <ChevronRight size={16} />
            </Link>
          </div>
          {foodProducts.length > 0 ? (
            <ProductGrid products={foodProducts} />
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center">
              <p className="text-[40px] mb-4">⏳</p>
              <p className="text-[#191f28] font-medium mb-2">상품을 준비 중입니다</p>
              <p className="text-[13px] text-[#8b95a1]">잠시 후 다시 시도해주세요</p>
            </div>
          )}
        </div>
      </section>

      {/* 뷰티 섹션 */}
      <section className="bg-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-[32px]">💄</span>
              <div>
                <h2 className="text-[20px] font-bold text-[#191f28]">뷰티 인기상품</h2>
                <p className="text-[13px] text-[#8b95a1]">아름다움을 위한 선택</p>
              </div>
            </div>
            <Link
              href="/category/1010"
              className="flex items-center gap-1 text-[14px] text-[#3182f6] font-medium hover:underline"
            >
              전체보기
              <ChevronRight size={16} />
            </Link>
          </div>
          {beautyProducts.length > 0 ? (
            <ProductGrid products={beautyProducts} />
          ) : (
            <div className="bg-[#f8f9fa] rounded-2xl p-12 text-center">
              <p className="text-[40px] mb-4">⏳</p>
              <p className="text-[#191f28] font-medium mb-2">상품을 준비 중입니다</p>
              <p className="text-[13px] text-[#8b95a1]">잠시 후 다시 시도해주세요</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
