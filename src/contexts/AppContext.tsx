import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
  loading: boolean;
  refreshScores: () => Promise<void>;
}

const defaultScores: Scores = {
  dsa: 0,
  aptitude: 0,
  ats: 0,
  skillGap: 0,
  interview: 0,
  consistency: 0,
};

const DB_KEY_MAP: Record<keyof Scores, string> = {
  dsa: 'dsa_score',
  aptitude: 'aptitude_score',
  ats: 'ats_score',
  skillGap: 'skill_gap_score',
  interview: 'interview_score',
  consistency: 'consistency_score',
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
  const { user } = useAuth();
  const [scores, setScores] = useState<Scores>(defaultScores);
  const [loading, setLoading] = useState(true);

  const fetchScores = useCallback(async () => {
    if (!user) {
      setScores(defaultScores);
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setScores({
          dsa: typeof data.dsa_score === 'number' ? data.dsa_score : 0,
          aptitude: typeof data.aptitude_score === 'number' ? data.aptitude_score : 0,
          ats: typeof data.ats_score === 'number' ? data.ats_score : 0,
          skillGap: typeof data.skill_gap_score === 'number' ? data.skill_gap_score : 0,
          interview: typeof data.interview_score === 'number' ? data.interview_score : 0,
          consistency: typeof data.consistency_score === 'number' ? data.consistency_score : 0,
        });
      } else {
        // Create metrics row if it doesn't exist
        await supabase.from('user_metrics').insert({
          user_id: user.id,
          dsa_score: 0,
          aptitude_score: 0,
          ats_score: 0,
          skill_gap_score: 0,
          interview_score: 0,
          consistency_score: 0,
        });
        setScores(defaultScores);
      }
    } catch {
      setScores(defaultScores);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const updateScore = useCallback(async (key: keyof Scores, value: number) => {
    if (!user) return;

    setScores((prev) => {
      const next = { ...prev, [key]: value };

      // Persist to database
      const readinessScore = calcReadiness(next);
      supabase
        .from('user_metrics')
        .update({
          [DB_KEY_MAP[key]]: value,
          readiness_score: readinessScore,
        })
        .eq('user_id', user.id)
        .then();

      return next;
    });
  }, [user]);

  const readiness = useMemo(() => calcReadiness(scores), [scores]);

  return (
    <AppContext.Provider value={{ scores, updateScore, readiness, loading, refreshScores: fetchScores }}>
      {children}
    </AppContext.Provider>
  );
};
