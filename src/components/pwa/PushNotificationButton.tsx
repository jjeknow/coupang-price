'use client';

import { Bell, BellOff, Loader2 } from 'lucide-react';
import { usePushNotification } from '@/hooks/usePushNotification';

interface PushNotificationButtonProps {
  variant?: 'default' | 'compact';
}

export default function PushNotificationButton({ variant = 'default' }: PushNotificationButtonProps) {
  const { permission, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotification();

  if (permission === 'unsupported') {
    return null;
  }

  const handleClick = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      const success = await subscribe();
      if (success) {
        // 구독 성공 시 환영 알림
      }
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`
          flex items-center justify-center w-10 h-10 rounded-full transition-all
          ${isSubscribed
            ? 'bg-[#3182f6] text-white'
            : 'bg-[#f2f4f6] text-[#5c6470] hover:bg-[#e5e8eb]'
          }
          disabled:opacity-50
        `}
        title={isSubscribed ? '알림 끄기' : '알림 켜기'}
      >
        {isLoading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : isSubscribed ? (
          <Bell size={20} />
        ) : (
          <BellOff size={20} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all
        ${isSubscribed
          ? 'bg-[#f2f4f6] text-[#5c6470] hover:bg-[#e5e8eb]'
          : 'bg-[#3182f6] text-white hover:bg-[#1b64da]'
        }
        active:scale-[0.98] disabled:opacity-50 touch-manipulation
      `}
    >
      {isLoading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          처리 중...
        </>
      ) : isSubscribed ? (
        <>
          <BellOff size={20} />
          알림 해제하기
        </>
      ) : (
        <>
          <Bell size={20} />
          최저가 알림 받기
        </>
      )}
    </button>
  );
}
