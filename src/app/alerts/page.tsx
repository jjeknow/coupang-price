import { Metadata } from 'next';
import Link from 'next/link';
import { Bell, ArrowLeft, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: '가격 알림 | 쿠팡 최저가',
  description: '관심 상품의 가격이 원하는 가격으로 내려가면 알림을 받아보세요.',
};

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-[#f2f4f6]">
      {/* 헤더 */}
      <div className="bg-white border-b border-[#e5e8eb] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 -ml-2 hover:bg-[#f2f4f6] rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-[18px] font-bold text-[#191f28] flex items-center gap-2">
                <Bell size={20} className="text-[#fab005]" />
                가격 알림
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl p-8 text-center border border-[#e5e8eb] shadow-sm">
          <div className="w-16 h-16 bg-[#fff9db] rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-[#fab005]" />
          </div>
          <h2 className="text-lg font-bold text-[#191f28] mb-3">
            서비스 준비 중입니다
          </h2>
          <p className="text-[#5c6470] text-[14px] mb-6 leading-relaxed">
            가격 알림 기능을 열심히 개발하고 있습니다.
            <br />
            조금만 기다려주세요!
          </p>
          <div className="bg-[#f8f9fa] rounded-xl p-4 mb-6">
            <p className="text-[#4e5968] text-[13px]">
              <strong className="text-[#191f28]">예정 기능</strong>
              <br />
              원하는 가격 설정 → 가격 하락 시 알림 발송
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3182f6] hover:bg-[#1b64da] text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft size={18} />
            홈으로 돌아가기
          </Link>
        </div>

        {/* 파트너스 고지 */}
        <p className="text-[12px] text-[#5c6470] mt-8 text-center">
          본 서비스는 쿠팡 파트너스 활동의 일환으로 수수료를 제공받습니다.
        </p>
      </div>
    </div>
  );
}
