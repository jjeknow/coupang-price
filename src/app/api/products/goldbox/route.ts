import { NextResponse } from 'next/server';
import { getGoldboxProducts } from '@/lib/coupang-api';
import { getFromCache, setCache, CACHE_TTL } from '@/lib/cache';
import { prisma } from '@/lib/prisma';

// 상품 타입 정의
interface CoupangProduct {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  isRocket?: boolean;
  isFreeShipping?: boolean;
  categoryName?: string;
}

// DB에서 가격 히스토리 데이터를 가져와 결합
async function enrichProductsWithPriceData(products: CoupangProduct[]) {
  const coupangIds = products.map(p => p.productId.toString());

  // DB에서 해당 상품들의 가격 데이터 조회
  const dbProducts = await prisma.product.findMany({
    where: {
      coupangId: { in: coupangIds }
    },
    select: {
      coupangId: true,
      lowestPrice: true,
      highestPrice: true,
      averagePrice: true,
    }
  });

  // coupangId를 키로 하는 맵 생성
  const priceMap = new Map(dbProducts.map(p => [p.coupangId, p]));

  // 상품 데이터에 가격 히스토리 추가
  return products.map(product => {
    const priceData = priceMap.get(product.productId.toString());
    return {
      ...product,
      lowestPrice: priceData?.lowestPrice ?? null,
      highestPrice: priceData?.highestPrice ?? null,
      averagePrice: priceData?.averagePrice ?? null,
    };
  });
}

// 골드박스 상품 조회 API (캐싱 적용 - 30분)
export async function GET() {
  try {
    const cacheKey = 'goldbox';

    // 캐시 확인
    const cached = getFromCache<unknown[]>(cacheKey);
    if (cached) {
      console.log(`[CACHE HIT] ${cacheKey}`);
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
        },
      });
    }

    console.log(`[CACHE MISS] ${cacheKey} - API 호출`);
    const coupangProducts = await getGoldboxProducts();

    // DB에서 가격 히스토리 데이터 추가
    const products = await enrichProductsWithPriceData(coupangProducts);

    // 캐시 저장 (30분 - 골드박스는 매일 7:30 업데이트)
    setCache(cacheKey, products, CACHE_TTL.GOLDBOX);

    return NextResponse.json({
      success: true,
      data: products,
      cached: false,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    console.error('골드박스 API 오류:', errorMessage);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        debug: {
          hasAccessKey: !!process.env.COUPANG_ACCESS_KEY,
          hasSecretKey: !!process.env.COUPANG_SECRET_KEY,
        },
      },
      { status: 500 }
    );
  }
}
