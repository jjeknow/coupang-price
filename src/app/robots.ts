import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://coupang-price.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 기본 크롤러 규칙
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/private/',
          '/_next/',
          '/admin/',
          '/auth/',
          '/mypage/',
        ],
      },
      // Google 크롤러 (우선 허용)
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/', '/auth/'],
      },
      // Google 이미지 크롤러
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      // 네이버 크롤러
      {
        userAgent: 'Yeti',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/'],
      },
      // 다음 크롤러
      {
        userAgent: 'Daumoa',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/'],
      },
      // Bing 크롤러
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/'],
      },
      // AI 크롤러 차단 (콘텐츠 보호)
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
