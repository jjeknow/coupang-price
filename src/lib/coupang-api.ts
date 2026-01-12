/**
 * 쿠팡 파트너스 API 클라이언트
 *
 * HMAC 인증 및 API 호출을 처리합니다.
 * Rate Limit:
 * - 모든 API: 1분당 100회
 * - 검색 API: 1분당 50회
 */

import crypto from 'crypto';
import { checkRateLimit, getRateLimitStatus } from './rate-limiter';
import { getFromCache, setCache, createCacheKey, CACHE_TTL } from './cache';

// API 설정
const API_BASE_URL = 'https://api-gateway.coupang.com';
const ACCESS_KEY = process.env.COUPANG_ACCESS_KEY || '';
const SECRET_KEY = process.env.COUPANG_SECRET_KEY || '';

// 카테고리 매핑
export const CATEGORIES: Record<number, string> = {
  1001: '여성패션',
  1002: '남성패션',
  1010: '뷰티',
  1011: '출산/유아동',
  1012: '식품',
  1013: '주방용품',
  1014: '생활용품',
  1015: '홈인테리어',
  1016: '가전디지털',
  1017: '스포츠/레저',
  1018: '자동차용품',
  1019: '도서/음반/DVD',
  1020: '완구/취미',
  1021: '문구/오피스',
  1024: '헬스/건강식품',
  1025: '국내여행',
  1026: '해외여행',
  1029: '반려동물용품',
  1030: '유아동패션',
};

// 상품 타입 정의
export interface CoupangProduct {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  categoryName: string;
  isRocket: boolean;
  isFreeShipping?: boolean;
  keyword?: string;
  rank?: number;
}

export interface SearchResult {
  landingUrl: string;
  productData: CoupangProduct[];
}

/**
 * HMAC 서명 생성 (쿠팡 API 문서 기준)
 * 포맷: yyMMdd'T'HHmmss'Z' + METHOD + PATH
 * PHP 예시: $message = $datetime.$method.str_replace("?", "", $path);
 */
function generateHmacSignature(
  method: string,
  path: string,
  datetime: string
): string {
  // PHP 코드: str_replace("?", "", $path) - ?만 제거하고 쿼리 파라미터는 유지
  const pathWithoutQuestion = path.replace('?', '');
  const message = datetime + method + pathWithoutQuestion;

  return crypto
    .createHmac('sha256', SECRET_KEY)
    .update(message)
    .digest('hex');
}

/**
 * Authorization 헤더 생성
 * 쿠팡 API 포맷: yyMMdd'T'HHmmss'Z' (GMT+0 기준)
 */
function generateAuthHeader(method: string, path: string): string {
  // GMT+0 기준 datetime 생성
  const now = new Date();
  const year = now.getUTCFullYear().toString().slice(2); // yy
  const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = now.getUTCDate().toString().padStart(2, '0');
  const hours = now.getUTCHours().toString().padStart(2, '0');
  const minutes = now.getUTCMinutes().toString().padStart(2, '0');
  const seconds = now.getUTCSeconds().toString().padStart(2, '0');

  const datetime = `${year}${month}${day}T${hours}${minutes}${seconds}Z`;

  const signature = generateHmacSignature(method, path, datetime);

  return `CEA algorithm=HmacSHA256, access-key=${ACCESS_KEY}, signed-date=${datetime}, signature=${signature}`;
}

// API 호출 함수 (Rate Limit 적용)
async function callApi<T>(
  method: 'GET' | 'POST',
  path: string,
  body?: object,
  rateLimitType: 'global' | 'search' | 'reports' = 'global'
): Promise<T> {
  // API 키가 없으면 에러
  if (!ACCESS_KEY || !SECRET_KEY) {
    console.error('Coupang API keys not configured');
    throw new Error('API 키가 설정되지 않았습니다.');
  }

  // Rate Limit 체크 (글로벌)
  const globalCheck = checkRateLimit('global');
  if (!globalCheck.allowed) {
    console.warn(`[Rate Limit] Global limit exceeded. Retry after ${globalCheck.retryAfter}s`);
    throw new Error(`API 호출 한도 초과. ${globalCheck.retryAfter}초 후 다시 시도해주세요.`);
  }

  // Rate Limit 체크 (타입별)
  if (rateLimitType !== 'global') {
    const typeCheck = checkRateLimit(rateLimitType);
    if (!typeCheck.allowed) {
      console.warn(`[Rate Limit] ${rateLimitType} limit exceeded. Retry after ${typeCheck.retryAfter}s`);
      throw new Error(`${rateLimitType} API 호출 한도 초과. ${typeCheck.retryAfter}초 후 다시 시도해주세요.`);
    }
  }

  // 현재 Rate Limit 상태 로깅
  const status = getRateLimitStatus('global');
  console.log(`[API Call] ${path} - Remaining: ${status.remaining}/${status.limit}`);

  const authorization = generateAuthHeader(method, path);
  const url = API_BASE_URL + path;

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': authorization,
    },
    // 빌드 시 캐시 방지
    cache: 'no-store',
  };

  if (body && method === 'POST') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Coupang API Error:', response.status, errorText);
    throw new Error(`API 호출 실패: ${response.status}`);
  }

  const data = await response.json();

  // 빈 객체 체크 (API 키 문제 또는 서버 오류)
  if (!data || Object.keys(data).length === 0) {
    console.error('Coupang API Empty Response - API 키를 확인하세요');
    console.error('ACCESS_KEY exists:', !!ACCESS_KEY);
    console.error('SECRET_KEY exists:', !!SECRET_KEY);
    throw new Error('API 응답이 비어있습니다. API 키 설정을 확인하세요.');
  }

  if (data.rCode !== '0' && data.rCode !== 0) {
    console.error('Coupang API Business Error:', JSON.stringify(data));
    throw new Error(data.rMessage || `API 비즈니스 오류 (rCode: ${data.rCode})`);
  }

  return data;
}

