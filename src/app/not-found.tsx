/**
 * 404 Not Found 페이지
 *
 * 네이버 SEO 가이드라인:
 * - 존재하지 않는 페이지는 반드시 404 HTTP 상태 코드 반환
 * - 사용자 친화적인 안내 제공
 */

import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다 (404)',
  description: '요청하신 페이지를 찾을 수 없습니다. URL을 확인하거나 홈으로 이동해주세요.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 아이콘 */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-[#f2f4f6] rounded-full flex items-center justify-center">
            <span className="text-6xl font-bold text-[#6b7684]">404</span>
          </div>
        </div>

        {/* 메시지 */}
        <h1 className="text-2xl font-bold text-[#191f28] mb-3">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-[#6b7684] mb-8 leading-relaxed">
          요청하신 페이지가 삭제되었거나,
          <br />
          잘못된 주소를 입력하셨습니다.
        </p>

        {/* 액션 버튼들 */}
        <div className="flex flex-col gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3182f6] text-white rounded-xl font-medium hover:bg-[#1b64da] transition-colors"
          >
            <Home size={18} />
            홈으로
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#f2f4f6] text-[#4e5968] rounded-xl font-medium hover:bg-[#e5e8eb] transition-colors"
          >
            <Search size={18} />
            상품 검색
          </Link>
        </div>

        {/* 도움말 */}
        <div className="mt-12 p-4 bg-[#f2f4f6] rounded-xl">
          <p className="text-sm text-[#6b7684]">
            찾으시는 상품이 있다면{' '}
            <Link href="/search" className="text-[#3182f6] hover:underline">
              검색 기능
            </Link>
            을 이용해보세요.
          </p>
        </div>
      </div>
    </div>
  );
}
