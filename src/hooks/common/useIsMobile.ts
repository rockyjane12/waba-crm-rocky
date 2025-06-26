"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = "(max-width: 768px)";

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(MOBILE_BREAKPOINT).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
    const updateTarget = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    // Modern browsers
    mediaQuery.addEventListener('change', updateTarget);

    return () => mediaQuery.removeEventListener('change', updateTarget);
  }, []); // Empty deps array since we only want to run this once on mount

  return isMobile;
}
