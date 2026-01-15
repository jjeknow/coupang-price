'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Clock, X, Sparkles } from 'lucide-react';

// 인기 검색어 (트렌드)
const TRENDING_KEYWORDS = [
  '에어팟 프로',
  '삼성 TV',
  '다이슨 청소기',
  '닌텐도 스위치',
  '아이패드',
  '맥북',
];

// 자동완성 추천 키워드
const SUGGEST_KEYWORDS: Record<string, string[]> = {
  '에어': ['에어팟', '에어팟 프로', '에어컨', '에어프라이어'],
  '삼성': ['삼성 TV', '삼성 냉장고', '삼성 세탁기', '삼성 갤럭시'],
  '다이슨': ['다이슨 청소기', '다이슨 에어랩', '다이슨 드라이기'],
  '애플': ['애플워치', '아이폰', '아이패드', '맥북'],
  '아이': ['아이폰', '아이패드', '아이맥'],
  '노트북': ['노트북', '삼성 노트북', 'LG 그램', '맥북 프로'],
  '냉장고': ['냉장고', '삼성 냉장고', 'LG 냉장고', '김치냉장고'],
  '세탁기': ['세탁기', '드럼세탁기', '건조기', 'LG 세탁기'],
  '청소기': ['청소기', '무선청소기', '로봇청소기', '다이슨 청소기'],
  '라면': ['라면', '신라면', '진라면', '불닭볶음면'],
  '커피': ['커피', '원두커피', '캡슐커피', '스타벅스'],
};

// 로컬스토리지 키
const RECENT_SEARCHES_KEY = 'recentSearches';

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 최근 검색어 로드
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // 자동완성 제안
  useEffect(() => {
    if (query.length >= 1) {
      const matched: string[] = [];
      for (const [prefix, keywords] of Object.entries(SUGGEST_KEYWORDS)) {
        if (prefix.includes(query) || query.includes(prefix)) {
          matched.push(...keywords);
        }
      }
      setSuggestions([...new Set(matched)].slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (keyword: string) => {
    const updated = [keyword, ...recentSearches.filter(k => k !== keyword)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const removeRecentSearch = (keyword: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(k => k !== keyword);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    saveRecentSearch(keyword);
    setShowDropdown(false);
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <section className="relative">
      {/* 다크 블루 그라데이션 배경 - overflow-hidden 적용 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
      </div>

      {/* 글로우 이펙트 - overflow-hidden wrapper 안에 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px]">
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#3b82f6]/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#6366f1]/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#0ea5e9]/20 rounded-full blur-[80px]" />
        </div>
      </div>

      {/* 그리드 패턴 오버레이 - overflow-hidden wrapper 안에 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* 뱃지 */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-3">
            <Sparkles size={12} className="text-[#60a5fa]" />
            <span className="text-[12px] text-white/80">쿠팡 가격변동 알리미</span>
          </div>

          {/* 타이틀 */}
          <h1 className="text-[22px] font-bold leading-tight mb-2 tracking-tight text-white">
            쿠팡 가격변동 추적{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] via-[#a78bfa] to-[#60a5fa] animate-gradient bg-[length:200%_auto]">
              & 최저가 알림
            </span>
          </h1>
          <p className="text-[#94a3b8] text-[13px] mb-5 max-w-md">
            쿠팡 가격비교, 실시간 가격 그래프로 최적의 구매 타이밍을 찾아보세요.
          </p>

          {/* 검색창 */}
          <form onSubmit={handleSearch} className="w-full max-w-xl mb-4">
            <div ref={dropdownRef} className="relative">
              <div
                className={`relative bg-white/5 backdrop-blur-xl border rounded-xl transition-all duration-300 ${
                  isFocused
                    ? 'border-[#3b82f6]/50 bg-white/10 ring-2 ring-[#3b82f6]/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => { setIsFocused(true); setShowDropdown(true); }}
                  onBlur={() => setIsFocused(false)}
                  placeholder="상품명 or 쿠팡 URL 입력"
                  className="w-full pl-4 pr-20 py-3 text-[14px] text-white placeholder:text-[#64748b] bg-transparent rounded-xl focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] hover:from-[#2563eb] hover:to-[#4f46e5] text-white text-[13px] font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5"
                >
                  <Search size={14} />
                  검색
                </button>
              </div>

              {/* 자동완성 드롭다운 */}
              {showDropdown && (suggestions.length > 0 || recentSearches.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] rounded-lg border border-white/20 z-[100] shadow-2xl max-h-64 overflow-y-auto">
                  {suggestions.length > 0 && (
                    <div className="p-1.5">
                      <p className="px-2.5 py-1 text-[11px] text-[#64748b] font-medium">추천 검색어</p>
                      {suggestions.map((keyword) => (
                        <button
                          key={keyword}
                          type="button"
                          onClick={() => handleKeywordClick(keyword)}
                          className="w-full px-2.5 py-2 text-left text-[13px] text-white hover:bg-white/10 rounded-md flex items-center gap-2 transition-colors"
                        >
                          <Search size={12} className="text-[#64748b]" />
                          {keyword}
                        </button>
                      ))}
                    </div>
                  )}

                  {recentSearches.length > 0 && suggestions.length === 0 && (
                    <div className="p-1.5">
                      <p className="px-2.5 py-1 text-[11px] text-[#64748b] font-medium">최근 검색어</p>
                      {recentSearches.map((keyword) => (
                        <button
                          key={keyword}
                          type="button"
                          onClick={() => handleKeywordClick(keyword)}
                          className="w-full px-2.5 py-2 text-left text-[13px] text-white hover:bg-white/10 rounded-md flex items-center justify-between group transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Clock size={12} className="text-[#64748b]" />
                            {keyword}
                          </span>
                          <X
                            size={12}
                            className="text-[#64748b] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => removeRecentSearch(keyword, e)}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>

          {/* 인기 검색어 */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
            {TRENDING_KEYWORDS.slice(0, 4).map((keyword) => (
              <button
                key={keyword}
                onClick={() => handleKeywordClick(keyword)}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[#94a3b8] hover:text-white text-[11px] rounded-full transition-all duration-200"
              >
                #{keyword}
              </button>
            ))}
          </div>

          {/* 파트너스 고지 */}
          <div className="mx-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
            <p className="text-[#94a3b8] text-[10px]">
              본 서비스는 쿠팡 파트너스 활동의 일환으로 수수료를 제공받습니다
            </p>
          </div>
        </div>
      </div>

      {/* CSS 애니메이션 */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </section>
  );
}
