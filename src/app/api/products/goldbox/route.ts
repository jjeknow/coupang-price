import { NextResponse } from 'next/server';
import { getGoldboxProducts } from '@/lib/coupang-api';

// 골드박스 상품 조회 API
export async function GET() {
  try {
    const products = await getGoldboxProducts();

    return NextResponse.json({
      success: true,
      data: products,
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
