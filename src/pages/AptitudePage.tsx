import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  Clock,
  Play,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  XCircle,
  BarChart3,
  ArrowRight,
  RotateCcw,
  Trophy,
  Target,
  Lightbulb,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Question Bank ─── */

interface Question {
  id: number;
  section: 'Quantitative Aptitude' | 'Logical Reasoning' | 'Verbal Ability';
  text: string;
  options: string[];
  correct: number; // index
}

const questions: Question[] = [
  // Quantitative Aptitude (7)
  { id: 1, section: 'Quantitative Aptitude', text: 'If 3x + 7 = 22, what is the value of x?', options: ['3', '5', '7', '4'], correct: 1 },
  { id: 2, section: 'Quantitative Aptitude', text: 'A train 150m long passes a pole in 15 seconds. What is the speed of the train in km/h?', options: ['36', '40', '30', '45'], correct: 0 },
  { id: 3, section: 'Quantitative Aptitude', text: 'If the ratio of A to B is 3:5, and B to C is 2:3, what is A:C?', options: ['2:5', '6:15', '1:3', '3:8'], correct: 0 },
  { id: 4, section: 'Quantitative Aptitude', text: 'What is 25% of 840?', options: ['200', '210', '220', '230'], correct: 1 },
  { id: 5, section: 'Quantitative Aptitude', text: 'If a number is increased by 20% and then decreased by 20%, the net change is:', options: ['0%', '-4%', '+4%', '-2%'], correct: 1 },
  { id: 6, section: 'Quantitative Aptitude', text: 'The average of 5 numbers is 42. If one number is excluded, the average becomes 38. What is the excluded number?', options: ['58', '52', '48', '62'], correct: 0 },
  { id: 7, section: 'Quantitative Aptitude', text: 'A cistern can be filled by pipe A in 12 hours and by pipe B in 18 hours. How long will it take to fill if both are opened?', options: ['7.2 hrs', '6.5 hrs', '8 hrs', '5 hrs'], correct: 0 },
  // Logical Reasoning (7)
  { id: 8, section: 'Logical Reasoning', text: 'Find the next number in the series: 2, 6, 12, 20, 30, ?', options: ['42', '40', '38', '44'], correct: 0 },
  { id: 9, section: 'Logical Reasoning', text: 'If FRIEND is coded as HUMGPF, how is CANDLE coded?', options: ['EDRIRL', 'DCPFMG', 'ECRFNI', 'ECPFNG'], correct: 3 },
  { id: 10, section: 'Logical Reasoning', text: 'All roses are flowers. Some flowers fade quickly. Which conclusion follows?', options: ['All roses fade quickly', 'Some roses may fade quickly', 'No roses fade quickly', 'Some flowers are not roses'], correct: 1 },
  { id: 11, section: 'Logical Reasoning', text: 'Statement: Some cats are dogs. All dogs are animals. Conclusion: Some cats are animals.', options: ['True', 'False', 'Cannot be determined', 'Partially true'], correct: 0 },
  { id: 12, section: 'Logical Reasoning', text: 'If A > B, B > C, and C > D, which of the following is true?', options: ['D > A', 'A > D', 'B > D only', 'Cannot determine'], correct: 1 },
  { id: 13, section: 'Logical Reasoning', text: 'Looking at a portrait, Aman said "He is the son of my grandfather\'s only son." Who is in the portrait?', options: ['Aman himself', 'His father', 'His son', 'His brother'], correct: 3 },
  { id: 14, section: 'Logical Reasoning', text: 'A clock shows 3:15. What is the angle between the hour and minute hands?', options: ['0°', '7.5°', '15°', '22.5°'], correct: 1 },
  // Verbal Ability (6)
  { id: 15, section: 'Verbal Ability', text: 'Choose the synonym of "Ephemeral":', options: ['Eternal', 'Transient', 'Sturdy', 'Permanent'], correct: 1 },
  { id: 16, section: 'Verbal Ability', text: 'Choose the antonym of "Benevolent":', options: ['Kind', 'Generous', 'Malevolent', 'Charitable'], correct: 2 },
  { id: 17, section: 'Verbal Ability', text: 'Fill in the blank: "She was too _____ to speak in public."', options: ['confident', 'timid', 'aggressive', 'eloquent'], correct: 1 },
  { id: 18, section: 'Verbal Ability', text: 'Identify the error: "Each of the boys have completed their homework."', options: ['Each', 'have', 'their', 'No error'], correct: 1 },
  { id: 19, section: 'Verbal Ability', text: 'Choose the correct sentence:', options: ['He don\'t know nothing.', 'He doesn\'t know anything.', 'He don\'t know anything.', 'He doesn\'t know nothing.'], correct: 1 },
  { id: 20, section: 'Verbal Ability', text: '"To burn the midnight oil" means:', options: ['To waste resources', 'To work late into the night', 'To destroy something', 'To cook at night'], correct: 1 },
];

/* ─── Types ─── */

type QuestionStatus = 'unanswered' | 'answered' | 'flagged';
type Phase = 'overview' | 'assessment' | 'submitting' | 'results';

