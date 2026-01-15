'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/ui/ProductGrid';
import { ExternalLink, Search, X, Clock, TrendingUp, ArrowLeft } from 'lucide-react';

interface Product {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  isRocket?: boolean;
  isFreeShipping?: boolean;
  categoryName?: string;
}

interface SearchData {
  keyword: string;
  landingUrl: string;
  products: Product[];
}

interface SearchClientProps {
  initialQuery: string;
}

// 최근 검색어 관리
const RECENT_SEARCHES_KEY = 'ddokcheck_recent_searches';
const MAX_RECENT_SEARCHES = 10;

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const searches = getRecentSearches();
    const filtered = searches.filter((s) => s !== query);
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // 저장 실패 무시
  }
}

function removeRecentSearch(query: string) {
  if (typeof window === 'undefined') return;
  try {
    const searches = getRecentSearches();
    const updated = searches.filter((s) => s !== query);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // 삭제 실패 무시
  }
}

// 인기 검색어 (정적 데이터)
const POPULAR_KEYWORDS = [
  '에어팟',
  '닌텐도 스위치',
  '아이폰 케이스',
  '샴푸',
  '마스크',
  '건조기',
  '물티슈',
  '커피',
];

export default function SearchClient({ initialQuery }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const query = searchParams.get('q') || initialQuery;

  const [inputValue, setInputValue] = useState(query);
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(!query);

  // 마운트 시 최근 검색어 로드 및 포커스
  useEffect(() => {
    setRecentSearches(getRecentSearches());
    if (!query && inputRef.current) {
      inputRef.current.focus();
    }
  }, [query]);

  // 검색 실행
  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    saveRecentSearch(searchQuery);
    setRecentSearches(getRecentSearches());
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  }, [router]);

  // 최근 검색어 삭제
  const handleRemoveRecent = (searchQuery: string) => {
    removeRecentSearch(searchQuery);
    setRecentSearches(getRecentSearches());
  };

  // 전체 삭제
  const handleClearAllRecent = () => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  };

  useEffect(() => {
    if (!query.trim()) {
      setSearchData(null);
      setShowSuggestions(true);
      return;
    }

    setInputValue(query);
    setShowSuggestions(false);

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/search?keyword=${encodeURIComponent(query)}&limit=10`
        );
        const data = await res.json();

        if (data.success) {
          setSearchData(data.data);
          // 검색 성공 시 최근 검색어에 저장
          saveRecentSearch(query);
          setRecentSearches(getRecentSearches());
        } else {
          setError(data.error || '검색에 실패했습니다.');
        }
      } catch {
        setError('검색 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#f2f4f6]">
      {/* 상단 고정 검색바 */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#e5e8eb]">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center text-[#4e5968] hover:bg-[#f2f4f6] rounded-full transition-colors"
              aria-label="뒤로가기"
            >
              <ArrowLeft size={22} />
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(inputValue);
              }}
              className="flex-1"
            >
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b95a1]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => !query && setShowSuggestions(true)}
                  placeholder="찾고 싶은 상품을 검색해보세요"
                  className="w-full pl-12 pr-10 py-3 bg-[#f2f4f6] rounded-xl text-[15px] placeholder:text-[#8b95a1] focus:outline-none focus:ring-2 focus:ring-[#3182f6] focus:bg-white transition-all"
                  style={{ fontSize: '16px' }}
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputValue('');
                      inputRef.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-[#8b95a1] rounded-full text-white"
                  >
                    <X size={14} />
                  </button>
                )}
                </div>
            </form>
          </div>
        </div>
      </div>

      {/* 검색 전: 최근 검색어 + 인기 검색어 */}
      {showSuggestions && !loading && (
        <div className="max-w-6xl mx-auto">
          {/* 최근 검색어 */}
          {recentSearches.length > 0 && (
            <div className="bg-white border-b border-[#e5e8eb]">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[14px] font-semibold text-[#191f28]">
                  <Clock size={16} className="text-[#8b95a1]" />
                  최근 검색어
                </div>
                <button
                  onClick={handleClearAllRecent}
                  className="text-[13px] text-[#8b95a1] hover:text-[#4e5968]"
                >
                  전체 삭제
                </button>
              </div>
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {recentSearches.map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#f2f4f6] rounded-full group"
                  >
                    <button
                      onClick={() => handleSearch(keyword)}
                      className="text-[14px] text-[#4e5968]"
                    >
                      {keyword}
                    </button>
                    <button
                      onClick={() => handleRemoveRecent(keyword)}
                      className="w-4 h-4 flex items-center justify-center text-[#8b95a1] hover:text-[#4e5968]"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 인기 검색어 */}
          <div className="bg-white">
            <div className="px-4 py-3 flex items-center gap-2 text-[14px] font-semibold text-[#191f28]">
              <TrendingUp size={16} className="text-[#3182f6]" />
              인기 검색어
            </div>
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_KEYWORDS.map((keyword, index) => (
                  <button
                    key={keyword}
                    onClick={() => handleSearch(keyword)}
                    className="flex items-center gap-3 px-3 py-3 hover:bg-[#f2f4f6] rounded-xl transition-colors text-left"
                  >
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[12px] font-bold ${
                      index < 3 ? 'bg-[#3182f6] text-white' : 'bg-[#f2f4f6] text-[#6b7684]'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-[14px] text-[#191f28]">{keyword}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 검색 결과 영역 */}
      {!showSuggestions && (
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* 검색 결과 헤더 */}
          {query && !loading && searchData && (
            <div className="mb-4">
              <p className="text-[14px] text-[#6b7684]">
                <span className="font-semibold text-[#191f28]">&quot;{query}&quot;</span> 검색 결과 {searchData.products.length}개
              </p>
            </div>
          )}

          {/* 로딩 상태 */}
          {loading && (
            <div className="bg-white rounded-2xl p-16 text-center border border-[#e5e8eb]">
              <div className="spinner-lg mx-auto mb-4" />
              <p className="text-[15px] text-[#6b7684]">검색 중...</p>
            </div>
          )}

          {/* 에러 상태 */}
          {error && !loading && (
            <div className="bg-white rounded-2xl p-16 text-center border border-[#f04452]/20 bg-[#f04452]/5">
              <span className="text-[48px] block mb-4">😢</span>
              <p className="text-[15px] text-[#f04452]">{error}</p>
              <p className="text-[13px] text-[#8b95a1] mt-2">잠시 후 다시 시도해주세요</p>
            </div>
          )}

          {/* 검색 결과 */}
          {searchData && !loading && (
          <>
            {searchData.products.length > 0 ? (
              <ProductGrid products={searchData.products} />
            ) : (
              <div className="toss-card-flat p-16 text-center border border-[#e5e8eb]">
                <span className="text-[64px] block mb-4">😕</span>
                <p className="toss-body-1 text-[#6b7684]">
                  &quot;{query}&quot;에 대한 검색 결과가 없습니다
                </p>
                <p className="toss-caption mt-2">다른 검색어로 시도해보세요</p>
              </div>
            )}

            {/* 쿠팡에서 더 보기 */}
            {searchData.landingUrl && searchData.products.length > 0 && (
              <div className="mt-8 text-center">
                <a
                  href={searchData.landingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#3182f6] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#1b64da] transition-colors"
                >
                  🛒 쿠팡에서 더 많은 상품 보기
                  <ExternalLink size={16} />
                </a>
              </div>
            )}
          </>
        )}
        </div>
      )}

      {/* 파트너스 고지 */}
      <div className="py-8 pb-24 text-center px-4">
        <p className="text-[11px] text-[#6b7684] leading-relaxed">
          본 서비스는 쿠팡 파트너스 활동의 일환으로,<br />
          이에 따른 일정액의 수수료를 제공받습니다.
        </p>
      </div>
    </div>
  );
}
