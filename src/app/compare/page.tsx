'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, X, Plus, ExternalLink, Zap, Truck, TrendingDown } from 'lucide-react';
import { getFavorites, FavoriteProduct } from '@/lib/favorites';

// 가격 히스토리 생성 (데모)
function generatePriceHistory(basePrice: number) {
  const history: { time: string; price: number }[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const variation = (Math.random() - 0.5) * 0.2;
    const price = Math.round(basePrice * (1 + variation));
    history.push({ time: dateStr, price });
  }

  return history;
}

// 가격 통계 계산
function getPriceStats(basePrice: number) {
  const history = generatePriceHistory(basePrice);
  const prices = history.map(p => p.price);
  return {
    lowest: Math.min(...prices),
    highest: Math.max(...prices),
    average: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    current: basePrice,
  };
}

export default function ComparePage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<FavoriteProduct[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favs = getFavorites();
    setFavorites(favs);
    // 처음 2개 자동 선택
    setSelectedProducts(favs.slice(0, 2));
    setLoading(false);
  }, []);

  // 가격 통계 캐시
  const priceStats = useMemo(() => {
    const stats: Record<number, ReturnType<typeof getPriceStats>> = {};
    selectedProducts.forEach(p => {
      stats[p.productId] = getPriceStats(p.productPrice);
    });
    return stats;
  }, [selectedProducts]);

  const handleAddProduct = (product: FavoriteProduct) => {
    if (selectedProducts.length < 3 && !selectedProducts.find(p => p.productId === product.productId)) {
      setSelectedProducts([...selectedProducts, product]);
    }
    setShowSelector(false);
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.productId !== productId));
  };

  const formatPrice = (price: number) => price.toLocaleString('ko-KR');

  // 최저가 상품 찾기
  const getLowestPriceProduct = () => {
    if (selectedProducts.length === 0) return null;
    return selectedProducts.reduce((min, p) =>
      p.productPrice < min.productPrice ? p : min
    );
  };

  const lowestPriceProduct = getLowestPriceProduct();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f4f6] flex items-center justify-center">
        <div className="spinner-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f4f6]">
      {/* 헤더 */}
      <div className="bg-white border-b border-[#e5e8eb]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link href="/favorites" className="p-2 -ml-2 text-[#4e5968] hover:bg-[#f2f4f6] rounded-lg">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-[18px] font-bold text-[#191f28]">
                상품 비교
              </h1>
            </div>
            <span className="text-[13px] text-[#8b95a1]">
              최대 3개 비교 가능
            </span>
          </div>
        </div>
      </div>

      {/* 비교 테이블 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {favorites.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e5e8eb] p-12 text-center">
            <p className="text-[16px] font-medium text-[#333d4b] mb-2">
              관심상품이 없습니다
            </p>
            <p className="text-[14px] text-[#8b95a1] mb-6">
              관심상품을 추가한 후 비교해보세요
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#3182f6] hover:bg-[#1b64da] text-white rounded-xl font-semibold transition-colors"
            >
              상품 둘러보기
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#e5e8eb] overflow-hidden">
            {/* 상품 카드들 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-[#e5e8eb]">
              {/* 빈 라벨 셀 (PC에서만) */}
              <div className="hidden lg:block p-4 bg-[#f8f9fa]" />

              {/* 선택된 상품들 */}
              {selectedProducts.map((product) => {
                const stats = priceStats[product.productId];
                const isLowest = lowestPriceProduct?.productId === product.productId;

                return (
                  <div key={product.productId} className="relative p-4">
                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => handleRemoveProduct(product.productId)}
                      className="absolute top-2 right-2 w-6 h-6 bg-[#f2f4f6] hover:bg-[#e5e8eb] rounded-full flex items-center justify-center z-10"
                    >
                      <X size={14} className="text-[#6b7684]" />
                    </button>

                    {/* 최저가 배지 */}
                    {isLowest && selectedProducts.length > 1 && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-[#f04452] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          최저가
                        </span>
                      </div>
                    )}

                    {/* 상품 이미지 */}
                    <div className="relative aspect-square bg-[#f8f9fa] rounded-xl overflow-hidden mb-3">
                      <Image
                        src={product.productImage}
                        alt={product.productName}
                        fill
                        className="object-contain p-2"
                        unoptimized
                      />
                    </div>

                    {/* 상품명 */}
                    <h3 className="text-[13px] text-[#191f28] line-clamp-2 mb-2 min-h-[36px]">
                      {product.productName}
                    </h3>

                    {/* 가격 */}
                    <p className="text-[18px] font-bold text-[#191f28]">
                      {formatPrice(product.productPrice)}
                      <span className="text-[14px] font-normal">원</span>
                    </p>

                    {/* 배지 */}
                    <div className="flex gap-1 mt-2">
                      {product.isRocket && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#e8f3ff] text-[#3182f6] text-[10px] font-semibold rounded">
                          <Zap size={10} />
                          로켓배송
                        </span>
                      )}
                      {product.isFreeShipping && !product.isRocket && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#e6f9ed] text-[#0ca678] text-[10px] font-semibold rounded">
                          <Truck size={10} />
                          무료배송
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* 상품 추가 버튼 */}
              {selectedProducts.length < 3 && (
                <div className="p-4 flex items-center justify-center min-h-[280px]">
                  <button
                    onClick={() => setShowSelector(true)}
                    className="w-full h-full border-2 border-dashed border-[#e5e8eb] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#3182f6] hover:bg-[#f8f9fa] transition-colors"
                  >
                    <div className="w-12 h-12 bg-[#f2f4f6] rounded-full flex items-center justify-center">
                      <Plus size={24} className="text-[#8b95a1]" />
                    </div>
                    <span className="text-[14px] text-[#8b95a1]">상품 추가</span>
                  </button>
                </div>
              )}
            </div>

            {/* 비교 항목들 */}
            {selectedProducts.length > 0 && (
              <div className="divide-y divide-[#e5e8eb]">
                {/* 역대 최저가 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-[#e5e8eb]">
                  <div className="hidden lg:flex items-center p-4 bg-[#f8f9fa]">
                    <span className="text-[14px] font-medium text-[#4e5968]">역대 최저가</span>
                  </div>
                  {selectedProducts.map((product) => {
                    const stats = priceStats[product.productId];
                    return (
                      <div key={product.productId} className="p-4">
                        <span className="lg:hidden text-[12px] text-[#8b95a1] block mb-1">역대 최저가</span>
                        <span className="text-[15px] font-semibold text-[#00c471]">
                          {formatPrice(stats.lowest)}원
                        </span>
                      </div>
                    );
                  })}
                  {selectedProducts.length < 3 && <div className="hidden md:block p-4" />}
                </div>

                {/* 평균 가격 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-[#e5e8eb]">
                  <div className="hidden lg:flex items-center p-4 bg-[#f8f9fa]">
                    <span className="text-[14px] font-medium text-[#4e5968]">평균 가격</span>
                  </div>
                  {selectedProducts.map((product) => {
                    const stats = priceStats[product.productId];
                    return (
                      <div key={product.productId} className="p-4">
                        <span className="lg:hidden text-[12px] text-[#8b95a1] block mb-1">평균 가격</span>
                        <span className="text-[15px] font-medium text-[#191f28]">
                          {formatPrice(stats.average)}원
                        </span>
                      </div>
                    );
                  })}
                  {selectedProducts.length < 3 && <div className="hidden md:block p-4" />}
                </div>

                {/* 최고 가격 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-[#e5e8eb]">
                  <div className="hidden lg:flex items-center p-4 bg-[#f8f9fa]">
                    <span className="text-[14px] font-medium text-[#4e5968]">최고 가격</span>
                  </div>
                  {selectedProducts.map((product) => {
                    const stats = priceStats[product.productId];
                    return (
                      <div key={product.productId} className="p-4">
                        <span className="lg:hidden text-[12px] text-[#8b95a1] block mb-1">최고 가격</span>
                        <span className="text-[15px] font-medium text-[#ff8b00]">
                          {formatPrice(stats.highest)}원
                        </span>
                      </div>
                    );
                  })}
                  {selectedProducts.length < 3 && <div className="hidden md:block p-4" />}
                </div>

                {/* 현재 vs 최저가 대비 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-[#e5e8eb]">
                  <div className="hidden lg:flex items-center p-4 bg-[#f8f9fa]">
                    <span className="text-[14px] font-medium text-[#4e5968]">최저가 대비</span>
                  </div>
                  {selectedProducts.map((product) => {
                    const stats = priceStats[product.productId];
                    const diff = product.productPrice - stats.lowest;
                    const diffPercent = Math.round((diff / stats.lowest) * 100);
                    return (
                      <div key={product.productId} className="p-4">
                        <span className="lg:hidden text-[12px] text-[#8b95a1] block mb-1">최저가 대비</span>
                        {diff === 0 ? (
                          <span className="text-[15px] font-semibold text-[#00c471] flex items-center gap-1">
                            <TrendingDown size={16} />
                            최저가!
                          </span>
                        ) : (
                          <span className="text-[15px] font-medium text-[#f04452]">
                            +{formatPrice(diff)}원 ({diffPercent}%↑)
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {selectedProducts.length < 3 && <div className="hidden md:block p-4" />}
                </div>

                {/* 카테고리 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-[#e5e8eb]">
                  <div className="hidden lg:flex items-center p-4 bg-[#f8f9fa]">
                    <span className="text-[14px] font-medium text-[#4e5968]">카테고리</span>
                  </div>
                  {selectedProducts.map((product) => (
                    <div key={product.productId} className="p-4">
                      <span className="lg:hidden text-[12px] text-[#8b95a1] block mb-1">카테고리</span>
                      <span className="text-[14px] text-[#4e5968]">
                        {product.categoryName || '-'}
                      </span>
                    </div>
                  ))}
                  {selectedProducts.length < 3 && <div className="hidden md:block p-4" />}
                </div>

                {/* 구매 버튼 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-[#e5e8eb]">
                  <div className="hidden lg:block p-4 bg-[#f8f9fa]" />
                  {selectedProducts.map((product) => (
                    <div key={product.productId} className="p-4">
                      <a
                        href={product.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-[#3182f6] hover:bg-[#1b64da] text-white text-[14px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                      >
                        쿠팡에서 구매
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  ))}
                  {selectedProducts.length < 3 && <div className="hidden md:block p-4" />}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 상품 선택 모달 */}
      {showSelector && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[70vh] overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between p-4 border-b border-[#e5e8eb]">
              <h3 className="text-[16px] font-bold text-[#191f28]">비교할 상품 선택</h3>
              <button
                onClick={() => setShowSelector(false)}
                className="p-2 hover:bg-[#f2f4f6] rounded-lg"
              >
                <X size={20} className="text-[#6b7684]" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[50vh] p-4">
              {favorites
                .filter(f => !selectedProducts.find(s => s.productId === f.productId))
                .map((product) => (
                  <button
                    key={product.productId}
                    onClick={() => handleAddProduct(product)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-[#f2f4f6] rounded-xl transition-colors"
                  >
                    <div className="relative w-14 h-14 bg-[#f8f9fa] rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.productImage}
                        alt={product.productName}
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-[13px] text-[#191f28] line-clamp-1">{product.productName}</p>
                      <p className="text-[15px] font-bold text-[#191f28]">
                        {formatPrice(product.productPrice)}원
                      </p>
                    </div>
                    <Plus size={20} className="text-[#3182f6] flex-shrink-0" />
                  </button>
                ))}
              {favorites.filter(f => !selectedProducts.find(s => s.productId === f.productId)).length === 0 && (
                <p className="text-center text-[14px] text-[#8b95a1] py-8">
                  추가할 상품이 없습니다
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
