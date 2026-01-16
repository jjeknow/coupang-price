'use client';

import { Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

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
