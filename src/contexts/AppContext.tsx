import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

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

const defaultScores: Scores = {
  dsa: 70,
  aptitude: 74,
  ats: 82,
  skillGap: 65,
  interview: 74,
  consistency: 80,
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
  const [scores, setScores] = useState<Scores>(defaultScores);

  const updateScore = useCallback((key: keyof Scores, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  }, []);

  const readiness = useMemo(() => calcReadiness(scores), [scores]);

  return (
    <AppContext.Provider value={{ scores, updateScore, readiness }}>
      {children}
    </AppContext.Provider>
  );
};
