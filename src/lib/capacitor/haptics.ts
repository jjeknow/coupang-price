/**
 * iOS 햅틱 피드백
 * 터치 피드백으로 앱 품질 향상
 */

import { Capacitor } from '@capacitor/core';

export type HapticStyle = 'light' | 'medium' | 'heavy';
export type HapticNotificationType = 'success' | 'warning' | 'error';

// 햅틱 사용 가능 여부
export function isHapticsAvailable(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('Haptics');
}

// 기본 임팩트 햅틱
export async function impact(style: HapticStyle = 'medium') {
  if (!isHapticsAvailable()) return;

  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics');

    const styleMap = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    };

    await Haptics.impact({ style: styleMap[style] });
  } catch (error) {
    console.warn('[Haptics] 실패:', error);
  }
}

// 알림 타입 햅틱
export async function notification(type: HapticNotificationType = 'success') {
  if (!isHapticsAvailable()) return;

  try {
    const { Haptics, NotificationType } = await import('@capacitor/haptics');

    const typeMap = {
      success: NotificationType.Success,
      warning: NotificationType.Warning,
      error: NotificationType.Error,
    };

    await Haptics.notification({ type: typeMap[type] });
  } catch (error) {
    console.warn('[Haptics] 실패:', error);
  }
}

// 선택 햅틱 (피커, 스위치 등)
export async function selectionChanged() {
  if (!isHapticsAvailable()) return;

  try {
    const { Haptics } = await import('@capacitor/haptics');
    await Haptics.selectionChanged();
  } catch (error) {
    console.warn('[Haptics] 실패:', error);
  }
}

// 진동 (Android)
export async function vibrate(duration: number = 300) {
  if (!isHapticsAvailable()) return;

  try {
    const { Haptics } = await import('@capacitor/haptics');
    await Haptics.vibrate({ duration });
  } catch (error) {
    console.warn('[Haptics] 실패:', error);
  }
}

// 즐겨찾기 추가 햅틱
export async function favoriteAdded() {
  await notification('success');
}

// 즐겨찾기 제거 햅틱
export async function favoriteRemoved() {
  await impact('light');
}

// 버튼 탭 햅틱
export async function buttonTap() {
  await impact('light');
}

// 에러 발생 햅틱
export async function errorOccurred() {
  await notification('error');
}

// 최저가 알림 햅틱
export async function priceAlert() {
  await notification('success');
  // 추가 진동으로 주목도 높임
  setTimeout(() => vibrate(100), 200);
}
