import { NextRequest, NextResponse } from 'next/server';
import { getBestProducts, CATEGORIES } from '@/lib/coupang-api';
import { getFromCache, setCache, createCacheKey, CACHE_TTL } from '@/lib/cache';

// 카테고리별 베스트 상품 조회 API (캐싱 적용)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const id = parseInt(categoryId);

    // 카테고리 유효성 검사
    if (!CATEGORIES[id]) {
      return NextResponse.json(
        {
          success: false,
          error: '유효하지 않은 카테고리입니다.',
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // 캐시 키 생성
    const cacheKey = createCacheKey('best', id, limit);

    // 캐시 확인
    const cached = getFromCache<{ categoryId: number; categoryName: string; products: unknown[] }>(cacheKey);
    if (cached) {
      console.log(`[CACHE HIT] ${cacheKey}`);
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    console.log(`[CACHE MISS] ${cacheKey} - API 호출`);
    const products = await getBestProducts(id, limit);

    const responseData = {
      categoryId: id,
      categoryName: CATEGORIES[id],
      products,
    };

    // 캐시 저장 (10분)
    setCache(cacheKey, responseData, CACHE_TTL.BEST_PRODUCTS);

    return NextResponse.json({
      success: true,
      data: responseData,
      cached: false,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    console.error('베스트 상품 API 오류:', errorMessage);
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
