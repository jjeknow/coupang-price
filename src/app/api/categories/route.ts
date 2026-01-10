import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/coupang-api';

// 카테고리 목록 조회 API
export async function GET() {
  try {
    const categories = getAllCategories();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('카테고리 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '카테고리 목록을 가져오는데 실패했습니다.',
      },
      { status: 500 }
    );
  }
}
