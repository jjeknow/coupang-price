import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/coupang-api';

// 상품 검색 API
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

    const result = await searchProducts(keyword.trim(), limit);

    return NextResponse.json({
      success: true,
      data: {
        keyword: keyword.trim(),
        landingUrl: result.landingUrl,
        products: result.productData,
      },
    });
  } catch (error) {
    console.error('검색 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '검색에 실패했습니다.',
      },
      { status: 500 }
    );
  }
}
