/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://coupang-price.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,

  // 변경 빈도 및 우선순위
  changefreq: 'daily',
  priority: 0.7,

  // 제외할 경로
  exclude: [
    '/api/*',
    '/admin/*',
    '/login',
    '/register',
    '/mypage/*',
  ],

  // robots.txt 옵션
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/mypage/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Yeti', // 네이버
        allow: '/',
      },
      {
        userAgent: 'Daumoa', // 다음
        allow: '/',
      },
    ],
    additionalSitemaps: [],
  },

  // 추가 경로 (동적 생성)
  additionalPaths: async (config) => {
    const result = [];

    // 카테고리 페이지들
    const categories = [
      1001, 1002, 1010, 1011, 1012, 1013, 1014, 1015,
      1016, 1017, 1018, 1019, 1020, 1021, 1024, 1029,
    ];

    for (const categoryId of categories) {
      result.push({
        loc: `/category/${categoryId}`,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      });
    }

    return result;
  },
};
