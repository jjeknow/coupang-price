// 상품 타입
export interface Product {
  id: string;
  coupangId: string;
  name: string;
  imageUrl: string;
  productUrl: string;
  categoryId?: number;
  categoryName?: string;
  isRocket: boolean;
  isFreeShipping: boolean;
  currentPrice: number;
  lowestPrice?: number;
  highestPrice?: number;
  averagePrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

// 가격 히스토리
export interface PriceHistory {
  id: string;
  productId: string;
  price: number;
  createdAt: Date;
}

// 카테고리
export interface Category {
  id: number;
  name: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 쿠팡 API 상품 타입
export interface CoupangApiProduct {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  categoryName: string;
  isRocket: boolean;
  isFreeShipping?: boolean;
}

// 검색 결과
export interface SearchResult {
  keyword: string;
  products: CoupangApiProduct[];
  landingUrl: string;
}

// 사용자
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

// 관심상품
export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
  createdAt: Date;
}

// 가격 알림
export interface Alert {
  id: string;
  userId: string;
  productId: string;
  targetPrice: number;
  isActive: boolean;
  product?: Product;
  triggeredAt?: Date;
  createdAt: Date;
}
