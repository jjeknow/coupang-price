'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { Search, Menu, X, Heart, Bell, User, TrendingDown, LogOut } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white safe-area-top">
      {/* 프로모션 배너 */}
      <div className="bg-[#191f28] text-white text-center py-2.5 px-4">
        <p className="text-[13px] font-medium">
          <Bell size={14} className="inline mr-1" />
          <span className="text-[#3182f6]">최저가 알림</span>을 받고 똑똑하게 쇼핑하세요
        </p>
      </div>

      <div className="border-b border-[#e5e8eb]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* 로고 */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#3182f6] rounded-lg flex items-center justify-center">
                <TrendingDown size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-[#191f28] tracking-tight">
                최저가
              </span>
            </Link>

            {/* 검색바 - 데스크톱 */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md mx-8"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="찾고 싶은 상품을 검색해보세요"
                  className="toss-input pl-4 pr-12 py-3 bg-[#f2f4f6] rounded-xl"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b95a1] hover:text-[#3182f6] transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* 네비게이션 - 데스크톱 */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href={session ? '/mypage/favorites' : '/favorites'}
                className="flex items-center gap-1.5 px-3 py-2 text-[#4e5968] hover:bg-[#f2f4f6] rounded-lg transition-colors"
              >
                <Heart size={18} />
                <span className="text-sm">관심상품</span>
              </Link>
              <Link
                href={session ? '/mypage/alerts' : '/auth/login?callbackUrl=/mypage/alerts'}
                className="flex items-center gap-1.5 px-3 py-2 text-[#4e5968] hover:bg-[#f2f4f6] rounded-lg transition-colors"
              >
                <Bell size={18} />
                <span className="text-sm">알림</span>
              </Link>

              {/* 로그인 상태에 따른 버튼 */}
              {status === 'loading' ? (
                <div className="w-20 h-10 bg-[#f2f4f6] rounded-xl animate-pulse ml-2" />
              ) : session?.user ? (
                <div className="relative group ml-2">
                  <button className="flex items-center gap-2 px-3 py-2 hover:bg-[#f2f4f6] rounded-xl transition-colors">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="프로필"
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-7 h-7 bg-[#3182f6] rounded-full flex items-center justify-center">
                        <User size={14} className="text-white" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-[#191f28] max-w-[80px] truncate">
                      {session.user.name || '사용자'}
                    </span>
                  </button>

                  {/* 드롭다운 메뉴 */}
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-[#e5e8eb] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="p-2">
                      <Link
                        href="/mypage"
                        className="flex items-center gap-2 px-3 py-2 text-[#4e5968] hover:bg-[#f2f4f6] rounded-lg text-sm"
                      >
                        <User size={16} />
                        마이페이지
                      </Link>
                      <Link
                        href="/mypage/favorites"
                        className="flex items-center gap-2 px-3 py-2 text-[#4e5968] hover:bg-[#f2f4f6] rounded-lg text-sm"
                      >
                        <Heart size={16} />
                        관심상품
                      </Link>
                      <Link
                        href="/mypage/alerts"
                        className="flex items-center gap-2 px-3 py-2 text-[#4e5968] hover:bg-[#f2f4f6] rounded-lg text-sm"
                      >
                        <Bell size={16} />
                        가격 알림
                      </Link>
                      <hr className="my-2 border-[#e5e8eb]" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-3 py-2 text-[#e03131] hover:bg-red-50 rounded-lg text-sm w-full"
                      >
                        <LogOut size={16} />
                        로그아웃
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-[#3182f6] text-white rounded-xl font-medium ml-2 hover:bg-[#1b64da] transition-colors"
                >
                  <User size={16} />
                  <span className="text-sm">로그인</span>
                </Link>
              )}
            </nav>

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[#4e5968] hover:bg-[#f2f4f6] rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 검색바 - 모바일 */}
      <div className="md:hidden px-4 pt-3 pb-4 bg-white">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b95a1]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="찾고 싶은 상품을 검색해보세요"
              className="w-full pl-11 pr-4 py-3 bg-[#f2f4f6] rounded-xl text-[15px] placeholder:text-[#8b95a1] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#3182f6]"
            />
          </div>
        </form>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#e5e8eb] animate-fadeIn">
          <nav className="px-4 py-4">
            {/* 로그인 상태면 프로필 표시 */}
            {session?.user && (
              <Link
                href="/mypage"
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#f2f4f6] rounded-xl transition-colors mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="프로필"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-[#3182f6] rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-[#191f28]">{session.user.name || '사용자'}</p>
                  <p className="text-[12px] text-[#6b7684]">{session.user.email}</p>
                </div>
              </Link>
            )}

            <Link
              href={session ? '/mypage/favorites' : '/favorites'}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#f2f4f6] rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-[#f2f4f6] rounded-full flex items-center justify-center">
                <Heart size={20} className="text-[#4e5968]" />
              </div>
              <span className="font-medium text-[#333d4b]">관심상품</span>
            </Link>
            <Link
              href={session ? '/mypage/alerts' : '/auth/login?callbackUrl=/mypage/alerts'}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#f2f4f6] rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-[#f2f4f6] rounded-full flex items-center justify-center">
                <Bell size={20} className="text-[#4e5968]" />
              </div>
              <span className="font-medium text-[#333d4b]">알림</span>
            </Link>

            {session?.user ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleSignOut();
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors w-full"
              >
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <LogOut size={20} className="text-[#e03131]" />
                </div>
                <span className="font-medium text-[#e03131]">로그아웃</span>
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#f2f4f6] rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-[#3182f6] rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <span className="font-medium text-[#333d4b]">로그인</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
