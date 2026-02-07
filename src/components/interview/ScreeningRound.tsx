import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { WEBHOOK_URLS } from '@/lib/interviewWebhooks';

export interface ScreeningResult {
  passed: boolean;
  score?: number;
  feedback?: string;
  details?: Array<{ question: string; rating: string; comment: string }>;
  [key: string]: unknown;
}

interface ScreeningQuestion {
  id: number;
  question: string;
}

interface ScreeningRoundProps {
  sessionId: string;
  candidateName: string;
  targetRole: string;
  welcomeMessage: string;
  questions: ScreeningQuestion[];
  onResult: (result: ScreeningResult) => void;
}

const ScreeningRound = ({
  sessionId,
  candidateName,
  targetRole,
  welcomeMessage,
  questions,
  onResult,
}: ScreeningRoundProps) => {
  const [answers, setAnswers] = useState<string[]>(
    questions.map(() => '')
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [error, setError] = useState('');

  const allAnswered = answers.every((a) => a.trim().length > 0);

  const handleSubmit = async () => {
    if (!allAnswered || loading) return;
    setLoading(true);
    setError('');

    const payload = {
      session_id: sessionId,
      candidate_name: candidateName,
      target_role: targetRole,
      round: 'screening',
      answers: questions.map((q, i) => ({
        question: q.question,
        answer: answers[i].trim(),
      })),
    };

    try {
      const res = await fetch(WEBHOOK_URLS.screening, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Webhook request failed');
      const raw = await res.json();
      const data = Array.isArray(raw) ? raw[0] : raw;
      setResult(data);
      onResult(data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div
          className={`rounded-2xl border p-6 backdrop-blur-xl ${
            result.passed
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-red-500/30 bg-red-500/5'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            {result.passed ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            ) : (
              <XCircle className="w-7 h-7 text-red-400" />
            )}
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {result.passed ? 'Screening Passed!' : 'Interview Ended'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {result.passed
                  ? 'You have been advanced to the Technical round.'
                  : 'Unfortunately you did not pass the screening round.'}
              </p>
            </div>
          </div>

          {result.score !== undefined && (
            <div className="mb-4">
              <span className="text-sm text-muted-foreground">Score: </span>
              <span className="text-lg font-bold text-foreground">
                {result.score}
              </span>
            </div>
          )}

          {result.feedback && (
            <p className="text-sm text-muted-foreground mb-4">
              {result.feedback}
            </p>
          )}

          {result.details && result.details.length > 0 && (
            <div className="space-y-3">
              {result.details.map((d, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-secondary/30 border border-border/30 p-3"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {d.question}
                  </p>
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{d.rating}</span> —{' '}
                    {d.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {welcomeMessage && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-xl p-4 text-center">
          <p className="text-sm text-primary font-medium">{welcomeMessage}</p>
        </div>
      )}

      <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6">
        <h2 className="text-xl font-bold text-foreground mb-1">
          Round 1: Screening Interview
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Answer the behavioural questions below. Be clear and honest.
        </p>

        <div className="space-y-5">
          {questions.map((q, i) => (
            <div key={q.id} className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {i + 1}. {q.question}
              </Label>
              <Textarea
                placeholder="Type your answer here..."
                value={answers[i]}
                onChange={(e) => {
                  const copy = [...answers];
                  copy[i] = e.target.value;
                  setAnswers(copy);
                }}
                disabled={loading}
                className="bg-secondary/30 border-border/50 min-h-[100px]"
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-400 mt-4">{error}</p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!allAnswered || loading}
          className="w-full glow-button text-white border-0 mt-6"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Evaluating...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Screening Answers
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default ScreeningRound;
