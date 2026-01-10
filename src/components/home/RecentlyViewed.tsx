'use client';

import { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';

interface RecentProduct {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  isRocket?: boolean;
  isFreeShipping?: boolean;
  categoryName?: string;
  viewedAt: number;
}

const RECENT_PRODUCTS_KEY = 'recentlyViewedProducts';
const MAX_RECENT_PRODUCTS = 10;

export function saveRecentProduct(product: Omit<RecentProduct, 'viewedAt'>) {
  if (typeof window === 'undefined') return;

  const saved = localStorage.getItem(RECENT_PRODUCTS_KEY);
  const products: RecentProduct[] = saved ? JSON.parse(saved) : [];

  // 이미 있으면 제거
  const filtered = products.filter(p => p.productId !== product.productId);

  // 맨 앞에 추가
  const updated = [
    { ...product, viewedAt: Date.now() },
    ...filtered
  ].slice(0, MAX_RECENT_PRODUCTS);

  localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(updated));
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState<RecentProduct[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_PRODUCTS_KEY);
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  const clearAll = () => {
    localStorage.removeItem(RECENT_PRODUCTS_KEY);
    setProducts([]);
  };

  if (products.length === 0 || !isVisible) return null;

  return (
    <section className="bg-white py-10 border-t border-[#e5e8eb]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-[#6b7684]" />
            <h2 className="text-[18px] font-bold text-[#191f28]">최근 본 상품</h2>
            <span className="text-[13px] text-[#8b95a1]">({products.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className="text-[13px] text-[#8b95a1] hover:text-[#6b7684]"
            >
              전체 삭제
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 text-[#8b95a1] hover:text-[#6b7684]"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.slice(0, 5).map((product) => (
            <ProductCard
              key={product.productId}
              productId={product.productId}
              productName={product.productName}
              productPrice={product.productPrice}
              productImage={product.productImage}
              productUrl={product.productUrl}
              isRocket={product.isRocket}
              isFreeShipping={product.isFreeShipping}
              categoryName={product.categoryName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
