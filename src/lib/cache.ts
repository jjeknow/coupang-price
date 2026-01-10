/**
 * API 응답 캐싱 시스템
 *
 * 쿠팡 API 노출 특성에 따른 캐시 만료 시간:
 * - 데스크탑/모바일 웹: 5분
 * - 골드박스: 30분 (매일 7:30 업데이트)
 * - 베스트 상품: 10분
 * - 검색 결과: 5분
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
}

// 메모리 캐시 저장소
const cacheStore: Map<string, CacheEntry<unknown>> = new Map();

// 캐시 만료 시간 설정 (밀리초)
export const CACHE_TTL = {
  GOLDBOX: 30 * 60 * 1000, // 30분
  BEST_PRODUCTS: 10 * 60 * 1000, // 10분
  SEARCH: 5 * 60 * 1000, // 5분
  CATEGORIES: 60 * 60 * 1000, // 1시간
  DEFAULT: 5 * 60 * 1000, // 5분
};

/**
 * 캐시에서 데이터 가져오기
 */
export function getFromCache<T>(key: string): T | null {
  const entry = cacheStore.get(key) as CacheEntry<T> | undefined;

  if (!entry) {
    return null;
  }

  // 만료 체크
  if (Date.now() > entry.expiresAt) {
    cacheStore.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * 캐시에 데이터 저장
 */
export function setCache<T>(key: string, data: T, ttl: number = CACHE_TTL.DEFAULT): void {
  const now = Date.now();
  cacheStore.set(key, {
    data,
    expiresAt: now + ttl,
    createdAt: now,
  });
}

/**
 * 캐시 키 생성 헬퍼
 */
export function createCacheKey(prefix: string, ...args: (string | number)[]): string {
  return `${prefix}:${args.join(':')}`;
}

/**
 * 캐시 또는 API 호출 래퍼
 */
export async function getOrFetch<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttl: number = CACHE_TTL.DEFAULT
): Promise<T> {
  // 캐시 확인
  const cached = getFromCache<T>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // API 호출
  const data = await fetchFn();

  // 캐시 저장
  setCache(cacheKey, data, ttl);

  return data;
}

/**
 * 특정 패턴의 캐시 삭제
 */
export function invalidateCache(pattern: string): void {
  for (const key of cacheStore.keys()) {
    if (key.startsWith(pattern)) {
      cacheStore.delete(key);
    }
  }
}

/**
 * 전체 캐시 통계
 */
export function getCacheStats() {
  const now = Date.now();
  let validCount = 0;
  let expiredCount = 0;

  for (const [, entry] of cacheStore) {
    if (now > entry.expiresAt) {
      expiredCount++;
    } else {
      validCount++;
    }
  }

  return {
    total: cacheStore.size,
    valid: validCount,
    expired: expiredCount,
  };
}
