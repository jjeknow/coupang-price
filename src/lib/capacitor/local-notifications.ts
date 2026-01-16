/**
 * iOS 로컬 알림
 * 앱 내부에서 스케줄링하는 알림
 */

import { Capacitor } from '@capacitor/core';

export interface LocalNotificationOptions {
  id: number;
  title: string;
  body: string;
  schedule?: {
    at?: Date;
    repeats?: boolean;
    every?: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute';
  };
  extra?: Record<string, unknown>;
  sound?: string;
  actionTypeId?: string;
}

// 로컬 알림 권한 요청
export async function requestLocalNotificationPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  } catch (error) {
    console.error('[LocalNotifications] 권한 요청 실패:', error);
    return false;
  }
}

// 로컬 알림 스케줄링
export async function scheduleLocalNotification(options: LocalNotificationOptions): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    console.log('[LocalNotifications] 웹 환경 - 건너뜀');
    return false;
  }

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');

    await LocalNotifications.schedule({
      notifications: [
        {
          id: options.id,
          title: options.title,
          body: options.body,
          schedule: options.schedule,
          extra: options.extra,
          sound: options.sound || 'default',
          actionTypeId: options.actionTypeId,
          // iOS 설정
          attachments: undefined,
          smallIcon: undefined,
          iconColor: '#3182f6',
        },
      ],
    });

    console.log('[LocalNotifications] 스케줄 완료:', options.id);
    return true;
  } catch (error) {
    console.error('[LocalNotifications] 스케줄 실패:', error);
    return false;
  }
}

// 가격 체크 리마인더 알림
export async function schedulePriceCheckReminder(): Promise<boolean> {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  return scheduleLocalNotification({
    id: 1001,
    title: '오늘의 최저가 체크',
    body: '관심 상품의 가격이 변동되었을 수 있어요. 확인해보세요!',
    schedule: {
      at: tomorrow,
      repeats: true,
      every: 'day',
    },
    extra: { type: 'reminder' },
  });
}

// 특정 시간에 최저가 알림
export async function scheduleLowestPriceAlert(
  productId: number,
  productName: string,
  targetPrice: number,
  scheduleTime: Date
): Promise<boolean> {
  return scheduleLocalNotification({
    id: productId,
    title: '목표가 도달 가능성!',
    body: `${productName.slice(0, 30)}... - 목표가 ${targetPrice.toLocaleString()}원에 근접했어요`,
    schedule: {
      at: scheduleTime,
    },
    extra: {
      type: 'price-alert',
      productId,
      targetPrice,
    },
  });
}

// 알림 취소
export async function cancelNotification(id: number): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.cancel({ notifications: [{ id }] });
  } catch (error) {
    console.error('[LocalNotifications] 취소 실패:', error);
  }
}

// 모든 알림 취소
export async function cancelAllNotifications(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const pending = await LocalNotifications.getPending();
    await LocalNotifications.cancel({ notifications: pending.notifications });
  } catch (error) {
    console.error('[LocalNotifications] 전체 취소 실패:', error);
  }
}

// 대기 중인 알림 목록
export async function getPendingNotifications() {
  if (!Capacitor.isNativePlatform()) return [];

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const result = await LocalNotifications.getPending();
    return result.notifications;
  } catch (error) {
    console.error('[LocalNotifications] 목록 조회 실패:', error);
    return [];
  }
}

// 알림 액션 타입 등록 (iOS)
export async function registerActionTypes(): Promise<void> {
  if (Capacitor.getPlatform() !== 'ios') return;

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');

    await LocalNotifications.registerActionTypes({
      types: [
        {
          id: 'PRICE_ALERT',
          actions: [
            {
              id: 'view',
              title: '상품 보기',
            },
            {
              id: 'dismiss',
              title: '닫기',
              destructive: true,
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error('[LocalNotifications] 액션 타입 등록 실패:', error);
  }
}
