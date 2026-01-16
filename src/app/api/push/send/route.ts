import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPushNotification, PushPayload } from '@/lib/push-notifications';

// 인증된 서버에서만 호출 가능 (Cron Job 등)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId, payload } = await request.json() as {
      userId?: string;
      payload: PushPayload;
    };

    // 특정 사용자 또는 전체 구독자에게 발송
    const subscriptions = await prisma.pushSubscription.findMany({
      where: userId ? { userId } : {},
    });

    if (subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        message: '발송할 구독이 없습니다.'
      });
    }

    let successCount = 0;
    const expiredEndpoints: string[] = [];

    // 병렬로 푸시 발송
    await Promise.all(
      subscriptions.map(async (sub) => {
        const success = await sendPushNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload
        );

        if (success) {
          successCount++;
        } else {
          expiredEndpoints.push(sub.endpoint);
        }
      })
    );

    // 만료된 구독 삭제
    if (expiredEndpoints.length > 0) {
      await prisma.pushSubscription.deleteMany({
        where: { endpoint: { in: expiredEndpoints } },
      });
    }

    return NextResponse.json({
      success: true,
      sent: successCount,
      expired: expiredEndpoints.length,
    });
  } catch (error) {
    console.error('Push send error:', error);
    return NextResponse.json(
      { success: false, error: '푸시 발송에 실패했습니다.' },
      { status: 500 }
    );
  }
}
