import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 자동완성 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 1) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // 검색어가 포함된 키워드 검색 (인기순)
    const suggestions = await prisma.searchKeyword.findMany({
      where: {
        keyword: {
          contains: query,
        },
      },
      orderBy: { count: 'desc' },
      take: 8,
      select: {
        keyword: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: suggestions.map((s) => s.keyword),
    });
  } catch (error) {
    console.error('자동완성 조회 오류:', error);
    return NextResponse.json({
      success: false,
      error: '자동완성을 불러오는데 실패했습니다.',
    }, { status: 500 });
  }
}
