import { notFound } from 'next/navigation';
import ProductGrid from '@/components/ui/ProductGrid';
import { getBestProducts, CATEGORIES } from '@/lib/coupang-api';

export const dynamic = 'force-dynamic';

// 카테고리 이모지 매핑
const categoryEmojis: Record<number, string> = {
  1001: '👗',
  1002: '👔',
  1010: '💄',
  1011: '👶',
  1012: '🍎',
  1013: '🍳',
  1014: '🧹',
  1015: '🛋️',
  1016: '📺',
  1017: '⚽',
  1018: '🚗',
  1019: '📚',
  1020: '🎮',
  1021: '✏️',
  1024: '💊',
  1029: '🐶',
  1030: '👶',
};

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { id } = await params;
  const categoryId = parseInt(id);
  const categoryName = CATEGORIES[categoryId];

  if (!categoryName) {
    return { title: '카테고리를 찾을 수 없습니다' };
  }

  return {
    title: `${categoryName} 베스트 상품 - 최저가`,
    description: `쿠팡 ${categoryName} 카테고리 베스트 상품을 확인하세요. 가격 변동 추적, 최저가 알림 제공!`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const categoryId = parseInt(id);
  const categoryName = CATEGORIES[categoryId];

  if (!categoryName) {
    notFound();
  }

  const products = await getBestProducts(categoryId, 100).catch(() => []);
  const emoji = categoryEmojis[categoryId] || '📦';

  return (
    <div className="min-h-screen bg-[#f2f4f6]">
      {/* 페이지 헤더 */}
      <div className="bg-white border-b border-[#e5e8eb]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <span className="text-[48px]">{emoji}</span>
            <div>
              <h1 className="text-[24px] font-bold text-[#191f28]">{categoryName}</h1>
              <p className="text-[14px] text-[#6b7684] mt-1">
                인기 상품 {products.length}개
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 상품 그리드 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {products.length > 0 ? (
          <>
            <ProductGrid products={products} />
            <p className="text-[11px] text-[#adb5bd] mt-6 text-center">
              해당 사이트는 쿠팡 파트너스 활동의 일환으로 수수료를 제공받으며, 구매자에게 추가 비용은 없습니다.
            </p>
          </>
        ) : (
          <div className="bg-white rounded-2xl p-16 text-center border border-[#e5e8eb]">
            <div className="spinner-lg mx-auto mb-4" />
            <p className="text-[15px] text-[#6b7684]">상품을 불러오는 중...</p>
            <p className="text-[13px] text-[#8b95a1] mt-2">잠시 후 다시 시도해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
