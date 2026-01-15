'use client';

import { useMemo, memo } from 'react';
import ProductCard from './ProductCard';

interface Product {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  isRocket?: boolean;
  isFreeShipping?: boolean;
  categoryName?: string;
  lowestPrice?: number | null;
  highestPrice?: number | null;
  averagePrice?: number | null;
}

interface ProductGridProps {
  products: Product[];
  title?: string;
  showMoreLink?: string;
  columns?: 2 | 3 | 4 | 5;
  priorityCount?: number;
}

function ProductGrid({
  products,
  title,
  showMoreLink,
  columns = 5,
  priorityCount = 4,
}: ProductGridProps) {
  // 중복 상품 제거 (productId 기준)
  const uniqueProducts = useMemo(() => {
    const seen = new Set<number>();
    return products.filter((product) => {
      if (seen.has(product.productId)) {
        return false;
      }
      seen.add(product.productId);
      return true;
    });
  }, [products]);

  // 그리드 컬럼 클래스 - 앱 스타일이므로 항상 2열
  const gridColsClass = 'grid-cols-2';

  if (uniqueProducts.length === 0) {
    return (
      <div
        className="toss-card-flat p-16 text-center border border-[#e5e8eb]"
        role="status"
        aria-label="검색 결과 없음"
      >
        <div className="w-16 h-16 bg-[#f2f4f6] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-[#5c6470]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <p className="toss-body-1 text-[#5c6470]">상품이 없습니다</p>
        <p className="toss-caption mt-2">다른 카테고리를 탐색해보세요</p>
      </div>
    );
  }

  return (
    <section className="mb-8" aria-label={title || '상품 목록'}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="toss-title-2">{title}</h2>
          {showMoreLink && (
            <a
              href={showMoreLink}
              className="toss-btn toss-btn-ghost text-[13px] gap-1"
            >
              더보기
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          )}
        </div>
      )}

      <div
        className={`grid ${gridColsClass} gap-4`}
        role="list"
        aria-label={`${uniqueProducts.length}개 상품`}
      >
        {uniqueProducts.map((product, index) => (
          <div key={product.productId} role="listitem" className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
            <ProductCard
              {...product}
              priority={index < priorityCount}
            />
          </div>
        ))}
      </div>

      {/* 상품 개수 표시 (접근성) */}
      <p className="sr-only" aria-live="polite">
        {uniqueProducts.length}개의 상품이 표시되었습니다.
      </p>
    </section>
  );
}

export default memo(ProductGrid);
