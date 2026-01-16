'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // 300px 이상 스크롤되면 버튼 표시
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed right-4 bottom-24 z-40
        w-12 h-12 rounded-full
        bg-white shadow-lg border border-[#e5e8eb]
        flex items-center justify-center
        text-[#5c6470] hover:text-[#3182f6] hover:border-[#3182f6]
        active:scale-95 transition-all duration-200
        touch-manipulation
        ${isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
      `}
      aria-label="맨 위로 이동"
    >
      <ChevronUp size={24} strokeWidth={2.5} />
    </button>
  );
}
