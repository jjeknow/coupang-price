import { NextResponse } from 'next/server';
import { getGoldboxProducts } from '@/lib/coupang-api';
import { getFromCache, setCache, CACHE_TTL } from '@/lib/cache';

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
      });
    }

    console.log(`[CACHE MISS] ${cacheKey} - API 호출`);
    const products = await getGoldboxProducts();

    // 캐시 저장 (30분 - 골드박스는 매일 7:30 업데이트)
    setCache(cacheKey, products, CACHE_TTL.GOLDBOX);

    return NextResponse.json({
      success: true,
      data: products,
      cached: false,
    });
  } catch (error) {
    console.error('골드박스 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '골드박스 상품을 가져오는데 실패했습니다.',
      },
      { status: 500 }
    );
  }
}
