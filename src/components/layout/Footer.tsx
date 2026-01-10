'use client';

import Link from 'next/link';
import { ArrowUp, TrendingDown, Search, Package, Heart, Bell, FileText, Shield } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#191f28] text-[#8b95a1]" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 로고 & 설명 */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="쿠팡 최저가 홈으로 이동">
              <div className="w-8 h-8 bg-[#3182f6] rounded-lg flex items-center justify-center">
                <TrendingDown size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                최저가
              </span>
            </Link>
            <p className="text-[14px] leading-relaxed text-[#6b7684]">
              쿠팡 상품의 가격 변동을 추적하고,
              <br />
              역대 최저가일 때 알림을 받아보세요.
            </p>
            <p className="text-[12px] text-[#4e5968] mt-4">
              스마트한 쇼핑의 시작, 쿠팡 최저가
            </p>
          </div>

          {/* 서비스 */}
          <nav aria-label="서비스 링크">
            <h3 className="text-[14px] font-semibold text-white mb-4">서비스</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/search"
                  className="flex items-center gap-2 text-[14px] text-[#8b95a1] hover:text-white transition-colors"
                >
                  <Search size={14} />
                  상품 검색
                </Link>
              </li>
              <li>
                <Link
                  href="/category/1016"
                  className="flex items-center gap-2 text-[14px] text-[#8b95a1] hover:text-white transition-colors"
                >
                  <Package size={14} />
                  카테고리
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="flex items-center gap-2 text-[14px] text-[#8b95a1] hover:text-white transition-colors"
                >
                  <Heart size={14} />
                  관심상품
                </Link>
              </li>
              <li>
                <Link
                  href="/alerts"
                  className="flex items-center gap-2 text-[14px] text-[#8b95a1] hover:text-white transition-colors"
                >
                  <Bell size={14} />
                  가격 알림
                </Link>
              </li>
            </ul>
          </nav>

          {/* 고객지원 */}
          <nav aria-label="고객지원 링크">
            <h3 className="text-[14px] font-semibold text-white mb-4">고객지원</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms"
                  className="flex items-center gap-2 text-[14px] text-[#8b95a1] hover:text-white transition-colors"
                >
                  <FileText size={14} />
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="flex items-center gap-2 text-[14px] text-[#8b95a1] hover:text-white transition-colors"
                >
                  <Shield size={14} />
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* 파트너스 고지 */}
        <div className="mt-10 pt-8 border-t border-[#333d4b]">
          <div className="p-4 bg-[#333d4b]/50 rounded-xl mb-6">
            <p className="text-[12px] text-[#8b95a1] leading-relaxed">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
              수수료를 제공받습니다. 구매자에게 추가 비용이 발생하지 않습니다.
              서비스에서 제공하는 가격 정보는 쿠팡 API를 통해 제공받으며, 실시간으로
              변동될 수 있습니다.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-[#6b7684]">
              &copy; {new Date().getFullYear()} 쿠팡 최저가. All rights reserved.
            </p>
            <button
              onClick={scrollToTop}
              className="p-2 bg-[#333d4b] hover:bg-[#4e5968] rounded-lg transition-colors"
              aria-label="페이지 맨 위로 이동"
            >
              <ArrowUp size={16} className="text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
