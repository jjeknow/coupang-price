import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/coupang-api';
import { getFromCache, setCache, createCacheKey, CACHE_TTL } from '@/lib/cache';

// 상품 검색 API (캐싱 적용 - 5분)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!keyword || keyword.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: '검색어를 입력해주세요.',
        },
        { status: 400 }
      );
    }

    const trimmedKeyword = keyword.trim();

    // 캐시 키 생성
    const cacheKey = createCacheKey('search', trimmedKeyword, limit);

    // 캐시 확인
    const cached = getFromCache<{ keyword: string; landingUrl: string; products: unknown[] }>(cacheKey);
    if (cached) {
      console.log(`[CACHE HIT] ${cacheKey}`);
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    console.log(`[CACHE MISS] ${cacheKey} - API 호출`);
    const result = await searchProducts(trimmedKeyword, limit);

    const responseData = {
      keyword: trimmedKeyword,
      landingUrl: result.landingUrl,
      products: result.productData,
    };

    // 캐시 저장 (5분)
    setCache(cacheKey, responseData, CACHE_TTL.SEARCH);

    return NextResponse.json({
      success: true,
      data: responseData,
      cached: false,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    console.error('검색 API 오류:', errorMessage);
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