// ========== 공개 API 함수들 ==========

/**
 * 카테고리별 베스트 상품 조회 (캐시 적용)
 * 쿠팡 베스트 API limit 제한: 1~100 (최대 100개)
 */
export async function getBestProducts(
  categoryId: number,
  limit: number = 20,
  imageSize: string = '340x340'
): Promise<CoupangProduct[]> {
  // 쿠팡 베스트 API limit 제한 (1~100)
  const safeLimit = Math.min(Math.max(limit, 1), 100);

  // 캐시 체크
  const cacheKey = createCacheKey('best', categoryId, safeLimit);
  const cached = getFromCache<CoupangProduct[]>(cacheKey);
  if (cached) {
    console.log(`[CACHE HIT] ${cacheKey}`);
    return cached;
  }

  console.log(`[CACHE MISS] ${cacheKey} - API 호출`);
  const path = `/v2/providers/affiliate_open_api/apis/openapi/v1/products/bestcategories/${categoryId}?limit=${safeLimit}&imageSize=${imageSize}`;

  const response = await callApi<{ data: CoupangProduct[] }>('GET', path);
  const products = response.data || [];

  // 캐시 저장 (24시간)
  setCache(cacheKey, products, CACHE_TTL.BEST_PRODUCTS);
  return products;
}

/**
 * 골드박스 상품 조회 (캐시 적용 - 매일 오전 7:30 업데이트)
 */
export async function getGoldboxProducts(
  imageSize: string = '340x340'
): Promise<CoupangProduct[]> {
  // 캐시 체크
  const cacheKey = 'goldbox';
  const cached = getFromCache<CoupangProduct[]>(cacheKey);
  if (cached) {
    console.log(`[CACHE HIT] ${cacheKey}`);
    return cached;
  }

  console.log(`[CACHE MISS] ${cacheKey} - API 호출`);
  const path = `/v2/providers/affiliate_open_api/apis/openapi/v1/products/goldbox?imageSize=${imageSize}`;

  const response = await callApi<{ data: CoupangProduct[] }>('GET', path);
  const products = response.data || [];

  // 캐시 저장 (24시간)
  setCache(cacheKey, products, CACHE_TTL.GOLDBOX);
  return products;
}

/**
 * 상품 검색 (캐시 적용 - 검색 API는 별도 Rate Limit 적용)
 * 쿠팡 검색 API limit 제한: 1~10 (최대 10개)
 */
export async function searchProducts(
  keyword: string,
  limit: number = 10,
  imageSize: string = '340x340'
): Promise<SearchResult> {
  // 쿠팡 검색 API limit 제한 (1~10)
  const safeLimit = Math.min(Math.max(limit, 1), 10);

  // 캐시 체크
  const cacheKey = createCacheKey('search', keyword, safeLimit);
  const cached = getFromCache<SearchResult>(cacheKey);
  if (cached) {
    console.log(`[CACHE HIT] ${cacheKey}`);
    return cached;
  }

  console.log(`[CACHE MISS] ${cacheKey} - API 호출`);
  const encodedKeyword = encodeURIComponent(keyword);
  const path = `/v2/providers/affiliate_open_api/apis/openapi/v1/products/search?keyword=${encodedKeyword}&limit=${safeLimit}&imageSize=${imageSize}`;

  // 검색 API는 별도 Rate Limit (분당 15회)
  const response = await callApi<{ data: SearchResult }>('GET', path, undefined, 'search');
  const result = response.data;

  // 캐시 저장 (24시간)
  setCache(cacheKey, result, CACHE_TTL.SEARCH);
  return result;
}

/**
 * 쿠팡 PL 상품 조회
 */
export async function getCoupangPLProducts(
  limit: number = 20,
  imageSize: string = '340x340'
): Promise<CoupangProduct[]> {
  const path = `/v2/providers/affiliate_open_api/apis/openapi/v1/products/coupangPL?limit=${limit}&imageSize=${imageSize}`;

  const response = await callApi<{ data: CoupangProduct[] }>('GET', path);
  return response.data || [];
}

/**
 * 딥링크 생성 (일반 쿠팡 URL을 어필리에이트 링크로 변환)
 */
export async function createDeeplink(
  coupangUrls: string[]
): Promise<{ originalUrl: string; shortenUrl: string; landingUrl: string }[]> {
  const path = '/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink';

  const response = await callApi<{
    data: { originalUrl: string; shortenUrl: string; landingUrl: string }[];
  }>('POST', path, { coupangUrls });

  return response.data || [];
}

/**
 * 개인화 추천 상품 조회 (Reco API v2)
 */
export async function getRecommendedProducts(
  options: {
    siteId?: string;
    siteDomain?: string;
    deviceId?: string;
    imageSize?: string;
    puid?: string;
  } = {}
): Promise<CoupangProduct[]> {
  const path = '/v2/providers/affiliate_open_api/apis/openapi/v2/products/reco';

  const body = {
    site: {
      id: options.siteId || 'coupang-price',
      domain: options.siteDomain || 'localhost',
    },
    device: {
      id: options.deviceId || 'anonymous',
      lmt: 0,
    },
    imp: {
      imageSize: options.imageSize || '340x340',
    },
    user: {
      puid: options.puid || 'guest',
    },
  };

  const response = await callApi<{ data: CoupangProduct[] }>('POST', path, body);
  return response.data || [];
}

// 모든 카테고리 정보 반환
export function getAllCategories() {
  return Object.entries(CATEGORIES).map(([id, name]) => ({
    id: parseInt(id),
    name,
  }));
}
