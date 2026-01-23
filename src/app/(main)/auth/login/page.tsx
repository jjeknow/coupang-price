'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [isNativeIOS, setIsNativeIOS] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if running in native iOS app
    const checkNative = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        setIsNativeIOS(Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios');
      } catch {
        setIsNativeIOS(false);
      }
    };
    checkNative();
  }, []);

  const handleAppleLogin = async () => {
    setLoading(true);

    try {
      if (isNativeIOS) {
        // Native Sign in with Apple for iOS app
        const { signInWithAppleNative } = await import('@/lib/capacitor/apple-auth');
        const result = await signInWithAppleNative();

        if (result?.response) {
          // Send to our API to create/login user
          const res = await fetch('/api/auth/apple-native', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user: result.response.user,
              email: result.response.email,
              givenName: result.response.givenName,
              familyName: result.response.familyName,
              identityToken: result.response.identityToken,
            }),
          });

          if (res.ok) {
            router.push(callbackUrl);
            return;
          }
        }
      }

      // Fallback to NextAuth (web)
      signIn('apple', { callbackUrl });
    } catch (error) {
      console.error('Apple login error:', error);
      signIn('apple', { callbackUrl });
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    signIn('kakao', { callbackUrl });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#191f28] mb-2">로그인</h1>
          <p className="text-[#5c6470]">최저가 알림을 받으려면 로그인하세요</p>
        </div>

        <div className="space-y-3">
          {/* Apple 로그인 (iOS 필수 - Guideline 4.8) */}
          <button
            onClick={handleAppleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 active:scale-[0.98] transition-all touch-manipulation disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            )}
            {loading ? '로그인 중...' : 'Apple로 계속하기'}
          </button>

          {/* 카카오 로그인 */}
          <button
            onClick={handleKakaoLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-[#FEE500] text-[#191f28] rounded-xl font-medium hover:bg-[#FADA0A] active:scale-[0.98] transition-all touch-manipulation"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 3C5.58172 3 2 5.79086 2 9.20755C2 11.4151 3.54198 13.3397 5.80545 14.3962L4.97368 17.4528C4.89777 17.7408 5.22735 17.9692 5.48052 17.8021L9.17596 15.3585C9.44707 15.3862 9.72166 15.4151 10 15.4151C14.4183 15.4151 18 12.6242 18 9.20755C18 5.79086 14.4183 3 10 3Z" fill="#191f28"/>
            </svg>
            카카오로 시작하기
          </button>
        </div>

        {/* 안내 문구 */}
        <p className="text-center text-[13px] text-[#8b95a1] mt-6">
          로그인하면 관심상품 저장, 최저가 알림 등<br />
          다양한 기능을 이용할 수 있습니다.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3182f6] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
