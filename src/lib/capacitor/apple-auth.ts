/**
 * Native Sign in with Apple for iOS
 * Uses @capacitor-community/apple-sign-in plugin
 * Falls back to NextAuth for web
 */

import { Capacitor } from '@capacitor/core';

export interface AppleSignInResponse {
  response: {
    user: string;
    email: string | null;
    givenName: string | null;
    familyName: string | null;
    identityToken: string;
    authorizationCode: string;
  };
}

// Native Sign in with Apple (iOS only)
export async function signInWithAppleNative(): Promise<AppleSignInResponse | null> {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
    return null;
  }

  try {
    const { SignInWithApple } = await import('@capacitor-community/apple-sign-in');

    const result = await SignInWithApple.authorize({
      clientId: 'com.ddokcheck.app',
      redirectURI: 'https://ddokcheck.com/api/auth/callback/apple',
      scopes: 'email name',
      state: Math.random().toString(36).substring(7),
      nonce: Math.random().toString(36).substring(7),
    });

    return result as AppleSignInResponse;
  } catch (error) {
    console.error('[Apple Sign In] Native 인증 실패:', error);
    return null;
  }
}

// Check if native Apple Sign In is available
export function isNativeAppleSignInAvailable(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';
}
