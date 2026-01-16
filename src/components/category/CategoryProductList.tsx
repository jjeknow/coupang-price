'use client';

import ProductCard from '@/components/ui/ProductCard';

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
  return (
    <>
      <p className="text-[14px] text-[#5c6470] mb-6">
        총 <span className="font-semibold text-[#191f28]">{products.length}</span>개 상품
      </p>

      <div className="grid grid-cols-2 gap-3">
        {products.map((product, index) => (
          <ProductCard
            key={`${product.productId}-${index}`}
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
    </>
  );
}
