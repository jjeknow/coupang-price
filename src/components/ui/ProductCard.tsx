'use client';

import { useState, memo, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingDown } from 'lucide-react';

// 폴백 이미지 URL
const FALLBACK_IMAGE = '/placeholder-product.svg';

// 고품질 블러 플레이스홀더 (10x10 그라데이션)
const BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmOGY5ZmEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlOWVjZWYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=';

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
  const [retryCount, setRetryCount] = useState(0);

  // 메모이제이션된 가격 포맷터
  const formatPrice = useCallback((price: number) => price.toLocaleString('ko-KR'), []);

  // 실제 가격 데이터 기반 상태 계산 (메모이제이션)
  const priceAnalysis = useMemo(() => {
    const hasRealData = lowestPrice != null && highestPrice != null;
    const isCurrentLowest = hasRealData && productPrice <= lowestPrice;
    const discountFromHighest = hasRealData && highestPrice > productPrice
      ? Math.round(((highestPrice - productPrice) / highestPrice) * 100)
      : 0;
    const averagePrice = hasRealData ? Math.round((lowestPrice + highestPrice) / 2) : 0;
    const isPriceGood = hasRealData && !isCurrentLowest && productPrice <= averagePrice && discountFromHighest >= 10;

    return { hasRealData, isCurrentLowest, discountFromHighest, isPriceGood };
  }, [lowestPrice, highestPrice, productPrice]);

  // 상품 데이터 메모이제이션 (리렌더링 방지)
  const productData = useMemo(() => encodeURIComponent(
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
  ), [productId, productName, productPrice, productImage, productUrl, isRocket, isFreeShipping, categoryName]);

  // SEO 친화적 URL용 슬러그 생성 (메모이제이션)
  const slug = useMemo(() => productName
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)
    .toLowerCase(), [productName]);

  // 이미지 에러 핸들러 (재시도 로직 포함)
  const handleImageError = useCallback(() => {
    if (retryCount < 2) {
      // 다른 CDN 서버로 재시도
      setRetryCount(prev => prev + 1);
    } else {
      setImageError(true);
    }
  }, [retryCount]);

  // 이미지 로드 핸들러
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // 이미지 URL 최적화 (CDN 서버 로테이션)
  const optimizedImageUrl = useMemo(() => {
    if (imageError) return FALLBACK_IMAGE;
    if (!productImage) return FALLBACK_IMAGE;

    // 쿠팡 CDN 서버 로테이션 (thumbnail6~10)
    if (retryCount > 0 && productImage.includes('coupangcdn.com')) {
      const serverNum = 6 + (retryCount % 5);
      return productImage.replace(/thumbnail\d+/, `thumbnail${serverNum}`);
    }
    return productImage;
  }, [productImage, imageError, retryCount]);

  const { isCurrentLowest, isPriceGood } = priceAnalysis;

  return (
    <article className="group" itemScope itemType="https://schema.org/Product">
      <Link
        href={`/product/${slug}-${productId}?data=${productData}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3182f6] focus-visible:ring-offset-2 rounded-xl"
        aria-label={`${productName} - ${formatPrice(productPrice)}원${isCurrentLowest ? ' - 역대 최저가' : ''}`}
      >
        {/* 이미지 */}
        <div className="relative aspect-square bg-[#fafafa] rounded-xl overflow-hidden mb-2 border border-[#e5e8eb] shadow-[0_2px_8px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-all duration-200">
          {/* 역대 최저가 배지 (빨간색) */}
          {isCurrentLowest && (
            <div className="absolute top-2 left-2 z-10" aria-hidden="true">
              <span className="inline-flex items-center gap-0.5 px-2 py-1 bg-[#fff0f0] text-[#c92a2a] text-[10px] font-bold rounded-lg shadow-sm">
                <TrendingDown size={10} aria-hidden="true" />
                역대 최저가
              </span>
            </div>
          )}

          {/* 로딩 스켈레톤 (고급 애니메이션) */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          )}

          <Image
            src={optimizedImageUrl}
            alt={productName}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 180px"
            className={`object-contain p-2 transition-all duration-300 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={priority}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            itemProp="image"
            quality={75}
          />
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
                className="text-[16px] font-bold text-[#c92a2a] tracking-tight"
                itemProp="price"
                content={productPrice.toString()}
              >
                {formatPrice(productPrice)}
              </span>
              <span className="text-[12px] text-[#c92a2a]">원</span>
              <meta itemProp="priceCurrency" content="KRW" />
            </div>
          </div>

          {/* 배송/가격 배지 */}
          <div className="flex flex-wrap gap-1">
            {isRocket && (
              <span className="px-1.5 py-0.5 bg-[#dbeafe] text-[#1d4ed8] text-[10px] font-medium rounded border border-[#1d4ed8]/20">
                로켓배송
              </span>
            )}
            {isFreeShipping && !isRocket && (
              <span className="px-1.5 py-0.5 bg-[#dbeafe] text-[#1d4ed8] text-[10px] font-medium rounded border border-[#1d4ed8]/20">
                무료배송
              </span>
            )}
            {isPriceGood && (
              <span className="px-1.5 py-0.5 bg-[#d1fae5] text-[#047857] text-[10px] font-medium rounded border border-[#047857]/20">
                가격 Good
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default memo(ProductCard);
