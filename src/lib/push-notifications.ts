import webpush from 'web-push';

// VAPID 키 설정
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;

webpush.setVapidDetails(
  'mailto:support@ddokcheck.com',
  vapidPublicKey,
  vapidPrivateKey
);

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  badge?: string;
  url?: string;
  tag?: string;
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// 푸시 알림 발송
export async function sendPushNotification(
  subscription: PushSubscriptionData,
  payload: PushPayload
): Promise<boolean> {
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      JSON.stringify(payload)
    );
    return true;
  } catch (error: unknown) {
    const err = error as { statusCode?: number };
    // 구독이 만료된 경우
    if (err.statusCode === 410 || err.statusCode === 404) {
      console.log('Push subscription expired:', subscription.endpoint);
      return false;
    }
    console.error('Push notification error:', error);
    return false;
  }
}

// 최저가 알림 페이로드 생성
export function createLowestPricePayload(
  productName: string,
  currentPrice: number,
  previousPrice: number,
  productImage: string,
  productUrl: string
): PushPayload {
  const discount = Math.round(((previousPrice - currentPrice) / previousPrice) * 100);

  return {
    title: '역대 최저가 달성!',
    body: `${productName.slice(0, 30)}${productName.length > 30 ? '...' : ''} - ${currentPrice.toLocaleString()}원 (-${discount}%)`,
    icon: '/icon-192.png',
    image: productImage,
    badge: '/icon-192.png',
    url: productUrl,
    tag: `lowest-price-${Date.now()}`,
  };
}

// 목표가 도달 알림 페이로드 생성
export function createTargetPricePayload(
  productName: string,
  currentPrice: number,
  targetPrice: number,
  productImage: string,
  productUrl: string
): PushPayload {
  return {
    title: '목표 가격 도달!',
    body: `${productName.slice(0, 30)}${productName.length > 30 ? '...' : ''} - ${currentPrice.toLocaleString()}원 (목표: ${targetPrice.toLocaleString()}원)`,
    icon: '/icon-192.png',
    image: productImage,
    badge: '/icon-192.png',
    url: productUrl,
    tag: `target-price-${Date.now()}`,
  };
}
