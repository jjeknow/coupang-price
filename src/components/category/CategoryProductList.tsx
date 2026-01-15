'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import ProductFilter, { SortOption, FilterOption } from '@/components/ui/ProductFilter';

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
}

interface CategoryProductListProps {
  products: Product[];
}

export default function CategoryProductList({ products }: CategoryProductListProps) {
  const [sort, setSort] = useState<SortOption>('default');
  const [filter, setFilter] = useState<FilterOption>({
    rocketOnly: false,
    freeShippingOnly: false,
  });

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 필터 적용
    if (filter.rocketOnly) {
      result = result.filter(p => p.isRocket);
    }
    if (filter.freeShippingOnly) {
      result = result.filter(p => p.isFreeShipping || p.isRocket);
    }
    if (filter.minPrice !== undefined) {
      result = result.filter(p => p.productPrice >= filter.minPrice!);
    }
    if (filter.maxPrice !== undefined) {
      result = result.filter(p => p.productPrice <= filter.maxPrice!);
    }

    // 정렬 적용
    if (sort === 'price_asc') {
      result.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.productPrice - a.productPrice);
    }

    return result;
  }, [products, sort, filter]);

  return (
    <>
      <ProductFilter
        sort={sort}
        filter={filter}
        onSortChange={setSort}
        onFilterChange={setFilter}
        totalCount={filteredAndSortedProducts.length}
      />

      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filteredAndSortedProducts.map((product, index) => (
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
              lowestPrice={product.lowestPrice}
              highestPrice={product.highestPrice}
              priority={index < 10}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center border border-[#e5e8eb]">
          <p className="text-[15px] text-[#6b7684]">조건에 맞는 상품이 없습니다</p>
          <p className="text-[13px] text-[#6b7684] mt-2">필터를 조정해보세요</p>
        </div>
      )}
    </>
  );
}
