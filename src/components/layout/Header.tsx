'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

// SVG 아이콘 컴포넌트들
const SearchIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const BellIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();

  // 스크롤 시 그림자 추가
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white safe-area-top transition-shadow ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="border-b border-[#e5e8eb]">
        <div className="max-w-6xl mx-auto px-4">
          {/* 모바일 스타일 헤더 (PC에서도 동일) */}
          <div className="flex items-center justify-between h-14">
            {/* 로고 */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="똑체크"
                width={100}
                height={32}
                className="h-7 w-auto"
                priority
              />
            </Link>

            {/* 검색 + 알림 버튼 */}
            <div className="flex items-center gap-1">
              <Link
                href="/search"
                className="w-10 h-10 flex items-center justify-center text-[#4e5968] hover:bg-[#f2f4f6] active:bg-[#f2f4f6] rounded-full transition-colors"
                aria-label="검색"
              >
                <SearchIcon size={22} />
              </Link>
              <Link
                href={session ? '/mypage/alerts' : '/auth/login?callbackUrl=/mypage/alerts'}
                className="w-10 h-10 flex items-center justify-center text-[#4e5968] hover:bg-[#f2f4f6] active:bg-[#f2f4f6] rounded-full transition-colors"
                aria-label="알림"
              >
                <BellIcon size={22} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
