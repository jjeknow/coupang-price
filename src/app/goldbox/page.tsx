import { Metadata } from 'next';
import ProductGrid from '@/components/ui/ProductGrid';
import { getGoldboxProductsWithPriceData } from '@/lib/coupang-api';

export const metadata: Metadata = {
  title: '골드박스 핫딜 - 오늘의 특가',
  description: '쿠팡 골드박스 특가 상품의 가격 변동을 추적하고 최저가를 확인하세요. 매일 업데이트되는 골드박스 핫딜!',
  openGraph: {
    title: '골드박스 핫딜 - 오늘의 특가 | 똑체크',
    description: '쿠팡 골드박스 특가 상품의 가격 변동을 추적하세요.',
  },
};

export const dynamic = 'force-dynamic';

export default async function GoldboxPage() {
  const products = await getGoldboxProductsWithPriceData().catch(() => []);

  return (
    <div className="min-h-screen bg-[#f2f4f6]">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🔥</span>
            <h1 className="text-2xl font-bold">골드박스 핫딜</h1>
          </div>
          <p className="text-white/90 text-sm">매일 업데이트되는 쿠팡 특가 상품</p>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center">
            <span className="text-4xl block mb-4">⏳</span>
            <p className="text-[#191f28] font-medium mb-2">상품을 준비 중입니다</p>
            <p className="text-sm text-[#6b7684]">잠시 후 다시 시도해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
