import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2, XCircle, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { WEBHOOK_URLS } from '@/lib/interviewWebhooks';

export interface TechnicalResult {
  passed: boolean;
  score?: number;
  feedback?: string;
  question?: string;
  [key: string]: unknown;
}

interface TechnicalRoundProps {
  sessionId: string;
  targetRole: string;
  onResult: (result: TechnicalResult) => void;
}

const TechnicalRound = ({
  sessionId,
  targetRole,
  onResult,
}: TechnicalRoundProps) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingQ, setFetchingQ] = useState(true);
  const [result, setResult] = useState<TechnicalResult | null>(null);
  const [error, setError] = useState('');

  // Fetch the technical question on mount
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(WEBHOOK_URLS.technical, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            target_role: targetRole,
            round: 'technical',
            action: 'get_question',
          }),
        });
        if (!res.ok) throw new Error('Failed to fetch question');
        const raw = await res.json();
        const data = Array.isArray(raw) ? raw[0] : raw;
        setQuestion(
          data.question || 'Explain a technical concept relevant to your target role and provide a practical example.'
        );
      } catch {
        setQuestion(
          'Explain a technical concept relevant to your target role and provide a practical example.'
        );
      } finally {
        setFetchingQ(false);
      }
    };
    fetchQuestion();
  }, [sessionId, targetRole]);

  const handleSubmit = async () => {
    if (!answer.trim() || loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(WEBHOOK_URLS.technical, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          target_role: targetRole,
          round: 'technical',
          question,
          answer: answer.trim(),
        }),
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
                {result.passed
                  ? 'Technical Round Passed!'
                  : 'Interview Ended'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {result.passed
                  ? 'Advancing to the Scenario round.'
                  : 'You did not pass the technical round.'}
              </p>
            </div>
          </div>

          {result.score !== undefined && (
            <div className="mb-3">
              <span className="text-sm text-muted-foreground">Score: </span>
              <span className="text-lg font-bold text-foreground">
                {result.score}
              </span>
            </div>
          )}

          {result.feedback && (
            <p className="text-sm text-muted-foreground">{result.feedback}</p>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6">
        <h2 className="text-xl font-bold text-foreground mb-1">
          Round 2: Technical Interview
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Answer the technical question below thoroughly.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg bg-secondary/30 border border-border/30 p-4">
            <div className="flex items-start gap-3">
              <Code className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Question
                </Label>
                {fetchingQ ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Loading question...
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-foreground mt-1">{question}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Your Answer
            </Label>
            <Textarea
              placeholder="Type your technical answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={loading || fetchingQ}
              className="bg-secondary/30 border-border/50 min-h-[150px]"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={!answer.trim() || loading || fetchingQ}
            className="w-full glow-button text-white border-0"
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
                Submit Technical Answer
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TechnicalRound;
