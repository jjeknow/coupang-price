'use client';

import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f2f4f6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-lg">
        {/* 아이콘 */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#fff8f0] flex items-center justify-center">
          <WifiOff className="w-10 h-10 text-[#ff8b00]" />
        </div>

        {/* 제목 */}
        <h1 className="text-[22px] font-bold text-[#191f28] mb-3">
          오프라인 상태입니다
        </h1>

        {/* 설명 */}
        <p className="text-[14px] text-[#6b7684] mb-8 leading-relaxed">
          인터넷 연결이 끊어졌습니다.<br />
          Wi-Fi 또는 모바일 데이터를 확인해주세요.
        </p>

        {/* 재시도 버튼 */}
        <button
          onClick={handleRetry}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#3182f6] text-white rounded-xl font-semibold hover:bg-[#1b64da] active:scale-[0.98] transition-all w-full justify-center"
        >
          <RefreshCw size={20} />
          다시 연결하기
        </button>

        {/* 안내 문구 */}
        <p className="mt-6 text-[12px] text-[#8b95a1]">
          연결이 복구되면 자동으로 페이지가 새로고침됩니다
        </p>
      </div>
    </div>
  );
}
