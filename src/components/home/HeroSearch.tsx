'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, Sparkles, Clock, X } from 'lucide-react';

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
      // 중복 제거 및 상위 5개
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
    <section className="bg-gradient-to-br from-[#f04452] to-[#ff6b6b] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-14">
        <div className="flex flex-col items-center text-center">
          {/* 타이틀 */}
          <p className="text-white/80 text-[12px] md:text-[14px] mb-1.5 md:mb-2 flex items-center gap-1">
            <Sparkles size={12} className="md:w-[14px] md:h-[14px]" />
            2026 Happy New Year
          </p>
          <h1 className="text-[24px] md:text-[36px] font-bold leading-tight mb-2 md:mb-3">
            쿠팡 최저가 추적
          </h1>
          <p className="text-white/90 text-[13px] md:text-[15px] mb-5 md:mb-8 px-4">
            가격 변동을 실시간으로 추적하고 최저가일 때 알림받으세요
          </p>

          {/* 검색창 */}
          <form onSubmit={handleSearch} className="w-full max-w-xl mb-4 md:mb-6 px-1">
            <div ref={dropdownRef} className="relative">
              <div
                className={`relative bg-white rounded-xl md:rounded-2xl transition-all duration-200 ${
                  isFocused ? 'shadow-2xl ring-4 ring-white/30' : 'shadow-lg'
                }`}
              >
                <Search
                  size={18}
                  className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-[#8b95a1] md:w-[22px] md:h-[22px]"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => { setIsFocused(true); setShowDropdown(true); }}
                  onBlur={() => setIsFocused(false)}
                  placeholder="찾고 싶은 상품을 검색해보세요"
                  className="w-full pl-11 md:pl-14 pr-20 md:pr-24 py-3.5 md:py-5 text-[15px] md:text-[16px] text-[#191f28] placeholder:text-[#8b95a1] rounded-xl md:rounded-2xl focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 px-4 md:px-5 py-1.5 md:py-2 bg-[#f04452] hover:bg-[#d63d4a] text-white text-[13px] md:text-[14px] font-semibold rounded-lg md:rounded-xl transition-colors"
                >
                  검색
                </button>
              </div>

              {/* 자동완성 드롭다운 */}
              {showDropdown && (suggestions.length > 0 || recentSearches.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#e5e8eb] overflow-hidden z-50">
                  {/* 자동완성 제안 */}
                  {suggestions.length > 0 && (
                    <div className="p-2">
                      <p className="px-3 py-1 text-[12px] text-[#8b95a1]">추천 검색어</p>
                      {suggestions.map((keyword) => (
                        <button
                          key={keyword}
                          type="button"
                          onClick={() => handleKeywordClick(keyword)}
                          className="w-full px-3 py-2 text-left text-[14px] text-[#191f28] hover:bg-[#f2f4f6] rounded-lg flex items-center gap-2"
                        >
                          <Search size={14} className="text-[#8b95a1]" />
                          {keyword}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 최근 검색어 */}
                  {recentSearches.length > 0 && suggestions.length === 0 && (
                    <div className="p-2">
                      <p className="px-3 py-1 text-[12px] text-[#8b95a1]">최근 검색어</p>
                      {recentSearches.map((keyword) => (
                        <button
                          key={keyword}
                          type="button"
                          onClick={() => handleKeywordClick(keyword)}
                          className="w-full px-3 py-2 text-left text-[14px] text-[#191f28] hover:bg-[#f2f4f6] rounded-lg flex items-center justify-between group"
                        >
                          <span className="flex items-center gap-2">
                            <Clock size={14} className="text-[#8b95a1]" />
                            {keyword}
                          </span>
                          <X
                            size={14}
                            className="text-[#adb5bd] hover:text-[#6b7684] opacity-0 group-hover:opacity-100"
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
          <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 mb-4 md:mb-6 px-2">
            <span className="flex items-center gap-1 text-white/70 text-[12px] md:text-[13px]">
              <TrendingUp size={12} className="md:w-[14px] md:h-[14px]" />
              인기:
            </span>
            {TRENDING_KEYWORDS.map((keyword) => (
              <button
                key={keyword}
                onClick={() => handleKeywordClick(keyword)}
                className="px-2.5 md:px-3 py-1 md:py-1.5 bg-white/20 hover:bg-white/30 text-white text-[11px] md:text-[13px] rounded-full transition-colors"
              >
                {keyword}
              </button>
            ))}
          </div>

          {/* 파트너스 고지 */}
          <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mx-2">
            <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/60 rounded-full animate-pulse flex-shrink-0" />
            <p className="text-white/80 text-[10px] md:text-[11px] leading-tight">
              본 서비스는 쿠팡 파트너스 활동의 일환으로 수수료를 제공받으며, 무료로 제공하는 가격 추적 서비스 유지에 사용됩니다
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
