"use client";

import { useState, useEffect } from "react";

export function useIsMobile(breakpoint: number = 768) {
  // Initialize with a check to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Set initial value once mounted
    setIsMobile(window.innerWidth < breakpoint);

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [breakpoint]);

  return isMobile;
}