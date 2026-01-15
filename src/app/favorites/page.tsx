'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, Trash2, GitCompare } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { getFavorites, removeFavorite, FavoriteProduct } from '@/lib/favorites';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFavorites(getFavorites());
    setLoading(false);

    // 다른 탭/컴포넌트에서 변경 시 동기화
    const handleChange = () => {
      setFavorites(getFavorites());
    };

    window.addEventListener('favorites-changed', handleChange);
    return () => window.removeEventListener('favorites-changed', handleChange);
  }, []);

  const handleRemove = (productId: number) => {
    removeFavorite(productId);
    setFavorites(getFavorites());
  };

  const handleClearAll = () => {
    if (confirm('모든 관심상품을 삭제하시겠습니까?')) {
      favorites.forEach(f => removeFavorite(f.productId));
      setFavorites([]);
    }
  };

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
              <Link href="/" className="p-2 -ml-2 text-[#4e5968] hover:bg-[#f2f4f6] rounded-lg">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-[18px] font-bold text-[#191f28] flex items-center gap-2">
                <Heart size={20} className="text-[#f04452]" fill="#f04452" />
                관심상품
              </h1>
            </div>
            {favorites.length > 0 && (
              <div className="flex items-center gap-2">
                {favorites.length >= 2 && (
                  <Link
                    href="/compare"
                    className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-[#3182f6] hover:bg-[#e8f3ff] rounded-lg transition-colors"
                  >
                    <GitCompare size={14} />
                    비교하기
                  </Link>
                )}
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-[#6b7684] hover:text-[#f04452] hover:bg-[#f2f4f6] rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                  전체 삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {favorites.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e5e8eb] p-12 text-center">
            <div className="w-16 h-16 bg-[#f2f4f6] rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-[#adb5bd]" />
            </div>
            <p className="text-[16px] font-medium text-[#333d4b] mb-2">
              관심상품이 없습니다
            </p>
            <p className="text-[14px] text-[#8b95a1] mb-6">
              마음에 드는 상품의 하트를 눌러<br />관심상품에 추가해보세요
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#3182f6] hover:bg-[#1b64da] text-white rounded-xl font-semibold transition-colors"
            >
              상품 둘러보기
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[14px] text-[#8b95a1] mb-4">
              총 {favorites.length}개의 관심상품
            </p>
            <div className="grid grid-cols-2 gap-3">
              {favorites.map((product) => (
                <div key={product.productId} className="relative group">
                  <ProductCard
                    productId={product.productId}
                    productName={product.productName}
                    productPrice={product.productPrice}
                    productImage={product.productImage}
                    productUrl={product.productUrl}
                    isRocket={product.isRocket}
                    isFreeShipping={product.isFreeShipping}
                    categoryName={product.categoryName}
                  />
                  {/* 삭제 버튼 */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(product.productId);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-[#f04452] text-[#6b7684] hover:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md z-20"
                    aria-label="관심상품에서 제거"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
