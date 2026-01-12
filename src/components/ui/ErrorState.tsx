'use client';

import { memo } from 'react';
import { RefreshCw, WifiOff, ServerCrash, AlertCircle, Search, ShoppingBag } from 'lucide-react';

interface ErrorStateProps {
  type?: 'network' | 'server' | 'notFound' | 'empty' | 'generic';
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const errorConfig = {
  network: {
    icon: WifiOff,
    defaultTitle: '네트워크 연결 오류',
    defaultMessage: '인터넷 연결을 확인해주세요.',
    iconColor: 'text-[#ff8b00]',
    bgColor: 'bg-[#fff8f0]',
    borderColor: 'border-[#ffcf96]',
  },
  server: {
    icon: ServerCrash,
    defaultTitle: '서버 오류',
    defaultMessage: '잠시 후 다시 시도해주세요.',
    iconColor: 'text-[#f04452]',
    bgColor: 'bg-[#fff5f5]',
    borderColor: 'border-[#ffc9c9]',
  },
  notFound: {
    icon: Search,
    defaultTitle: '검색 결과 없음',
    defaultMessage: '다른 검색어로 시도해보세요.',
    iconColor: 'text-[#6b7684]',
    bgColor: 'bg-[#f8f9fa]',
    borderColor: 'border-[#e5e8eb]',
  },
  empty: {
    icon: ShoppingBag,
    defaultTitle: '상품이 없습니다',
    defaultMessage: '다른 카테고리를 탐색해보세요.',
    iconColor: 'text-[#8b95a1]',
    bgColor: 'bg-[#f8f9fa]',
    borderColor: 'border-[#e5e8eb]',
  },
  generic: {
    icon: AlertCircle,
    defaultTitle: '오류가 발생했습니다',
    defaultMessage: '잠시 후 다시 시도해주세요.',
    iconColor: 'text-[#f04452]',
    bgColor: 'bg-[#fff5f5]',
    borderColor: 'border-[#ffc9c9]',
  },
};

function ErrorState({
  type = 'generic',
  title,
  message,
  onRetry,
  showRetry = true,
}: ErrorStateProps) {
  const config = errorConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`rounded-2xl p-8 sm:p-12 text-center ${config.bgColor} border ${config.borderColor}`}
      role="alert"
      aria-live="polite"
    >
      {/* 아이콘 */}
      <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-white flex items-center justify-center shadow-sm`}>
        <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${config.iconColor}`} />
      </div>

      {/* 제목 */}
      <h3 className="text-[17px] sm:text-[20px] font-bold text-[#191f28] mb-2">
        {title || config.defaultTitle}
      </h3>

      {/* 메시지 */}
      <p className="text-[13px] sm:text-[14px] text-[#6b7684] mb-6">
        {message || config.defaultMessage}
      </p>

      {/* 재시도 버튼 */}
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#3182f6] text-white rounded-xl font-medium hover:bg-[#1b64da] active:scale-[0.98] transition-all"
        >
          <RefreshCw size={18} />
          다시 시도
        </button>
      )}
    </div>
  );
}

// 전체 페이지 에러 상태
export function FullPageError({
  type = 'generic',
  title,
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <ErrorState
        type={type}
        title={title}
        message={message}
        onRetry={onRetry}
      />
    </div>
  );
}

// 인라인 에러 배너
export function ErrorBanner({
  message,
  onDismiss,
  onRetry,
}: {
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}) {
  return (
    <div
      className="bg-[#fff5f5] border border-[#ffc9c9] rounded-xl p-4 flex items-center justify-between gap-4"
      role="alert"
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-[#f04452] flex-shrink-0" />
        <p className="text-[13px] sm:text-[14px] text-[#191f28]">{message}</p>
      </div>
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-[13px] font-medium text-[#3182f6] hover:underline"
          >
            재시도
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-[#8b95a1] hover:text-[#4e5968]"
            aria-label="닫기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// 오프라인 상태 배너
export function OfflineBanner() {
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-[#191f28] text-white rounded-xl p-4 shadow-lg z-50 animate-fadeIn">
      <div className="flex items-center gap-3">
        <WifiOff className="w-5 h-5 text-[#ff8b00]" />
        <div>
          <p className="text-[14px] font-medium">오프라인 상태</p>
          <p className="text-[12px] text-[#8b95a1]">인터넷 연결을 확인해주세요</p>
        </div>
      </div>
    </div>
  );
}

export default memo(ErrorState);
