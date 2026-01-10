/**
 * Rate Limiter - 쿠팡 파트너스 API 호출 제한 관리
 *
 * 쿠팡 공식 제한:
 * - 모든 API: 1분당 100회
 * - 검색 API: 1분당 50회
 * - 리포트 API: 1시간당 500회
 *
 * 안전 마진 적용 (70%):
 * - 모든 API: 1분당 70회
 * - 검색 API: 1분당 35회
 */

// 메모리 기반 Rate Limit 저장소
const rateLimitStore: Map<string, { count: number; resetAt: number }> = new Map();

// Rate Limit 설정
const RATE_LIMITS = {
  global: { limit: 70, windowMs: 60 * 1000 }, // 1분당 70회
  search: { limit: 35, windowMs: 60 * 1000 }, // 1분당 35회
  reports: { limit: 350, windowMs: 60 * 60 * 1000 }, // 1시간당 350회
};

/**
 * Rate Limit 체크 및 증가
 * @param type - 'global' | 'search' | 'reports'
 * @returns { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(type: 'global' | 'search' | 'reports' = 'global') {
  const config = RATE_LIMITS[type];
  const key = `rate_limit_${type}`;
  const now = Date.now();

  let record = rateLimitStore.get(key);

  // 윈도우가 만료되었거나 레코드가 없으면 초기화
  if (!record || now > record.resetAt) {
    record = {
      count: 0,
      resetAt: now + config.windowMs,
    };
  }

  // 제한 초과 체크
  if (record.count >= config.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
      retryAfter: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  // 카운트 증가
  record.count++;
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    remaining: config.limit - record.count,
    resetAt: record.resetAt,
    retryAfter: 0,
  };
}

/**
 * Rate Limit 상태 조회 (증가 없이)
 */
export function getRateLimitStatus(type: 'global' | 'search' | 'reports' = 'global') {
  const config = RATE_LIMITS[type];
  const key = `rate_limit_${type}`;
  const now = Date.now();

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    return {
      count: 0,
      limit: config.limit,
      remaining: config.limit,
      resetAt: now + config.windowMs,
    };
  }

  return {
    count: record.count,
    limit: config.limit,
    remaining: Math.max(0, config.limit - record.count),
    resetAt: record.resetAt,
  };
}

/**
 * API 호출 전 Rate Limit 체크 래퍼
 */
export async function withRateLimit<T>(
  type: 'global' | 'search' | 'reports',
  fn: () => Promise<T>
): Promise<T> {
  // 글로벌 체크
  const globalCheck = checkRateLimit('global');
  if (!globalCheck.allowed) {
    throw new Error(`API 호출 한도 초과. ${globalCheck.retryAfter}초 후 다시 시도해주세요.`);
  }

  // 타입별 체크 (global이 아닌 경우)
  if (type !== 'global') {
    const typeCheck = checkRateLimit(type);
    if (!typeCheck.allowed) {
      throw new Error(`${type} API 호출 한도 초과. ${typeCheck.retryAfter}초 후 다시 시도해주세요.`);
    }
  }

  return fn();
}
