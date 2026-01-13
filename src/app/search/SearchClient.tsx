'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/ui/ProductGrid';
import { ExternalLink } from 'lucide-react';

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

export default function SearchClient({ initialQuery }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || initialQuery;

  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSearchData(null);
      return;
    }

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
      {/* 검색 결과 헤더 */}
      <div className="bg-white border-b border-[#e5e8eb]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {query ? (
            <div className="flex items-center gap-3">
              <span className="text-[40px]">🔍</span>
              <div>
                <h1 className="toss-title-1">
                  &quot;{query}&quot; 검색 결과
                </h1>
                {searchData && (
                  <p className="toss-body-2 text-[#6b7684] mt-1">
                    {searchData.products.length}개의 상품을 찾았습니다
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-[40px]">🔍</span>
              <h1 className="toss-title-1">상품 검색</h1>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 로딩 상태 */}
        {loading && (
          <div className="toss-card-flat p-16 text-center border border-[#e5e8eb]">
            <div className="spinner-lg mx-auto mb-4" />
            <p className="toss-body-1 text-[#6b7684]">검색 중...</p>
          </div>
        )}

        {/* 에러 상태 */}
        {error && !loading && (
          <div className="toss-card-flat p-16 text-center border border-[#f04452]/20 bg-[#f04452]/5">
            <span className="text-[48px] block mb-4">😢</span>
            <p className="toss-body-1 text-[#f04452]">{error}</p>
            <p className="toss-caption mt-2">잠시 후 다시 시도해주세요</p>
          </div>
        )}

        {/* 검색어 없음 */}
        {!query && !loading && (
          <div className="toss-card-flat p-16 text-center border border-[#e5e8eb]">
            <span className="text-[64px] block mb-4">🔍</span>
            <p className="toss-body-1 text-[#6b7684]">검색어를 입력해주세요</p>
            <p className="toss-caption mt-2">상품명, 브랜드를 검색해보세요</p>
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

      {/* 파트너스 고지 */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="toss-card-flat p-6 text-center border border-[#e5e8eb]">
          <p className="toss-caption text-[#6b7684]">
            본 서비스는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
            수수료를 제공받습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
