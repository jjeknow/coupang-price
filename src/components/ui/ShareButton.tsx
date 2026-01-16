'use client';

import { memo, useCallback } from 'react';
import { useHaptic } from '@/hooks/useHaptic';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text?: string;
  url: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
}

function ShareButton({
  title,
  text,
  url,
  className = '',
  size = 'md',
  variant = 'default',
}: ShareButtonProps) {
  const { successFeedback } = useHaptic();

  const handleShare = useCallback(async () => {
    await successFeedback();

    try {
      const { share } = await import('@/lib/capacitor/share');
      await share({ title, text, url });
    } catch (error) {
      console.error('공유 실패:', error);
    }
  }, [title, text, url, successFeedback]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const variantClasses = {
    default: 'bg-[#f2f4f6] hover:bg-[#e5e8eb] text-[#4e5968]',
    ghost: 'hover:bg-[#f2f4f6] text-[#4e5968]',
    outline: 'border border-[#e5e8eb] hover:bg-[#f2f4f6] text-[#4e5968]',
  };

  return (
    <button
      onClick={handleShare}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full flex items-center justify-center
        transition-colors active:scale-95
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3182f6]
        ${className}
      `}
      aria-label="공유하기"
    >
      <Share2 size={iconSizes[size]} />
    </button>
  );
}

export default memo(ShareButton);
