/**
 * 상품 가격 히스토리 조회 API
 * GET /api/products/[id]/price-history
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const coupangId = id;

    // 상품 조회
    const product = await prisma.product.findUnique({
      where: { coupangId },
      include: {
        priceHistory: {
          orderBy: { createdAt: 'asc' },
          take: 30,
        },
      },
    });

    if (!product) {
      // 상품이 DB에 없으면 빈 데이터 반환
      return NextResponse.json({
        success: true,
        data: {
          hasHistory: false,
          history: [],
          stats: null,
          message: '가격 데이터 수집 중입니다. 내일 다시 확인해주세요.',
        },
      });
    }

    // 가격 히스토리 포맷
    const history = product.priceHistory.map(h => ({
      time: h.createdAt.toISOString().split('T')[0],
      price: h.price,
    }));

    // 통계 계산
    const prices = product.priceHistory.map(h => h.price);
    const stats = prices.length > 0 ? {
      currentPrice: product.currentPrice,
      lowestPrice: product.lowestPrice ?? Math.min(...prices),
      highestPrice: product.highestPrice ?? Math.max(...prices),
      averagePrice: product.averagePrice ?? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      dataPoints: prices.length,
      firstDate: product.priceHistory[0]?.createdAt.toISOString().split('T')[0],
      lastDate: product.priceHistory[prices.length - 1]?.createdAt.toISOString().split('T')[0],
    } : null;

    return NextResponse.json({
      success: true,
      data: {
        hasHistory: history.length > 0,
        history,
        stats,
        message: history.length > 0
          ? null
          : '가격 데이터 수집 중입니다. 내일 다시 확인해주세요.',
      },
    });
  } catch (error) {
    console.error('Price history error:', error);
    return NextResponse.json(
      { success: false, error: '가격 히스토리 조회 실패' },
      { status: 500 }
    );
  }
}
