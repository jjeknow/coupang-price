// Service Worker for PWA - 최저가 알림 서비스
const CACHE_NAME = 'choejaga-v1';
const STATIC_CACHE = 'choejaga-static-v1';
const DYNAMIC_CACHE = 'choejaga-dynamic-v1';

// 정적 자원 - 앱 셸
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.svg',
];

// 캐시 우선 전략이 적용될 패턴
const CACHE_FIRST_PATTERNS = [
  /\/_next\/static\//,
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
  /\.(?:woff|woff2|ttf|otf)$/,
];

// 네트워크 우선 전략이 적용될 패턴
const NETWORK_FIRST_PATTERNS = [
  /\/api\//,
  /\/_next\/data\//,
];

// 설치 이벤트 - 정적 자원 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// 활성화 이벤트 - 오래된 캐시 삭제
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 페치 이벤트 - 캐싱 전략 적용
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 같은 오리진의 요청만 처리
  if (url.origin !== location.origin) {
    return;
  }

  // API 요청 - 네트워크 우선
  if (NETWORK_FIRST_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // 정적 자원 - 캐시 우선
  if (CACHE_FIRST_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 페이지 요청 - Stale While Revalidate
  if (request.mode === 'navigate') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // 기본 - 네트워크 우선
  event.respondWith(networkFirst(request));
});

// 캐시 우선 전략
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('오프라인 상태입니다.', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

// 네트워크 우선 전략
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response(JSON.stringify({ error: '오프라인 상태입니다.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Stale While Revalidate 전략
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then((c) => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => {
    // 오프라인 페이지로 폴백
    return caches.match('/offline');
  });

  return cachedResponse || fetchPromise;
}

// 푸시 알림 이벤트
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();

  // 알림 옵션 구성
  const options = {
    body: data.body || '새로운 알림이 있습니다.',
    icon: data.icon || '/icon-192.png',
    badge: '/badge-72.png',
    image: data.image, // 큰 이미지 (상품 이미지)
    vibrate: [200, 100, 200],
    tag: data.tag || 'price-alert', // 같은 태그는 덮어쓰기
    renotify: true, // 같은 태그여도 다시 알림
    requireInteraction: data.requireInteraction || false, // 사용자가 닫을 때까지 유지
    silent: false,
    timestamp: Date.now(),
    data: {
      url: data.url || '/',
      productId: data.productId,
      type: data.type || 'general',
    },
    actions: [
      {
        action: 'view',
        title: '상품 보기',
        icon: '/icon-view.png',
      },
      {
        action: 'dismiss',
        title: '닫기',
        icon: '/icon-close.png',
      },
    ],
  };

  // 이미지가 없으면 image 속성 제거
  if (!options.image) {
    delete options.image;
  }

  event.waitUntil(
    self.registration.showNotification(data.title || '최저가 알림', options)
  );
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // 닫기 액션인 경우
  if (event.action === 'dismiss') {
    return;
  }

  const notificationData = event.notification.data || {};
  const url = notificationData.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 이미 열린 창이 있으면 해당 URL로 이동 후 포커스
      for (const client of clientList) {
        if ('focus' in client && 'navigate' in client) {
          return client.navigate(url).then(() => client.focus());
        }
      }
      // 없으면 새 창 열기
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// 알림 닫기 이벤트 (통계용)
self.addEventListener('notificationclose', (event) => {
  const notificationData = event.notification.data || {};
  // 알림 닫힘 이벤트 기록 (분석용)
  console.log('알림 닫힘:', notificationData.type, notificationData.productId);
});

// 백그라운드 동기화
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

async function syncFavorites() {
  // 오프라인에서 추가된 관심상품 동기화
  // 실제 구현은 IndexedDB와 연동 필요
  console.log('관심상품 동기화 중...');
}
