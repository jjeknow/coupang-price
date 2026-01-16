/**
 * 생체 인증 훅
 * Face ID / Touch ID 지원
 */

import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';

interface BiometricState {
  isAvailable: boolean;
  type: 'face' | 'finger' | 'none';
  isLoading: boolean;
}

export function useBiometric() {
  const [state, setState] = useState<BiometricState>({
    isAvailable: false,
    type: 'none',
    isLoading: true,
  });

  // 생체 인증 가능 여부 확인
  useEffect(() => {
    async function checkBiometric() {
      if (!Capacitor.isNativePlatform()) {
        setState({ isAvailable: false, type: 'none', isLoading: false });
        return;
      }

      try {
        const { isBiometricAvailable } = await import('@/lib/capacitor/biometric');
        const result = await isBiometricAvailable();
        setState({
          isAvailable: result.available,
          type: result.type,
          isLoading: false,
        });
      } catch {
        setState({ isAvailable: false, type: 'none', isLoading: false });
      }
    }

    checkBiometric();
  }, []);

  // 생체 인증 요청
  const verify = useCallback(async (reason?: string): Promise<boolean> => {
    if (!state.isAvailable) return true; // 사용 불가 시 통과

    try {
      const { verifyBiometric } = await import('@/lib/capacitor/biometric');
      return await verifyBiometric({ reason });
    } catch {
      return false;
    }
  }, [state.isAvailable]);

  // 생체 인증으로 로그인
  const login = useCallback(async () => {
    if (!state.isAvailable) return null;

    try {
      const { biometricLogin } = await import('@/lib/capacitor/biometric');
      return await biometricLogin();
    } catch {
      return null;
    }
  }, [state.isAvailable]);

  // 자격증명 저장
  const saveCredentials = useCallback(async (username: string, password: string) => {
    try {
      const { saveCredentials: save } = await import('@/lib/capacitor/biometric');
      return await save({ username, password });
    } catch {
      return false;
    }
  }, []);

  // 자격증명 삭제
  const deleteCredentials = useCallback(async () => {
    try {
      const { deleteCredentials: del } = await import('@/lib/capacitor/biometric');
      return await del();
    } catch {
      return false;
    }
  }, []);

  // 인증 타입 텍스트
  const authTypeText = state.type === 'face' ? 'Face ID' :
                       state.type === 'finger' ? 'Touch ID' : '';

  return {
    ...state,
    verify,
    login,
    saveCredentials,
    deleteCredentials,
    authTypeText,
  };
}
