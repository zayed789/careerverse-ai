import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { WEBHOOK_URLS } from '@/lib/interviewWebhooks';

export interface ScenarioResult {
  passed: boolean;
  score?: number;
  feedback?: string;
  evaluation?: string;
  reasoning?: string;
  scenario?: string;
  [key: string]: unknown;
}

interface ScenarioRoundProps {
  sessionId: string;
  targetRole: string;
  onResult: (result: ScenarioResult) => void;
}

const ScenarioRound = ({
  sessionId,
  targetRole,
  onResult,
}: ScenarioRoundProps) => {
  const [scenario, setScenario] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingS, setFetchingS] = useState(true);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const res = await fetch(WEBHOOK_URLS.scenario, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            target_role: targetRole,
            round: 'scenario',
            action: 'get_scenario',
          }),
        });
        if (!res.ok) throw new Error('Failed to fetch scenario');
        const raw = await res.json();
        const data = Array.isArray(raw) ? raw[0] : raw;
        setScenario(
          data.scenario ||
            'You are presented with a complex problem in your domain. Describe your step-by-step approach to solving it, including any tools, frameworks, or methodologies you would use.'
        );
      } catch {
        setScenario(
          'You are presented with a complex problem in your domain. Describe your step-by-step approach to solving it, including any tools, frameworks, or methodologies you would use.'
        );
      } finally {
        setFetchingS(false);
      }
    };
    fetchScenario();
  }, [sessionId, targetRole]);

  const handleSubmit = async () => {
    if (!answer.trim() || loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(WEBHOOK_URLS.scenario, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          round: 'scenario',
          scenario,
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
                  ? 'Scenario Round Passed!'
                  : 'Interview Ended'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {result.passed
                  ? 'Proceeding to the Final Decision.'
                  : 'You did not pass the scenario round.'}
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

          {(result.evaluation || result.feedback) && (
            <p className="text-sm text-muted-foreground mb-2">
              {result.evaluation || result.feedback}
            </p>
          )}

          {result.reasoning && (
            <p className="text-sm text-muted-foreground/80 italic">
              {result.reasoning}
            </p>
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
          Round 3: Scenario Interview
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Read the scenario and provide your detailed response.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg bg-secondary/30 border border-border/30 p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Scenario
                </Label>
                {fetchingS ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Loading scenario...
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-foreground mt-1">{scenario}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Your Response
            </Label>
            <Textarea
              placeholder="Describe your approach..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={loading || fetchingS}
              className="bg-secondary/30 border-border/50 min-h-[150px]"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={!answer.trim() || loading || fetchingS}
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
                Submit Scenario Response
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ScenarioRound;
