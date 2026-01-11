import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 관심상품 목록 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('관심상품 조회 에러:', error);
    return NextResponse.json({ error: '관심상품을 불러오지 못했습니다.' }, { status: 500 });
  }
}

// 관심상품 추가
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const {
      coupangProductId,
      productName,
      productPrice,
      productImage,
      productUrl,
      categoryName,
      isRocket,
      isFreeShipping,
    } = body;

    if (!coupangProductId || !productName || !productPrice) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    // 중복 체크
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_coupangProductId: {
          userId: session.user.id,
          coupangProductId: String(coupangProductId),
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: '이미 관심상품에 추가되었습니다.' }, { status: 409 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        productId: '', // Product 모델과 연결하지 않음
        coupangProductId: String(coupangProductId),
        productName,
        productPrice,
        productImage,
        productUrl,
        categoryName,
        isRocket: isRocket || false,
        isFreeShipping: isFreeShipping || false,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error('관심상품 추가 에러:', error);
    return NextResponse.json({ error: '관심상품 추가에 실패했습니다.' }, { status: 500 });
  }
}

// 관심상품 삭제
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const coupangProductId = searchParams.get('productId');

    if (!coupangProductId) {
      return NextResponse.json({ error: '상품 ID가 필요합니다.' }, { status: 400 });
    }

    await prisma.favorite.delete({
      where: {
        userId_coupangProductId: {
          userId: session.user.id,
          coupangProductId,
        },
      },
    });

    return NextResponse.json({ message: '관심상품에서 삭제되었습니다.' });
  } catch (error) {
    console.error('관심상품 삭제 에러:', error);
    return NextResponse.json({ error: '관심상품 삭제에 실패했습니다.' }, { status: 500 });
  }
}
