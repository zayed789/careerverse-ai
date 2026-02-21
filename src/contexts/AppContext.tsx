import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';

interface Scores {
  dsa: number;
  aptitude: number;
  ats: number;
  skillGap: number;
  interview: number;
  consistency: number;
}

interface AppContextType {
  scores: Scores;
  updateScore: (key: keyof Scores, value: number) => void;
  readiness: number;
}

const STORAGE_KEY = 'careerverse_metrics';

const defaultScores: Scores = {
  dsa: 0,
  aptitude: 0,
  ats: 0,
  skillGap: 0,
  interview: 0,
  consistency: 0,
};

const loadScores = (): Scores => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultScores;
    const parsed = JSON.parse(raw);
    return {
      dsa: typeof parsed.dsa === 'number' ? parsed.dsa : 0,
      aptitude: typeof parsed.aptitude === 'number' ? parsed.aptitude : 0,
      ats: typeof parsed.ats === 'number' ? parsed.ats : 0,
      skillGap: typeof parsed.skillGap === 'number' ? parsed.skillGap : 0,
      interview: typeof parsed.interview === 'number' ? parsed.interview : 0,
      consistency: typeof parsed.consistency === 'number' ? parsed.consistency : 0,
    };
  } catch {
    return defaultScores;
  }
};

const calcReadiness = (s: Scores) =>
  Math.round(
    Math.min(100, Math.max(0,
      0.30 * s.dsa +
      0.20 * s.aptitude +
      0.15 * s.ats +
      0.10 * s.skillGap +
      0.15 * s.interview +
      0.10 * s.consistency
    ))
  );

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [scores, setScores] = useState<Scores>(loadScores);

  const updateScore = useCallback((key: keyof Scores, value: number) => {
    setScores((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Persist on every change (covers hydration edge cases)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  }, [scores]);

  const readiness = useMemo(() => calcReadiness(scores), [scores]);

  return (
    <AppContext.Provider value={{ scores, updateScore, readiness }}>
      {children}
    </AppContext.Provider>
  );
};
