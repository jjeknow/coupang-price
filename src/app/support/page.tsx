'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, MessageCircle, HelpCircle, ChevronRight } from 'lucide-react';

const faqs = [
  {
    question: '가격 알림은 어떻게 받나요?',
    answer: '로그인 후 원하는 상품 페이지에서 "가격 알림" 버튼을 눌러 목표 가격을 설정하면, 해당 가격 이하로 떨어질 때 알림을 보내드립니다.',
  },
  {
    question: '가격 정보는 얼마나 자주 업데이트되나요?',
    answer: '가격 정보는 매일 업데이트됩니다. 실시간 가격과 차이가 있을 수 있으니 구매 전 쿠팡에서 최종 가격을 확인해주세요.',
  },
  {
    question: '관심상품은 몇 개까지 등록할 수 있나요?',
    answer: '로그인 사용자는 무제한으로 관심상품을 등록할 수 있습니다. 비로그인 사용자는 기기에 최대 50개까지 저장됩니다.',
  },
  {
    question: '계정을 삭제하고 싶어요.',
    answer: '로그인 후 마이페이지 > 설정에서 계정 삭제를 요청할 수 있습니다. 또는 아래 이메일로 문의해주세요.',
  },
  {
    question: '똑체크는 무료인가요?',
    answer: '네, 똑체크는 완전 무료 서비스입니다. 쿠팡 파트너스 제휴를 통해 서비스를 운영하며, 사용자에게 추가 비용은 없습니다.',
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#f2f4f6]">
      {/* 헤더 */}
      <div className="bg-white border-b border-[#e5e8eb]">
        <div className="px-4">
          <div className="flex items-center h-12">
            <Link href="/" className="p-2 -ml-2 text-[#4e5968] hover:bg-[#f2f4f6] rounded-lg flex items-center gap-2">
              <ArrowLeft size={20} />
              <span className="text-[14px] font-medium">뒤로</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* 타이틀 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#191f28] mb-2">고객 지원</h1>
          <p className="text-[#5c6470]">궁금한 점이 있으시면 언제든 문의해주세요</p>
        </div>

        {/* 문의 방법 */}
        <div className="bg-white rounded-2xl border border-[#e5e8eb] p-6 mb-6">
          <h2 className="text-lg font-bold text-[#191f28] mb-4">문의하기</h2>

          <a
            href="mailto:ddokcheck@naver.com"
            className="flex items-center gap-4 p-4 bg-[#f8f9fa] rounded-xl hover:bg-[#f2f4f6] transition-colors"
          >
            <div className="w-12 h-12 bg-[#3182f6] rounded-full flex items-center justify-center">
              <Mail size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#191f28]">이메일 문의</p>
              <p className="text-[14px] text-[#5c6470]">ddokcheck@naver.com</p>
            </div>
            <ChevronRight size={20} className="text-[#adb5bd]" />
          </a>

          <p className="text-[13px] text-[#8b95a1] mt-4">
            평일 기준 1-2일 내 답변드립니다.
          </p>
        </div>

        {/* 자주 묻는 질문 */}
        <div className="bg-white rounded-2xl border border-[#e5e8eb] p-6 mb-6">
          <h2 className="text-lg font-bold text-[#191f28] mb-4 flex items-center gap-2">
            <HelpCircle size={20} className="text-[#3182f6]" />
            자주 묻는 질문
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none p-3 bg-[#f8f9fa] rounded-xl hover:bg-[#f2f4f6] transition-colors">
                  <span className="font-medium text-[#191f28] text-[15px] pr-4">{faq.question}</span>
                  <ChevronRight size={18} className="text-[#adb5bd] transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-3 py-3 text-[14px] text-[#5c6470] leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* 서비스 정보 */}
        <div className="bg-white rounded-2xl border border-[#e5e8eb] p-6">
          <h2 className="text-lg font-bold text-[#191f28] mb-4">서비스 정보</h2>

          <div className="space-y-3 text-[14px]">
            <div className="flex justify-between">
              <span className="text-[#5c6470]">서비스명</span>
              <span className="text-[#191f28] font-medium">똑체크</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5c6470]">운영</span>
              <span className="text-[#191f28] font-medium">개인 개발자</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5c6470]">이메일</span>
              <span className="text-[#191f28] font-medium">ddokcheck@naver.com</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e5e8eb]">
            <div className="flex gap-4 text-[13px]">
              <Link href="/privacy" className="text-[#3182f6] hover:underline">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="text-[#3182f6] hover:underline">
                이용약관
              </Link>
            </div>
          </div>
        </div>

        {/* 파트너스 고지 */}
        <div className="mt-6 p-4 bg-[#f8f9fa] rounded-xl">
          <p className="text-[12px] text-[#8b95a1] leading-relaxed text-center">
            본 서비스는 쿠팡 파트너스 활동의 일환으로 수수료를 제공받으며,
            이를 통해 무료 서비스를 유지하고 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
