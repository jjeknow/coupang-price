/**
 * 햅틱 피드백 훅
 * iOS/Android에서 터치 피드백 제공
 */

import { useCallback } from 'react';
import { Capacitor } from '@capacitor/core';

export function useHaptic() {
  // 버튼 탭
  const tapFeedback = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) return;
    const { impact } = await import('@/lib/capacitor/haptics');
    await impact('light');
  }, []);

  // 성공 피드백
  const successFeedback = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) return;
    const { notification } = await import('@/lib/capacitor/haptics');
    await notification('success');
  }, []);

  // 경고 피드백
  const warningFeedback = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) return;
    const { notification } = await import('@/lib/capacitor/haptics');
    await notification('warning');
  }, []);

  // 에러 피드백
  const errorFeedback = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) return;
    const { notification } = await import('@/lib/capacitor/haptics');
    await notification('error');
  }, []);

  // 선택 변경 (피커, 스위치 등)
  const selectionFeedback = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) return;
    const { selectionChanged } = await import('@/lib/capacitor/haptics');
    await selectionChanged();
  }, []);

  // 즐겨찾기 추가
  const favoriteFeedback = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) return;
    const { favoriteAdded } = await import('@/lib/capacitor/haptics');
    await favoriteAdded();
  }, []);

  // 강한 피드백 (중요한 액션)
  const heavyFeedback = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) return;
    const { impact } = await import('@/lib/capacitor/haptics');
    await impact('heavy');
  }, []);

  return {
    tapFeedback,
    successFeedback,
    warningFeedback,
    errorFeedback,
    selectionFeedback,
    favoriteFeedback,
    heavyFeedback,
  };
}
