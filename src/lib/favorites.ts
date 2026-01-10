/**
 * 관심상품 localStorage 관리
 */

export interface FavoriteProduct {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  isRocket?: boolean;
  isFreeShipping?: boolean;
  categoryName?: string;
  addedAt: number; // timestamp
}

const FAVORITES_KEY = 'favoriteProducts';
const MAX_FAVORITES = 50;

// 관심상품 목록 가져오기
export function getFavorites(): FavoriteProduct[] {
  if (typeof window === 'undefined') return [];

  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('관심상품 로드 실패:', e);
  }
  return [];
}

// 관심상품 추가
export function addFavorite(product: Omit<FavoriteProduct, 'addedAt'>): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const favorites = getFavorites();

    // 이미 있으면 추가하지 않음
    if (favorites.some(f => f.productId === product.productId)) {
      return false;
    }

    // 최대 개수 제한
    const updated = [
      { ...product, addedAt: Date.now() },
      ...favorites,
    ].slice(0, MAX_FAVORITES);

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));

    // storage 이벤트 발생 (다른 탭/컴포넌트에서 감지 가능)
    window.dispatchEvent(new CustomEvent('favorites-changed'));

    return true;
  } catch (e) {
    console.error('관심상품 추가 실패:', e);
    return false;
  }
}

// 관심상품 제거
export function removeFavorite(productId: number): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const favorites = getFavorites();
    const updated = favorites.filter(f => f.productId !== productId);

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));

    // storage 이벤트 발생
    window.dispatchEvent(new CustomEvent('favorites-changed'));

    return true;
  } catch (e) {
    console.error('관심상품 제거 실패:', e);
    return false;
  }
}

// 관심상품 여부 확인
export function isFavorite(productId: number): boolean {
  const favorites = getFavorites();
  return favorites.some(f => f.productId === productId);
}

// 관심상품 토글
export function toggleFavorite(product: Omit<FavoriteProduct, 'addedAt'>): boolean {
  if (isFavorite(product.productId)) {
    removeFavorite(product.productId);
    return false;
  } else {
    addFavorite(product);
    return true;
  }
}
