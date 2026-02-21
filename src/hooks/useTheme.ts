import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
}

// Apply theme immediately to prevent flash
(function () {
  if (typeof document === 'undefined') return;
  const t = (localStorage.getItem('theme') as Theme) || 'dark';
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(t);
})();

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem('theme', t);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    // Ensure class matches on mount
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' };
}
