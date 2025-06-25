"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    // Set initial value
    setMatches(media.matches);

    // Define listener
    const listener = () => setMatches(media.matches);
    
    // Add listener
    media.addEventListener("change", listener);

    // Cleanup
    return () => media.removeEventListener("change", listener);
  }, [query]); // Remove matches from dependencies

  return matches;
}
