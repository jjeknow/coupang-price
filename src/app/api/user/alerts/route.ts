import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 알림 목록 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const alerts = await prisma.alert.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('알림 조회 에러:', error);
    return NextResponse.json({ error: '알림을 불러오지 못했습니다.' }, { status: 500 });
  }
}

// 알림 추가
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
      targetPrice,
    } = body;

    if (!coupangProductId || !productName || !productPrice || !targetPrice) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    if (targetPrice >= productPrice) {
      return NextResponse.json(
        { error: '목표 가격은 현재 가격보다 낮아야 합니다.' },
        { status: 400 }
      );
    }

    // 중복 체크 (동일 상품에 대한 활성 알림)
    const existing = await prisma.alert.findUnique({
      where: {
        userId_coupangProductId: {
          userId: session.user.id,
          coupangProductId: String(coupangProductId),
        },
      },
    });

    if (existing) {
      // 기존 알림 업데이트
      const updated = await prisma.alert.update({
        where: { id: existing.id },
        data: {
          targetPrice,
          productPrice,
          isActive: true,
          triggeredAt: null,
        },
      });
      return NextResponse.json(updated);
    }

    const alert = await prisma.alert.create({
      data: {
        userId: session.user.id,
        coupangProductId: String(coupangProductId),
        productName,
        productPrice,
        productImage,
        productUrl,
        targetPrice,
      },
    });

    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    console.error('알림 추가 에러:', error);
    return NextResponse.json({ error: '알림 추가에 실패했습니다.' }, { status: 500 });
  }
}

// 알림 수정/삭제
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { alertId, isActive, targetPrice } = body;

    if (!alertId) {
      return NextResponse.json({ error: '알림 ID가 필요합니다.' }, { status: 400 });
    }

    const alert = await prisma.alert.findFirst({
      where: { id: alertId, userId: session.user.id },
    });

    if (!alert) {
      return NextResponse.json({ error: '알림을 찾을 수 없습니다.' }, { status: 404 });
    }

    const updated = await prisma.alert.update({
      where: { id: alertId },
      data: {
        ...(typeof isActive === 'boolean' && { isActive }),
        ...(targetPrice && { targetPrice }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('알림 수정 에러:', error);
    return NextResponse.json({ error: '알림 수정에 실패했습니다.' }, { status: 500 });
  }
}

// 알림 삭제
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get('alertId');

    if (!alertId) {
      return NextResponse.json({ error: '알림 ID가 필요합니다.' }, { status: 400 });
    }

    const alert = await prisma.alert.findFirst({
      where: { id: alertId, userId: session.user.id },
    });

    if (!alert) {
      return NextResponse.json({ error: '알림을 찾을 수 없습니다.' }, { status: 404 });
    }

    await prisma.alert.delete({ where: { id: alertId } });

    return NextResponse.json({ message: '알림이 삭제되었습니다.' });
  } catch (error) {
    console.error('알림 삭제 에러:', error);
    return NextResponse.json({ error: '알림 삭제에 실패했습니다.' }, { status: 500 });
  }
}
