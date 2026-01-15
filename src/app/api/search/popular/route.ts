import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 인기 검색어 조회 API
export async function GET() {
  try {
    const keywords = await prisma.searchKeyword.findMany({
      orderBy: { count: 'desc' },
      take: 10,
      select: {
        keyword: true,
        count: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: keywords.map((k) => k.keyword),
    });
  } catch (error) {
    console.error('인기 검색어 조회 오류:', error);
    return NextResponse.json({
      success: false,
      error: '인기 검색어를 불러오는데 실패했습니다.',
    }, { status: 500 });
  }
}
