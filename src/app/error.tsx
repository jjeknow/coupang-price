'use client';

/**
 * 에러 페이지 컴포넌트
 *
 * 네이버 SEO 가이드라인:
 * - 서버 에러 시 5xx HTTP 상태 코드 반환
 * - 사용자에게 친화적인 안내 제공
 * - 재시도 옵션 제공
 */

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 에러 추적 서비스로 전송)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 에러 아이콘 */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-[#fff0f0] rounded-full flex items-center justify-center">
            <AlertTriangle size={48} className="text-[#f04452]" />
          </div>
        </div>

        {/* 메시지 */}
        <h1 className="text-2xl font-bold text-[#191f28] mb-3">
          문제가 발생했습니다
        </h1>
        <p className="text-[#5c6470] mb-8 leading-relaxed">
          일시적인 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </p>

        {/* 에러 다이제스트 (디버깅용) */}
        {error.digest && (
          <p className="text-xs text-[#5c6470] mb-6 font-mono">
            오류 코드: {error.digest}
          </p>
        )}

        {/* 액션 버튼들 */}
        <div className="flex flex-col gap-3 justify-center">
          <button
            onClick={reset}
            className="toss-btn toss-btn-primary inline-flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            다시 시도
          </button>
          <Link
            href="/"
            className="toss-btn toss-btn-secondary inline-flex items-center justify-center gap-2"
          >
            <Home size={18} />
            홈으로 이동
          </Link>
        </div>

        {/* 도움말 */}
        <div className="mt-12 p-4 bg-[#f2f4f6] rounded-xl">
          <p className="text-sm text-[#5c6470]">
            문제가 계속되면 잠시 후 다시 방문해주세요.
            <br />
            불편을 드려 죄송합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
