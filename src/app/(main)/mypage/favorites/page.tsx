'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2, ArrowLeft, Bell, ExternalLink } from 'lucide-react';
import CoupangLink from '@/components/ui/CoupangLink';

interface Favorite {
  id: string;
  coupangProductId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  categoryName?: string;
  isRocket: boolean;
  isFreeShipping: boolean;
  createdAt: string;
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/mypage/favorites');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchFavorites();
    }
  }, [session]);

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/user/favorites');
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error('관심상품 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (coupangProductId: string) => {
    if (!confirm('관심상품에서 삭제하시겠습니까?')) return;

    setDeleting(coupangProductId);
    try {
      const res = await fetch(`/api/user/favorites?productId=${coupangProductId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setFavorites(favorites.filter(f => f.coupangProductId !== coupangProductId));
      }
    } catch (error) {
      console.error('삭제 실패:', error);
    } finally {
      setDeleting(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3182f6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 hover:bg-[#f2f4f6] rounded-lg">
          <ArrowLeft size={24} className="text-[#191f28]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#191f28]">관심상품</h1>
          <p className="text-[#5c6470] text-sm">{favorites.length}개의 상품</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-[#f2f4f6] rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={40} className="text-[#adb5bd]" />
          </div>
          <p className="text-[#5c6470] mb-4">관심상품이 없습니다</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3182f6] text-white rounded-xl font-medium hover:bg-[#1b64da]"
          >
            상품 둘러보기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#e5e8eb] p-4 flex gap-4"
            >
              {/* 이미지 */}
              <Link
                href={`/product/p-${item.coupangProductId}`}
                className="relative w-20 h-20 bg-[#f8f9fa] rounded-xl overflow-hidden flex-shrink-0"
              >
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </Link>

              {/* 정보 */}
              <div className="flex-1 min-w-0">
                <Link href={`/product/p-${item.coupangProductId}`}>
                  <p className="text-[14px] text-[#191f28] line-clamp-2 hover:text-[#1d4ed8]">
                    {item.productName}
                  </p>
                </Link>

                <p className="text-[16px] font-bold text-[#c92a2a] mt-2">
                  {item.productPrice.toLocaleString()}원
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.isRocket && (
                    <span className="px-2 py-0.5 bg-[#f8f9fa] text-[#1d4ed8] text-[11px] font-medium rounded">
                      로켓배송
                    </span>
                  )}
                  {item.isFreeShipping && !item.isRocket && (
                    <span className="px-2 py-0.5 bg-[#f8f9fa] text-[#1d4ed8] text-[11px] font-medium rounded">
                      무료배송
                    </span>
                  )}
                  {item.categoryName && (
                    <span className="px-2 py-0.5 bg-[#f2f4f6] text-[#5c6470] text-[11px] rounded">
                      {item.categoryName}
                    </span>
                  )}
                </div>

                {/* 버튼들 */}
                <div className="flex items-center gap-2 mt-3">
                  <Link
                    href={`/product/p-${item.coupangProductId}`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#3182f6] text-white text-[13px] rounded-lg hover:bg-[#1b64da]"
                  >
                    <Bell size={14} />
                    알림 설정
                  </Link>
                  <CoupangLink
                    productId={item.coupangProductId}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#f2f4f6] text-[#4e5968] text-[13px] rounded-lg hover:bg-[#e5e8eb]"
                  >
                    <ExternalLink size={14} />
                    쿠팡
                  </CoupangLink>
                  <button
                    onClick={() => handleDelete(item.coupangProductId)}
                    disabled={deleting === item.coupangProductId}
                    className="flex items-center gap-1 px-3 py-1.5 text-[#c92a2a] text-[13px] rounded-lg hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
