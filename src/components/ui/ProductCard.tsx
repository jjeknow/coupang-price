'use client';

import { useState, memo } from 'react';
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
  priority?: boolean;
  // 가격 히스토리 데이터 (DB에서 조회된 경우)
  lowestPrice?: number | null;
  highestPrice?: number | null;
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
  lowestPrice,
  highestPrice,
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 블러 플레이스홀더 데이터 URL (1x1 그레이 픽셀)
  const blurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwYABQwC/kfqMwAAAABJRU5ErkJggg==';

  const formatPrice = (price: number) => price.toLocaleString('ko-KR');

  // 실제 가격 데이터 기반 상태 계산
  const hasRealData = lowestPrice != null && highestPrice != null;
  const isCurrentLowest = hasRealData && productPrice <= lowestPrice;
  const discountFromHighest = hasRealData && highestPrice > productPrice
    ? Math.round(((highestPrice - productPrice) / highestPrice) * 100)
    : 0;
  // 가격 Good: 최저가는 아니지만 평균가 이하이면서 10% 이상 할인 중
  const averagePrice = hasRealData ? Math.round((lowestPrice + highestPrice) / 2) : 0;
  const isPriceGood = hasRealData && !isCurrentLowest && productPrice <= averagePrice && discountFromHighest >= 10;

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
        <div className="relative aspect-square bg-[#fafafa] rounded-xl overflow-hidden mb-2 border border-[#e5e8eb] shadow-[0_2px_8px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-all duration-200">
          {/* 역대 최저가 배지 (빨간색) */}
          {isCurrentLowest && (
            <div className="absolute top-2 left-2 z-10">
              <span className="inline-flex items-center gap-0.5 px-2 py-1 bg-[#fff0f0] text-[#e03131] text-[10px] font-bold rounded-lg">
                <TrendingDown size={10} />
                역대 최저가
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
              sizes="45vw"
              className={`object-contain p-2 transition-transform duration-200 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              priority={priority}
              placeholder="blur"
              blurDataURL={blurDataURL}
              itemProp="image"
              unoptimized
            />
          )}
        </div>

        {/* 정보 */}
        <div className="space-y-1.5">
          {/* 상품명 */}
          <p
            className="text-[13px] text-[#333d4b] line-clamp-2 leading-snug min-h-[36px]"
            itemProp="name"
          >
            {productName}
          </p>

          {/* 가격 */}
          <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <div className="flex items-baseline gap-0.5">
              <span
                className="text-[16px] font-bold text-[#e03131] tracking-tight"
                itemProp="price"
                content={productPrice.toString()}
              >
                {formatPrice(productPrice)}
              </span>
              <span className="text-[12px] text-[#e03131]">원</span>
              <meta itemProp="priceCurrency" content="KRW" />
            </div>
          </div>

          {/* 배송/가격 배지 */}
          {(isRocket || isFreeShipping || isPriceGood) && (
            <div className="flex flex-wrap gap-1">
              {isRocket && (
                <span className="px-1.5 py-0.5 bg-[#e8f3ff] text-[#3182f6] text-[10px] font-medium rounded border border-[#3182f6]/20">
                  로켓배송
                </span>
              )}
              {isFreeShipping && !isRocket && (
                <span className="px-1.5 py-0.5 bg-[#e8f3ff] text-[#3182f6] text-[10px] font-medium rounded border border-[#3182f6]/20">
                  무료배송
                </span>
              )}
              {isPriceGood && (
                <span className="px-1.5 py-0.5 bg-[#e6f9ed] text-[#0ca678] text-[10px] font-medium rounded border border-[#0ca678]/20">
                  가격 Good
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

export default memo(ProductCard);
