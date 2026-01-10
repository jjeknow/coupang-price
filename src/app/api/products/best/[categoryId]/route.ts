import { NextRequest, NextResponse } from 'next/server';
import { getBestProducts, CATEGORIES } from '@/lib/coupang-api';

// 카테고리별 베스트 상품 조회 API
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

    const products = await getBestProducts(id, limit);

    return NextResponse.json({
      success: true,
      data: {
        categoryId: id,
        categoryName: CATEGORIES[id],
        products,
      },
    });
  } catch (error) {
    console.error('베스트 상품 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '베스트 상품을 가져오는데 실패했습니다.',
      },
      { status: 500 }
    );
  }
}
