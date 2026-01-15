/**
 * 상품 등록 API
 * 상품 조회 시 DB에 등록하여 가격 추적 대상으로 추가
 * 쿠팡 API 호출 없음 - DB 저장만 수행
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productId,
      productName,
      productPrice,
      productImage,
      productUrl,
      categoryName,
      isRocket,
      isFreeShipping,
    } = body;

    if (!productId || !productName || !productPrice) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const coupangId = productId.toString();

    // 기존 상품 확인
    const existingProduct = await prisma.product.findUnique({
      where: { coupangId },
    });

    if (existingProduct) {
      // 이미 등록된 상품 - 현재 가격만 업데이트
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          currentPrice: productPrice,
          name: productName,
          imageUrl: productImage,
          productUrl: productUrl,
        },
      });

      return NextResponse.json({
        success: true,
        registered: false,
        message: '이미 추적 중인 상품입니다.',
      });
    }

    // 새 상품 등록
    await prisma.product.create({
      data: {
        coupangId,
        name: productName,
        imageUrl: productImage,
        productUrl: productUrl,
        currentPrice: productPrice,
        lowestPrice: productPrice,
        highestPrice: productPrice,
        averagePrice: productPrice,
        isRocket: isRocket ?? false,
        isFreeShipping: isFreeShipping ?? false,
        categoryName: categoryName,
        priceHistory: {
          create: {
            price: productPrice,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      registered: true,
      message: '가격 추적이 시작되었습니다.',
    });
  } catch (error) {
    console.error('상품 등록 오류:', error);
    return NextResponse.json(
      { success: false, error: '상품 등록에 실패했습니다.' },
      { status: 500 }
    );
  }
}
