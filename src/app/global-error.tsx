'use client';

/**
 * 글로벌 에러 페이지
 *
 * 루트 레이아웃에서 발생하는 에러를 처리
 * 네이버 SEO: 500 상태 코드와 함께 사용자 친화적 메시지 표시
 */

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="bg-gray-50 font-sans">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* 에러 아이콘 */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-red-50 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* 메시지 */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              서비스에 문제가 발생했습니다
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              죄송합니다. 예기치 못한 오류가 발생했습니다.
              <br />
              잠시 후 다시 시도해주세요.
            </p>

            {/* 에러 다이제스트 */}
            {error.digest && (
              <p className="text-xs text-gray-400 mb-6 font-mono">
                오류 코드: {error.digest}
              </p>
            )}

            {/* 액션 버튼들 */}
            <div className="flex flex-col gap-3">
              <button
                onClick={reset}
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
              >
                다시 시도
              </button>
              <a
                href="/"
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
              >
                홈으로 이동
              </a>
            </div>

            {/* 도움말 */}
            <div className="mt-12 p-4 bg-gray-100 rounded-xl">
              <p className="text-sm text-gray-500">
                불편을 드려 죄송합니다.
                <br />
                문제가 계속되면 잠시 후 다시 방문해주세요.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
