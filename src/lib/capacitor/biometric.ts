/**
 * iOS 생체 인증 (Face ID / Touch ID)
 * App Store 심사 핵심 네이티브 기능
 */

import { Capacitor } from '@capacitor/core';

export type BiometricType = 'face' | 'finger' | 'none';

export interface BiometricCredentials {
  username: string;
  password: string;
}

// 생체 인증 사용 가능 여부 확인
export async function isBiometricAvailable(): Promise<{
  available: boolean;
  type: BiometricType;
}> {
  if (!Capacitor.isNativePlatform()) {
    return { available: false, type: 'none' };
  }

  try {
    const { NativeBiometric } = await import('capacitor-native-biometric');
    const result = await NativeBiometric.isAvailable();

    const type: BiometricType = result.biometryType === 1 ? 'finger' :
                                result.biometryType === 2 ? 'face' : 'none';

    return {
      available: result.isAvailable,
      type,
    };
  } catch (error) {
    console.error('[Biometric] 확인 실패:', error);
    return { available: false, type: 'none' };
  }
}

// 생체 인증 요청
export async function verifyBiometric(options?: {
  reason?: string;
  title?: string;
  subtitle?: string;
}): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    console.log('[Biometric] 웹 환경 - 건너뜀');
    return true; // 웹에서는 항상 성공 처리
  }

  try {
    const { NativeBiometric } = await import('capacitor-native-biometric');

    await NativeBiometric.verifyIdentity({
      reason: options?.reason || '본인 확인이 필요합니다',
      title: options?.title || '생체 인증',
      subtitle: options?.subtitle || 'Face ID 또는 Touch ID로 인증하세요',
      description: '',
      useFallback: true, // 생체 인증 실패 시 비밀번호 사용
      fallbackTitle: '비밀번호 사용',
      maxAttempts: 3,
    });

    console.log('[Biometric] 인증 성공');
    return true;
  } catch (error) {
    console.error('[Biometric] 인증 실패:', error);
    return false;
  }
}

// 자격증명 저장 (Keychain)
export async function saveCredentials(credentials: BiometricCredentials): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    // 웹에서는 localStorage 사용 (보안 주의)
    try {
      localStorage.setItem('auth_credentials', JSON.stringify(credentials));
      return true;
    } catch {
      return false;
    }
  }

  try {
    const { NativeBiometric } = await import('capacitor-native-biometric');

    await NativeBiometric.setCredentials({
      username: credentials.username,
      password: credentials.password,
      server: 'com.ddokcheck.app',
    });

    console.log('[Biometric] 자격증명 저장 성공');
    return true;
  } catch (error) {
    console.error('[Biometric] 자격증명 저장 실패:', error);
    return false;
  }
}

// 자격증명 불러오기 (Keychain)
export async function getCredentials(): Promise<BiometricCredentials | null> {
  if (!Capacitor.isNativePlatform()) {
    try {
      const stored = localStorage.getItem('auth_credentials');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  try {
    const { NativeBiometric } = await import('capacitor-native-biometric');

    const credentials = await NativeBiometric.getCredentials({
      server: 'com.ddokcheck.app',
    });

    return {
      username: credentials.username,
      password: credentials.password,
    };
  } catch (error) {
    console.error('[Biometric] 자격증명 불러오기 실패:', error);
    return null;
  }
}

// 자격증명 삭제
export async function deleteCredentials(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    localStorage.removeItem('auth_credentials');
    return true;
  }

  try {
    const { NativeBiometric } = await import('capacitor-native-biometric');

    await NativeBiometric.deleteCredentials({
      server: 'com.ddokcheck.app',
    });

    console.log('[Biometric] 자격증명 삭제 성공');
    return true;
  } catch (error) {
    console.error('[Biometric] 자격증명 삭제 실패:', error);
    return false;
  }
}

// 생체 인증으로 로그인
export async function biometricLogin(): Promise<BiometricCredentials | null> {
  // 1. 생체 인증 가능 여부 확인
  const { available } = await isBiometricAvailable();
  if (!available) {
    console.log('[Biometric] 생체 인증 불가');
    return null;
  }

  // 2. 저장된 자격증명 확인
  const credentials = await getCredentials();
  if (!credentials) {
    console.log('[Biometric] 저장된 자격증명 없음');
    return null;
  }

  // 3. 생체 인증 요청
  const verified = await verifyBiometric({
    reason: '로그인을 위해 인증이 필요합니다',
    title: '똑체크 로그인',
    subtitle: '저장된 계정으로 로그인합니다',
  });

  if (!verified) {
    return null;
  }

  return credentials;
}

// 민감한 정보 접근 시 인증
export async function verifyForSensitiveAction(actionName: string): Promise<boolean> {
  const { available } = await isBiometricAvailable();

  if (!available) {
    // 생체 인증 불가 시 그냥 허용
    return true;
  }

  return verifyBiometric({
    reason: `${actionName}을(를) 위해 인증이 필요합니다`,
    title: '본인 확인',
    subtitle: actionName,
  });
}
