import { useState, useEffect } from 'react';

export interface ScrollPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | null;
  isScrolling: boolean;
}

export function useScrollPosition(): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    direction: null,
    isScrolling: false,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateScrollPosition() {
      const currentScrollY = window.scrollY;
      const currentScrollX = window.scrollX;

      setScrollPosition({
        x: currentScrollX,
        y: currentScrollY,
        direction: currentScrollY > lastScrollY ? 'down' : 'up',
        isScrolling: true,
      });

      lastScrollY = currentScrollY;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    }

    // Add event listener
    window.addEventListener('scroll', onScroll);

    // Call handler right away so state gets updated with initial scroll position
    updateScrollPosition();

    // Remove event listener on cleanup
    return () => window.removeEventListener('scroll', onScroll);
  }, []); // Empty array ensures that effect is only run on mount

  return scrollPosition;
} 