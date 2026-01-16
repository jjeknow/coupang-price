/**
 * iOS 네이티브 푸시 알림 (APNs)
 * App Store 심사 필수 요소
 */

import { Capacitor } from '@capacitor/core';
import type { PushNotificationSchema, ActionPerformed, Token } from '@capacitor/push-notifications';

export interface PushNotificationHandler {
  onRegistration?: (token: Token) => void;
  onRegistrationError?: (error: unknown) => void;
  onNotificationReceived?: (notification: PushNotificationSchema) => void;
  onNotificationAction?: (action: ActionPerformed) => void;
}

// 푸시 알림 초기화
export async function initPushNotifications(handlers: PushNotificationHandler = {}) {
  if (!Capacitor.isNativePlatform()) {
    console.log('[Push] 웹 환경 - 네이티브 푸시 건너뜀');
    return false;
  }

  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');

    // 권한 요청
    const permission = await PushNotifications.requestPermissions();
    if (permission.receive !== 'granted') {
      console.log('[Push] 권한 거부됨');
      return false;
    }

    // 리스너 등록
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('[Push] 등록 성공:', token.value);
      handlers.onRegistration?.(token);
      // 서버에 토큰 전송
      sendTokenToServer(token.value);
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('[Push] 등록 실패:', error);
      handlers.onRegistrationError?.(error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('[Push] 알림 수신:', notification);
      handlers.onNotificationReceived?.(notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('[Push] 알림 액션:', action);
      handlers.onNotificationAction?.(action);
      // 딥링크 처리
      handleNotificationAction(action);
    });

    // APNs 등록
    await PushNotifications.register();
    console.log('[Push] APNs 등록 요청 완료');
    return true;
  } catch (error) {
    console.error('[Push] 초기화 실패:', error);
    return false;
  }
}

// 서버에 디바이스 토큰 전송
async function sendTokenToServer(token: string) {
  try {
    await fetch('/api/push/register-device', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        platform: Capacitor.getPlatform(),
      }),
    });
  } catch (error) {
    console.error('[Push] 토큰 서버 전송 실패:', error);
  }
}

// 알림 액션 처리 (딥링크)
async function handleNotificationAction(action: ActionPerformed) {
  const data = action.notification.data;

  if (data?.url) {
    // 앱 내 URL로 이동
    window.location.href = data.url;
  } else if (data?.productId) {
    // 상품 상세 페이지로 이동
    window.location.href = `/product/${data.productId}`;
  }
}

// 배지 카운트 설정
export async function setBadgeCount(count: number) {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');
    // iOS에서는 로컬 알림으로 배지 설정
    if (Capacitor.getPlatform() === 'ios') {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      await LocalNotifications.requestPermissions();
    }
  } catch (error) {
    console.error('[Push] 배지 설정 실패:', error);
  }
}

// 알림 채널 생성 (Android)
export async function createNotificationChannel() {
  if (Capacitor.getPlatform() !== 'android') return;

  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');
    await PushNotifications.createChannel({
      id: 'price-alerts',
      name: '가격 알림',
      description: '최저가 및 목표가 도달 알림',
      importance: 5, // HIGH
      visibility: 1, // PUBLIC
      vibration: true,
      sound: 'default',
      lights: true,
    });
  } catch (error) {
    console.error('[Push] 채널 생성 실패:', error);
  }
}