interface SectionResult {
  correct: number;
  total: number;
  score: number;
}

interface Results {
  overall: number;
  correct: number;
  accuracy: number;
  badge: string;
  sections: Record<string, SectionResult>;
  strongest: string;
  weakest: string;
  suggestion: string;
}

/* ─── Component ─── */

const TOTAL_TIME = 30 * 60; // 30 minutes in seconds

const AptitudePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth() as any;
  const { scores, updateScore } = useAppContext();

  const [phase, setPhase] = useState<Phase>('overview');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(20).fill(null));
  const [flagged, setFlagged] = useState<boolean[]>(Array(20).fill(false));
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [results, setResults] = useState<Results | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(() => {
    const stored = localStorage.getItem('cv_aptitude_best');
    return stored ? Number(stored) : null;
  });
  const [lastScore, setLastScore] = useState<number | null>(() => {
    const stored = localStorage.getItem('cv_aptitude_last');
    return stored ? Number(stored) : null;
  });

  // Timer
  useEffect(() => {
    if (phase !== 'assessment') return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [phase, timeLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const getStatus = useCallback(
    (idx: number): QuestionStatus => {
      if (flagged[idx]) return 'flagged';
      if (answers[idx] !== null) return 'answered';
      return 'unanswered';
    },
    [answers, flagged]
  );

  const answeredCount = useMemo(() => answers.filter((a) => a !== null).length, [answers]);

  const selectAnswer = (optIdx: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = optIdx;
      return next;
    });
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = [...prev];
      next[currentQ] = !next[currentQ];
      return next;
    });
  };

  const startAssessment = () => {
    setAnswers(Array(20).fill(null));
    setFlagged(Array(20).fill(false));
    setTimeLeft(TOTAL_TIME);
    setCurrentQ(0);
    setResults(null);
    setPhase('assessment');
  };

  const handleSubmit = async () => {
    setPhase('submitting');

    // Compute results locally as fallback
    const sectionMap: Record<string, { correct: number; total: number }> = {};
    let totalCorrect = 0;

    questions.forEach((q, i) => {
      const sec = q.section;
      if (!sectionMap[sec]) sectionMap[sec] = { correct: 0, total: 0 };
      sectionMap[sec].total++;
      if (answers[i] === q.correct) {
        totalCorrect++;
        sectionMap[sec].correct++;
      }
    });

    const accuracy = Math.round((totalCorrect / 20) * 100);
    const overallScore = accuracy;
    const badge =
      overallScore >= 80 ? 'Advanced' : overallScore >= 50 ? 'Intermediate' : 'Beginner';

    const sections: Record<string, SectionResult> = {};
    let strongest = '';
    let weakest = '';
    let maxPct = -1;
    let minPct = 101;

    Object.entries(sectionMap).forEach(([name, { correct, total }]) => {
      const pct = Math.round((correct / total) * 100);
      sections[name] = { correct, total, score: pct };
      if (pct > maxPct) { maxPct = pct; strongest = name; }
      if (pct < minPct) { minPct = pct; weakest = name; }
    });

    let suggestion = `Focus on improving your ${weakest} skills. Practice daily to strengthen weak areas.`;

    // Try webhook
    try {
      const res = await fetch(
        'https://testcase6788.app.n8n.cloud/webhook-test/aptitude-evaluation',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question_ids: questions.map((q) => q.id),
            selected_answers: answers,
            timestamp: new Date().toISOString(),
            user_id: user?.id || 'anonymous',
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const d = Array.isArray(data) ? data[0] : data;
        if (d?.suggestion) suggestion = d.suggestion;
      }
    } catch {
      // Use local results
    }

    const finalResults: Results = {
      overall: overallScore,
      correct: totalCorrect,
      accuracy,
      badge,
      sections,
      strongest,
      weakest,
      suggestion,
    };

    setResults(finalResults);
    updateScore('aptitude', overallScore);

    // Persist
    setLastScore(overallScore);
    localStorage.setItem('cv_aptitude_last', String(overallScore));
    if (!bestScore || overallScore > bestScore) {
      setBestScore(overallScore);
      localStorage.setItem('cv_aptitude_best', String(overallScore));
    }

    setPhase('results');
  };

  /* ─── Overview Phase ─── */
  if (phase === 'overview') {
    return (
      <Layout>
        <div className="section-container py-8 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Aptitude Assessment Engine</h1>
                <p className="text-sm text-muted-foreground">Structured placement assessment platform</p>
              </div>
            </div>

            <div className="glass-card p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBox label="Total Questions" value="20" />
                <StatBox label="Sections" value="3" />
                <StatBox label="Best Score" value={bestScore !== null ? `${bestScore}%` : '—'} />
                <StatBox label="Last Score" value={lastScore !== null ? `${lastScore}%` : '—'} />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Sections Covered</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Quantitative Aptitude</Badge>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">Logical Reasoning</Badge>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Verbal Ability</Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>30 minutes time limit</span>
              </div>

              <Button onClick={startAssessment} className="glow-button text-primary-foreground border-0" size="lg">
                <Play className="w-4 h-4 mr-2" />
                Start Assessment
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  /* ─── Submitting Phase ─── */
  if (phase === 'submitting') {
    return (
      <Layout>
        <div className="section-container py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Evaluating your performance…</p>
        </div>
      </Layout>
    );
  }

  /* ─── Results Phase ─── */
  if (phase === 'results' && results) {
    const badgeColor =
      results.badge === 'Advanced'
        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        : results.badge === 'Intermediate'
        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        : 'bg-red-500/20 text-red-400 border-red-500/30';

    return (
      <Layout>
        <div className="section-container py-8 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold gradient-text mb-6">Assessment Results</h1>

            {/* Summary Card */}
            <div className="glass-card p-6 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatBox label="Overall Score" value={`${results.overall}%`} />
              <StatBox label="Correct" value={`${results.correct} / 20`} />
              <StatBox label="Accuracy" value={`${results.accuracy}%`} />
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Badge</span>
                <Badge variant="outline" className={cn('text-sm', badgeColor)}>{results.badge}</Badge>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="glass-card p-6 space-y-4 mb-6">
              <h2 className="text-base font-semibold text-foreground">Section-wise Breakdown</h2>
              {Object.entries(results.sections).map(([name, s]) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{name}</span>
                    <span className="text-foreground font-medium">{s.correct}/{s.total} ({s.score}%)</span>
                  </div>
                  <Progress value={s.score} className="h-2" />
                </div>
              ))}
            </div>

            {/* Insights */}
            <div className="glass-card p-6 space-y-4 mb-6">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" /> Intelligence Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                  <Trophy className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Strongest Section</p>
                    <p className="text-sm font-semibold text-foreground">{results.strongest}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                  <Target className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Weakest Section</p>
                    <p className="text-sm font-semibold text-foreground">{results.weakest}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{results.suggestion}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={startAssessment} className="glow-button text-primary-foreground border-0">
                <RotateCcw className="w-4 h-4 mr-2" /> Retake Assessment
              </Button>
              <Button variant="outline" onClick={() => setPhase('overview')}>
                Review Solutions
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  /* ─── Assessment Phase ─── */
  const q = questions[currentQ];
  const sectionColor =
    q.section === 'Quantitative Aptitude'
      ? 'bg-primary/10 text-primary border-primary/30'
      : q.section === 'Logical Reasoning'
      ? 'bg-accent/10 text-accent border-accent/30'
      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  const timerDanger = timeLeft < 300;

  return (
    <Layout>
      <div className="section-container py-6 space-y-4">
        {/* Timer bar */}
        <div className="glass-card px-5 py-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Question {currentQ + 1} of {questions.length}
          </span>
          <div className={cn('flex items-center gap-2 text-sm font-mono font-semibold', timerDanger ? 'text-destructive' : 'text-foreground')}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
          <span className="text-sm text-muted-foreground">{answeredCount}/{questions.length} answered</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left – Question Area */}
          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="glass-card p-6 space-y-5"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={sectionColor}>{q.section}</Badge>
                </div>

                <p className="text-lg text-foreground font-medium">{q.text}</p>

                {/* Options */}
                <div className="space-y-3">
                  {q.options.map((opt, idx) => {
                    const selected = answers[currentQ] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => selectAnswer(idx)}
                        className={cn(
                          'w-full text-left rounded-lg border p-3 text-sm transition-all',
                          selected
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:bg-secondary/60'
                        )}
                      >
                        <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Flag */}
                <button
                  onClick={toggleFlag}
                  className={cn(
                    'flex items-center gap-2 text-sm transition-colors',
                    flagged[currentQ] ? 'text-amber-400' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Flag className="w-4 h-4" />
                  {flagged[currentQ] ? 'Flagged for Review' : 'Flag for Review'}
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                disabled={currentQ === 0}
                onClick={() => setCurrentQ((c) => c - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>

              {currentQ < questions.length - 1 ? (
                <Button variant="outline" onClick={() => setCurrentQ((c) => c + 1)}>
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="glow-button text-primary-foreground border-0">
                  Submit Assessment
                </Button>
              )}
            </div>
          </div>

          {/* Right – Navigator */}
          <div className="glass-card p-4 space-y-4 h-fit">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, i) => {
                const status = getStatus(i);
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className={cn(
                      'w-full aspect-square rounded-lg text-xs font-semibold flex items-center justify-center transition-all border',
                      i === currentQ && 'ring-2 ring-primary',
                      status === 'answered' && 'bg-primary/20 text-primary border-primary/30',
                      status === 'flagged' && 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                      status === 'unanswered' && 'bg-secondary/30 text-muted-foreground border-border hover:bg-secondary/60'
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary/20 border border-primary/30" />
                Answered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30" />
                Flagged
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-secondary/30 border border-border" />
                Unanswered
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

/* ─── Stat Box ─── */
const StatBox = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
    <span className="text-2xl font-bold text-foreground">{value}</span>
  </div>
);

export default AptitudePage;
