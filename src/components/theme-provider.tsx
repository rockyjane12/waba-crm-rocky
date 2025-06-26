"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

const getThemeFromStorage = (
  storageKey: string,
  defaultTheme: Theme,
): Theme => {
  if (typeof window === "undefined") return defaultTheme;
  try {
    const theme = localStorage.getItem(storageKey) as Theme;
    return theme || defaultTheme;
  } catch {
    return defaultTheme;
  }
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Initialize mounted state and theme from localStorage
  useEffect(() => {
    setMounted(true);
    const savedTheme = getThemeFromStorage(storageKey, defaultTheme);
    if (savedTheme !== theme) {
      setTheme(savedTheme);
    }
  }, []);  // Run only once on mount

  // Handle theme changes and system theme
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
        const systemTheme = e.matches ? "dark" : "light";
        root.classList.add(systemTheme);
      };

      // Set initial value
      handleChange(mediaQuery);

      // Listen for changes
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    root.classList.add(theme);
  }, [theme, mounted]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (error) {
        console.warn("Failed to save theme to localStorage:", error);
      }
      setTheme(newTheme);
    },
  };

  // Prevent flash of incorrect theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
