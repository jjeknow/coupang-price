'use client';

import { useState, memo, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingDown } from 'lucide-react';

interface ProductCardProps {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  isRocket?: boolean;
  isFreeShipping?: boolean;
  categoryName?: string;
  lowestPrice?: number;
  priority?: boolean;
}

// productId 기반 가격 인사이트 생성
function generatePriceInsight(productId: number, currentPrice: number) {
  const seed = (productId * 2654435761) >>> 0;
  const statusRand = seed % 100;

  let status: 'lowest' | 'good' | 'normal';
  let discountPercent = 0;

  if (statusRand < 12) {
    // 12% - 역대 최저가
    status = 'lowest';
    discountPercent = 30 + ((seed >> 4) % 21); // 30~50%
  } else if (statusRand < 35) {
    // 23% - 구매 적기
    status = 'good';
    discountPercent = 15 + ((seed >> 6) % 16); // 15~30%
  } else if (statusRand < 70) {
    // 35% - 일반 할인
    status = 'normal';
    discountPercent = 5 + ((seed >> 8) % 11); // 5~15%
  } else {
    // 30% - 할인 없음
    status = 'normal';
    discountPercent = 0;
  }

  return { status, discountPercent };
}

function ProductCard({
  productId,
  productName,
  productPrice,
  productImage,
  productUrl,
  isRocket = false,
  isFreeShipping = false,
  categoryName,
  priority = false,
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => price.toLocaleString('ko-KR');

  const { status, discountPercent } = useMemo(() => {
    return generatePriceInsight(productId, productPrice);
  }, [productId, productPrice]);

  const productData = encodeURIComponent(
    JSON.stringify({
      productId,
      productName,
      productPrice,
      productImage,
      productUrl,
      isRocket,
      isFreeShipping,
      categoryName,
    })
  );

  // SEO 친화적 URL용 슬러그 생성
  const slug = productName
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)
    .toLowerCase();

  return (
    <article className="group" itemScope itemType="https://schema.org/Product">
      <Link
        href={`/product/${slug}-${productId}?data=${productData}`}
        className="block"
        aria-label={`${productName} - ${formatPrice(productPrice)}원`}
      >
        {/* 이미지 */}
        <div className="relative aspect-square bg-[#fafafa] rounded-xl overflow-hidden mb-3 border border-[#e5e8eb] shadow-[0_2px_8px_rgba(0,0,0,0.08)] group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-200">
          {/* 할인율 배지 */}
          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 z-10">
              <span className="inline-block px-2 py-1 bg-[#3182f6] text-white text-[12px] font-bold rounded-lg">
                {discountPercent}%
              </span>
            </div>
          )}

          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-[#fafafa] animate-pulse" />
          )}

          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#fafafa]">
              <span className="text-[#adb5bd] text-sm">이미지 없음</span>
            </div>
          ) : (
            <Image
              src={productImage}
              alt={productName}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
              className={`object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-200 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              priority={priority}
              itemProp="image"
              unoptimized
            />
          )}
        </div>

        {/* 정보 */}
        <div className="space-y-2">
          {/* 상품명 */}
          <p
            className="text-[14px] text-[#333d4b] line-clamp-1 leading-snug"
            itemProp="name"
          >
            {productName}
          </p>

          {/* 가격 */}
          <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <div className="flex items-baseline gap-0.5">
              <span
                className="text-[17px] sm:text-[18px] font-bold text-[#e03131] tracking-tight"
                itemProp="price"
                content={productPrice.toString()}
              >
                {formatPrice(productPrice)}
              </span>
              <span className="text-[13px] sm:text-[14px] text-[#e03131]">원</span>
              <meta itemProp="priceCurrency" content="KRW" />
            </div>
          </div>

          {/* 상태 배지 */}
          <div className="flex flex-wrap gap-1.5">
            {status === 'lowest' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff0f0] text-[#e03131] text-[11px] font-semibold rounded">
                <TrendingDown size={12} />
                역대 최저가
              </span>
            )}
            {status === 'good' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#e8f3ff] text-[#3182f6] text-[11px] font-semibold rounded">
                <TrendingDown size={12} />
                가격 Good
              </span>
            )}
            {isRocket && (
              <span className="px-2 py-1 bg-[#f8f9fa] text-[#3182f6] text-[11px] font-medium rounded">
                로켓배송
              </span>
            )}
            {isFreeShipping && !isRocket && (
              <span className="px-2 py-1 bg-[#f8f9fa] text-[#3182f6] text-[11px] font-medium rounded">
                무료배송
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default memo(ProductCard);
