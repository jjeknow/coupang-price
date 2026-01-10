'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, Sparkles } from 'lucide-react';

// 인기 검색어 (트렌드)
const TRENDING_KEYWORDS = [
  '에어팟 프로',
  '삼성 TV',
  '다이슨 청소기',
  '닌텐도 스위치',
  '아이패드',
  '맥북',
];

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <section className="bg-gradient-to-br from-[#f04452] to-[#ff6b6b] text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="flex flex-col items-center text-center">
          {/* 타이틀 */}
          <p className="text-white/80 text-[14px] mb-2 flex items-center gap-1">
            <Sparkles size={14} />
            2026 Happy New Year
          </p>
          <h1 className="text-[28px] md:text-[36px] font-bold leading-tight mb-3">
            쿠팡 최저가 추적
          </h1>
          <p className="text-white/90 text-[15px] mb-8">
            가격 변동을 실시간으로 추적하고 최저가일 때 알림받으세요
          </p>

          {/* 검색창 */}
          <form onSubmit={handleSearch} className="w-full max-w-xl mb-6">
            <div
              className={`relative bg-white rounded-2xl transition-all duration-200 ${
                isFocused ? 'shadow-2xl ring-4 ring-white/30' : 'shadow-lg'
              }`}
            >
              <Search
                size={22}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8b95a1]"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="찾고 싶은 상품을 검색해보세요"
                className="w-full pl-14 pr-24 py-4 md:py-5 text-[16px] text-[#191f28] placeholder:text-[#8b95a1] rounded-2xl focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#f04452] hover:bg-[#d63d4a] text-white text-[14px] font-semibold rounded-xl transition-colors"
              >
                검색
              </button>
            </div>
          </form>

          {/* 인기 검색어 */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="flex items-center gap-1 text-white/70 text-[13px]">
              <TrendingUp size={14} />
              인기:
            </span>
            {TRENDING_KEYWORDS.map((keyword) => (
              <button
                key={keyword}
                onClick={() => handleKeywordClick(keyword)}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-[13px] rounded-full transition-colors"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
