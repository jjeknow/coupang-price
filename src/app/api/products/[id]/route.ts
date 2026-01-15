/**
 * 상품 단일 조회 API
 * DB에서 상품 정보 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // DB에서 상품 조회
    const product = await prisma.product.findUnique({
      where: { coupangId: id },
      select: {
        coupangId: true,
        name: true,
        imageUrl: true,
        productUrl: true,
        currentPrice: true,
        lowestPrice: true,
        highestPrice: true,
        averagePrice: true,
        isRocket: true,
        isFreeShipping: true,
        categoryName: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: '상품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 프론트엔드에서 사용하는 형식으로 변환
    return NextResponse.json({
      success: true,
      data: {
        productId: parseInt(product.coupangId),
        productName: product.name,
        productPrice: product.currentPrice,
        productImage: product.imageUrl,
        productUrl: product.productUrl,
        isRocket: product.isRocket,
        isFreeShipping: product.isFreeShipping,
        categoryName: product.categoryName,
        lowestPrice: product.lowestPrice,
        highestPrice: product.highestPrice,
        averagePrice: product.averagePrice,
      },
    });
  } catch (error) {
    console.error('상품 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '상품 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
