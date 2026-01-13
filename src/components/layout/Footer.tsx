'use client';

import Link from 'next/link';
import {
  ArrowUp,
  Search,
  Package,
  Heart,
  Bell,
  FileText,
  Shield,
  Info,
  Mail,
  Sparkles,
  TrendingDown,
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden" role="contentinfo">
      {/* 다크 블루 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />

      {/* 글로우 이펙트 - 모바일에서 축소 */}
      <div className="absolute top-0 left-1/4 w-48 md:w-72 h-48 md:h-72 bg-[#3b82f6]/10 rounded-full blur-[80px] md:blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-[#6366f1]/10 rounded-full blur-[100px] md:blur-[120px]" />

      {/* 그리드 패턴 오버레이 */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 md:py-16">
        {/* 상단: CTA 섹션 */}
        <div className="text-center mb-8 md:mb-12 pb-8 md:pb-12 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-3 md:mb-4">
            <Sparkles size={12} className="text-[#60a5fa]" />
            <span className="text-[10px] md:text-[11px] text-white/70">쿠팡 가격변동 알리미</span>
          </div>
          <h2 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3">
            쿠팡 가격비교,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-[#a78bfa]">
              지금 시작하세요
            </span>
          </h2>
          <p className="text-[#64748b] text-[12px] md:text-[14px] mb-4 md:mb-6">
            쿠팡 가격변동 추적, 실시간 가격 그래프로 최저가 알림을 받아보세요
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] hover:from-[#2563eb] hover:to-[#4f46e5] text-white text-[13px] md:text-[14px] font-semibold rounded-xl transition-all duration-200"
          >
            <Search size={14} className="md:w-4 md:h-4" />
            상품 검색하기
          </Link>
        </div>

        {/* 메인 푸터 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* 로고 & 설명 - 모바일에서는 전체 너비 */}
          <div className="col-span-2 md:col-span-1 mb-2 md:mb-0">
            <Link
              href="/"
              className="flex items-center gap-2 mb-3 md:mb-4"
              aria-label="똑체크 홈으로 이동"
            >
              <div className="w-8 md:w-9 h-8 md:h-9 bg-gradient-to-br from-[#3b82f6] to-[#6366f1] rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <TrendingDown size={16} className="md:w-[18px] md:h-[18px] text-white" />
              </div>
              <span className="text-base md:text-lg font-bold text-white tracking-tight">
                똑체크
              </span>
            </Link>
            <p className="text-[12px] md:text-[13px] leading-relaxed text-[#64748b]">
              쿠팡 가격변동 추적 사이트. 쿠팡 가격비교, 가격 그래프 확인, 최저가 알림으로 똑똑하게 쇼핑하세요.
            </p>
          </div>

          {/* 서비스 */}
          <nav aria-label="서비스 링크">
            <h3 className="text-[12px] md:text-[13px] font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
              <div className="w-1 h-3 md:h-4 bg-gradient-to-b from-[#3b82f6] to-[#6366f1] rounded-full" />
              서비스
            </h3>
            <ul className="space-y-2 md:space-y-2.5">
              <li>
                <Link
                  href="/search"
                  className="flex items-center gap-2 text-[12px] md:text-[13px] text-[#64748b] hover:text-white transition-colors group"
                >
                  <Search size={13} className="md:w-[14px] md:h-[14px] group-hover:text-[#60a5fa] transition-colors" />
                  상품 검색
                </Link>
              </li>
              <li>
                <Link
                  href="/category/1016"
                  className="flex items-center gap-2 text-[12px] md:text-[13px] text-[#64748b] hover:text-white transition-colors group"
                >
                  <Package size={13} className="md:w-[14px] md:h-[14px] group-hover:text-[#60a5fa] transition-colors" />
                  카테고리
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="flex items-center gap-2 text-[12px] md:text-[13px] text-[#64748b] hover:text-white transition-colors group"
                >
                  <Heart size={13} className="md:w-[14px] md:h-[14px] group-hover:text-[#f04452] transition-colors" />
                  관심상품
                </Link>
              </li>
              <li>
                <Link
                  href="/alerts"
                  className="flex items-center gap-2 text-[12px] md:text-[13px] text-[#64748b] hover:text-white transition-colors group"
                >
                  <Bell size={13} className="md:w-[14px] md:h-[14px] group-hover:text-[#fab005] transition-colors" />
                  가격 알림
                </Link>
              </li>
            </ul>
          </nav>

          {/* 안내 */}
          <nav aria-label="안내 링크">
            <h3 className="text-[12px] md:text-[13px] font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
              <div className="w-1 h-3 md:h-4 bg-gradient-to-b from-[#6366f1] to-[#a78bfa] rounded-full" />
              안내
            </h3>
            <ul className="space-y-2 md:space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-2 text-[12px] md:text-[13px] text-[#64748b] hover:text-white transition-colors group"
                >
                  <Info size={13} className="md:w-[14px] md:h-[14px] group-hover:text-[#60a5fa] transition-colors" />
                  서비스 소개
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="flex items-center gap-2 text-[12px] md:text-[13px] text-[#64748b] hover:text-white transition-colors group"
                >
                  <FileText size={13} className="md:w-[14px] md:h-[14px] group-hover:text-[#60a5fa] transition-colors" />
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="flex items-center gap-2 text-[12px] md:text-[13px] text-[#64748b] hover:text-white transition-colors group"
                >
                  <Shield size={13} className="md:w-[14px] md:h-[14px] group-hover:text-[#0ca678] transition-colors" />
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </nav>

          {/* 문의 */}
          <div>
            <h3 className="text-[12px] md:text-[13px] font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
              <div className="w-1 h-3 md:h-4 bg-gradient-to-b from-[#a78bfa] to-[#f472b6] rounded-full" />
              문의
            </h3>
            <a
              href="mailto:support@example.com"
              className="flex items-center gap-2 text-[12px] md:text-[13px] text-[#64748b] hover:text-white transition-colors group"
            >
              <Mail size={13} className="md:w-[14px] md:h-[14px] group-hover:text-[#60a5fa] transition-colors" />
              이메일 문의
            </a>
          </div>
        </div>

        {/* 파트너스 고지 - 가독성 개선 */}
        <div className="p-3 md:p-4 bg-white/[0.08] backdrop-blur-sm rounded-xl border border-white/15 mb-6 md:mb-8">
          <p className="text-[11px] md:text-[12px] text-[#94a3b8] leading-relaxed text-center">
            해당 사이트는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
            제공받으며, 수수료는 사이트 운영에 사용됩니다. 서비스에서 제공하는 가격
            정보는 쿠팡 API를 통해 제공받으며, 실시간으로 변동될 수 있습니다.
          </p>
        </div>

        {/* 하단 저작권 */}
        <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-white/10">
          <p className="text-[10px] md:text-[11px] text-[#64748b]">
            &copy; {new Date().getFullYear()} 똑체크 - 쿠팡 가격변동 추적. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="p-2 md:p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg md:rounded-xl transition-all duration-200 group"
            aria-label="페이지 맨 위로 이동"
          >
            <ArrowUp
              size={14}
              className="md:w-4 md:h-4 text-[#64748b] group-hover:text-white transition-colors"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
