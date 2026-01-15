'use client';

import { Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* 서비스 준비 중 안내 */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🚧</span>
            </div>
            <div>
              <p className="font-medium text-amber-800 mb-1">서비스 준비 중</p>
              <p className="text-sm text-amber-700">
                로그인 기능은 현재 개발 중입니다. 곧 관심상품 저장, 최저가 알림 등 다양한 기능을 이용하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#191f28] mb-2">로그인</h1>
          <p className="text-[#5c6470]">최저가 알림을 받으려면 로그인하세요</p>
        </div>

        {/* 소셜 로그인 */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleSocialLogin('kakao')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#FEE500] text-[#191f28] rounded-xl font-medium hover:bg-[#FADA0A] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 3C5.58172 3 2 5.79086 2 9.20755C2 11.4151 3.54198 13.3397 5.80545 14.3962L4.97368 17.4528C4.89777 17.7408 5.22735 17.9692 5.48052 17.8021L9.17596 15.3585C9.44707 15.3862 9.72166 15.4151 10 15.4151C14.4183 15.4151 18 12.6242 18 9.20755C18 5.79086 14.4183 3 10 3Z" fill="#191f28"/>
            </svg>
            카카오로 시작하기
          </button>

          <button
            onClick={() => handleSocialLogin('naver')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#03C75A] text-white rounded-xl font-medium hover:bg-[#02B350] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13.5 10.5L6.5 3H3V17H6.5V9.5L13.5 17H17V3H13.5V10.5Z" fill="white"/>
            </svg>
            네이버로 시작하기
          </button>

          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-[#e5e8eb] text-[#191f28] rounded-xl font-medium hover:bg-[#f2f4f6] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19.6 10.23C19.6 9.52 19.54 8.84 19.42 8.18H10V12.05H15.38C15.15 13.3 14.44 14.36 13.38 15.08V17.58H16.62C18.51 15.84 19.6 13.27 19.6 10.23Z" fill="#4285F4"/>
              <path d="M10 20C12.7 20 14.96 19.1 16.62 17.58L13.38 15.08C12.49 15.68 11.35 16.03 10 16.03C7.39 16.03 5.19 14.27 4.4 11.9H1.07V14.48C2.72 17.75 6.09 20 10 20Z" fill="#34A853"/>
              <path d="M4.4 11.9C4.2 11.3 4.09 10.66 4.09 10C4.09 9.34 4.2 8.7 4.4 8.1V5.52H1.07C0.39 6.86 0 8.39 0 10C0 11.61 0.39 13.14 1.07 14.48L4.4 11.9Z" fill="#FBBC05"/>
              <path d="M10 3.97C11.47 3.97 12.79 4.47 13.83 5.44L16.69 2.58C14.96 0.98 12.7 0 10 0C6.09 0 2.72 2.25 1.07 5.52L4.4 8.1C5.19 5.73 7.39 3.97 10 3.97Z" fill="#EA4335"/>
            </svg>
            Google로 시작하기
          </button>
        </div>
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
