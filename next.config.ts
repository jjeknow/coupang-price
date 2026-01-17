import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 외부 이미지 도메인 허용 (쿠팡 CDN)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.coupangcdn.com',
      },
      {
        protocol: 'http',
        hostname: '*.coupangcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'ads-partners.coupang.com',
      },
      {
        protocol: 'https',
        hostname: 'image.coupangcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'thumbnail*.coupangcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'static.coupangcdn.com',
      },
    ],
    // 이미지 최적화 설정
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7일
  },

  // 성능 최적화
  compress: true,
  poweredByHeader: false,

  // 보안 헤더
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // 정적 자산 캐시
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // 이미지 캐시
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 리다이렉트
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // 실험적 기능
  experimental: {
    // 최적화된 패키지 임포트
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
    // CSS 최적화 (Critical CSS 인라인 + 미사용 CSS 제거)
    optimizeCss: true,
  },

  // SWC 컴파일러 설정
  compiler: {
    // production에서 console.log 제거
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 모던 브라우저만 타겟팅 (폴리필 제거로 14KB 절감)
  // .browserslistrc 파일에서 ES2020+ 브라우저 설정
  // Chrome 80+, Safari 14+, Firefox 74+, Edge 80+
  transpilePackages: [],

  // 빌드 최적화
  reactStrictMode: true,

  // 로깅 설정
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
