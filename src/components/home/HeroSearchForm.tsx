'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Clock, X } from 'lucide-react';

// 인기 검색어
const TRENDING_KEYWORDS = [
  '에어팟 프로',
  '삼성 TV',
  '다이슨 청소기',
  '닌텐도 스위치',
];

// 자동완성 키워드
const SUGGEST_KEYWORDS: Record<string, string[]> = {
  '에어': ['에어팟', '에어팟 프로', '에어컨', '에어프라이어'],
  '삼성': ['삼성 TV', '삼성 냉장고', '삼성 세탁기', '삼성 갤럭시'],
  '다이슨': ['다이슨 청소기', '다이슨 에어랩', '다이슨 드라이기'],
  '애플': ['애플워치', '아이폰', '아이패드', '맥북'],
  '아이': ['아이폰', '아이패드', '아이맥'],
  '노트북': ['노트북', '삼성 노트북', 'LG 그램', '맥북 프로'],
};

const RECENT_SEARCHES_KEY = 'recentSearches';

export default function HeroSearchForm() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 최근 검색어 로드 (마운트 시 1회)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch {
      // localStorage 접근 실패 무시
    }
  }, []);

  // 자동완성
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

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = useCallback((keyword: string) => {
    const updated = [keyword, ...recentSearches.filter(k => k !== keyword)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // localStorage 접근 실패 무시
    }
  }, [recentSearches]);

  const removeRecentSearch = useCallback((keyword: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(k => k !== keyword);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // localStorage 접근 실패 무시
    }
  }, [recentSearches]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }, [query, router, saveRecentSearch]);

  const handleKeywordClick = useCallback((keyword: string) => {
    saveRecentSearch(keyword);
    setShowDropdown(false);
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  }, [router, saveRecentSearch]);

  return (
    <>
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
        {TRENDING_KEYWORDS.map((keyword) => (
          <button
            key={keyword}
            onClick={() => handleKeywordClick(keyword)}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[#94a3b8] hover:text-white text-[11px] rounded-full transition-all duration-200"
          >
            #{keyword}
          </button>
        ))}
      </div>
    </>
  );
}
