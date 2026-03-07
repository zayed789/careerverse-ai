import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Loader2, ChevronRight, ClipboardCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import QuestionCard from '@/components/mock-interview/QuestionCard';
import AudioRecorder from '@/components/mock-interview/AudioRecorder';
import CameraPreview from '@/components/mock-interview/CameraPreview';
import InterviewContextCard from '@/components/mock-interview/InterviewContextCard';
import RoundIndicator from '@/components/mock-interview/RoundIndicator';
import ScreeningResultModal from '@/components/mock-interview/ScreeningResultModal';
import type { ScreeningResult } from '@/components/mock-interview/ScreeningResultCard';
import type { InterviewRound, InterviewQuestion } from '@/components/mock-interview/types';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const AUDIO_WEBHOOK_URL = 'https://roxx5071.app.n8n.cloud/webhook-test/audio-to-text';
const SCREENING_EVALUATE_URL = 'https://roxx5071.app.n8n.cloud/webhook-test/screening-evaluate';

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

const SESSION_STORAGE_KEY_PREFIX = 'mock-interview-session-';

function getSessionStorageKey(userId: string | undefined): string {
  return `${SESSION_STORAGE_KEY_PREFIX}${userId ?? 'anonymous'}`;
}

interface PersistedState {
  started: boolean;
  candidateName: string;
  targetRole: string;
  sessionId: string | null;
  currentRound: InterviewRound;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  screeningSubmitted: boolean;
  savedQuestionIds: string[];
  userId?: string;
}

function loadPersistedState(userId: string | undefined): PersistedState | null {
  try {
    const key = getSessionStorageKey(userId);
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    // Only restore if it belongs to the same user
    if (parsed.userId && userId && parsed.userId !== userId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function clearPersistedState(userId: string | undefined) {
  sessionStorage.removeItem(getSessionStorageKey(userId));
}

const MockInterviewPage = () => {
  const { toast } = useToast();
  const { updateScore } = useAppContext();
  const { user } = useAuth();

  const userId = user?.id;
  const persisted = useRef(loadPersistedState(userId)).current;

  const [started, setStarted] = useState(persisted?.started ?? false);
  const [previousInterviewScore, setPreviousInterviewScore] = useState<number | null>(null);

  // Hydrate previous interview data
  useEffect(() => {
    if (!user) return;
    const hydrate = async () => {
      const { data } = await supabase
        .from('user_metrics')
        .select('interview_score, interview_feedback, interview_round_data')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data && typeof data.interview_score === 'number' && data.interview_score > 0) {
        setPreviousInterviewScore(data.interview_score);
      }
    };
    hydrate();
  }, [user]);

  const [isStarting, setIsStarting] = useState(false);
  const [candidateName, setCandidateName] = useState(persisted?.candidateName ?? '');
  const [targetRole, setTargetRole] = useState(persisted?.targetRole ?? '');

  // Screening submission state
  const [isSubmittingScreening, setIsSubmittingScreening] = useState(false);
  const [screeningSubmitted, setScreeningSubmitted] = useState(persisted?.screeningSubmitted ?? false);

  // Screening evaluation state
  const [isEvaluatingScreening, setIsEvaluatingScreening] = useState(false);
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);

  // Audio blobs — accumulated per question
  const audioBlobRef = useRef<Blob | null>(null);
  const collectedAudiosRef = useRef<Map<string, { blob: Blob; questionText: string }>>(new Map());
  const [hasRecorded, setHasRecorded] = useState(false);

  // Track which questions have a saved recording
  const [savedQuestions, setSavedQuestions] = useState<Set<string>>(new Set(persisted?.savedQuestionIds ?? []));

  // Session & interview progress state
  const [sessionId, setSessionId] = useState<string | null>(persisted?.sessionId ?? null);
  const [currentRound, setCurrentRound] = useState<InterviewRound>(persisted?.currentRound ?? 'screening');
  const [questions, setQuestions] = useState<InterviewQuestion[]>(persisted?.questions ?? []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(persisted?.currentQuestionIndex ?? 0);

  // Clear state when user changes
  const prevUserIdRef = useRef(userId);
  useEffect(() => {
    if (prevUserIdRef.current && userId && prevUserIdRef.current !== userId) {
      // Different user logged in — reset everything
      clearPersistedState(prevUserIdRef.current);
      resetInterview();
    }
    prevUserIdRef.current = userId;
  }, [userId]);

  const resetInterview = () => {
    setStarted(false);
    setCandidateName('');
    setTargetRole('');
    setSessionId(null);
    setCurrentRound('screening');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScreeningSubmitted(false);
    setScreeningResult(null);
    setIsEvaluatingScreening(false);
    setIsSubmittingScreening(false);
    setHasRecorded(false);
    setSavedQuestions(new Set());
    audioBlobRef.current = null;
    collectedAudiosRef.current = new Map();
    clearPersistedState(userId);
  };

  // Persist state to sessionStorage on changes
  useEffect(() => {
    const state: PersistedState = {
      started,
      candidateName,
      targetRole,
      sessionId,
      currentRound,
      questions,
      currentQuestionIndex,
      screeningSubmitted,
      savedQuestionIds: Array.from(savedQuestions),
      userId,
    };
    sessionStorage.setItem(getSessionStorageKey(userId), JSON.stringify(state));
  }, [started, candidateName, targetRole, sessionId, currentRound, questions, currentQuestionIndex, screeningSubmitted, savedQuestions, userId]);

  const currentQuestion = questions.length > 0 ? questions[currentQuestionIndex] : null;
  const isLastQuestion = currentQuestionIndex >= questions.length - 1;

  const canBegin = candidateName.trim().length > 0 && targetRole.trim().length > 0;
  const allQuestionsRecorded = questions.length > 0 && questions.every(q => collectedAudiosRef.current.has(q.id));

  const handleBeginInterview = async () => {
    if (!canBegin || isStarting) return;

    setIsStarting(true);
    const newSessionId = generateSessionId();

    try {
      const response = await fetch('https://roxx5071.app.n8n.cloud/webhook-test/screening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: newSessionId,
          candidate_name: candidateName.trim(),
          target_role: targetRole.trim(),
          round: 'screening',
          step: 'start',
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`);
      }

      const data = await response.json();
      const payload = Array.isArray(data) ? data[0] : data;

      setSessionId(newSessionId);

      const rawQuestions: any[] = payload?.questions || [];
      const mappedQuestions: InterviewQuestion[] = rawQuestions.map(
        (q: any, i: number) => ({
          id: q?.id || `${payload?.current_round || 'screening'}-q${i + 1}`,
          text: q?.question || q?.text || q,
          audio: q?.audio || undefined,
        })
      );
      setQuestions(mappedQuestions);

      if (payload?.current_round) {
        setCurrentRound(payload.current_round as InterviewRound);
      }

      setStarted(true);
    } catch (error) {
      console.error('Screening webhook error:', error);
      toast({
        title: 'Unable to start interview',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsStarting(false);
    }
  };

  const handleRecordingComplete = (blob: Blob) => {
    audioBlobRef.current = blob;
    setHasRecorded(true);
  };

  // Save answer locally for current question
  const handleSaveAnswer = () => {
    if (!audioBlobRef.current || !currentQuestion) return;

    collectedAudiosRef.current.set(currentQuestion.id, {
      blob: audioBlobRef.current,
      questionText: currentQuestion.text,
    });
    setSavedQuestions((prev) => new Set(prev).add(currentQuestion.id));

    toast({
      title: 'Answer saved',
      description: `Recording for Question ${currentQuestionIndex + 1} saved successfully.`,
    });

    // Reset for next action
    setHasRecorded(false);
    audioBlobRef.current = null;
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((i) => i + 1);
    setHasRecorded(false);
    audioBlobRef.current = null;
  };

  // Submit all audio to webhook
  const handleSubmitScreening = async () => {
    if (!sessionId || isSubmittingScreening || screeningSubmitted) return;

    // Validate all questions have recordings
    const missingQuestions = questions.filter(q => !collectedAudiosRef.current.has(q.id));
    if (missingQuestions.length > 0) {
      toast({
        title: 'Missing answers',
        description: 'Please record answers for all questions before submitting the screening round.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmittingScreening(true);
    try {
      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('candidate_name', candidateName.trim());
      formData.append('target_role', targetRole.trim());
      formData.append('round', currentRound);

      let idx = 0;
      for (const [qId, { blob, questionText }] of collectedAudiosRef.current.entries()) {
        formData.append(`audio_${idx}`, blob, `recording_${qId}.webm`);
        formData.append(`question_id_${idx}`, qId);
        formData.append(`question_text_${idx}`, questionText);
        idx++;
      }
      formData.append('total_questions', String(idx));

      const response = await fetch(AUDIO_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Webhook returned ${response.status}`);

      setScreeningSubmitted(true);
      toast({
        title: 'Screening round submitted!',
        description: 'Your responses have been successfully submitted and are being analyzed by the AI interviewer.',
      });
    } catch (error) {
      console.error('Audio webhook error:', error);
      toast({
        title: 'Submission failed',
        description: 'Could not send your recordings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingScreening(false);
    }
  };

  // Evaluate screening answers
  const handleEvaluateScreening = async () => {
    if (!sessionId || isEvaluatingScreening) return;
    setIsEvaluatingScreening(true);
    try {
      const response = await fetch(SCREENING_EVALUATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          round: 'screening',
          candidate_name: candidateName.trim(),
          target_role: targetRole.trim(),
        }),
      });
      if (!response.ok) throw new Error(`Webhook returned ${response.status}`);
      const data = await response.json();
      const payload = Array.isArray(data) ? data[0] : data;
      setScreeningResult({
        overall_score: payload.overall_score ?? 0,
        strengths: payload.strengths ?? [],
        weaknesses: payload.weaknesses ?? [],
        passed: payload.passed ?? false,
        reasoning: payload.reasoning ?? '',
      });
    } catch (error) {
      console.error('Screening evaluate error:', error);
      toast({
        title: 'Evaluation failed',
        description: 'Unable to evaluate screening answers. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsEvaluatingScreening(false);
    }
  };

  // Key for remounting AudioRecorder on question change
  const recorderKey = currentQuestion?.id || 'no-question';

  return (
    <Layout>
      <div className="section-container py-10">
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <Card className="glass-card border-border/30 w-full max-w-lg">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
                    <Mic className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold gradient-text">
                    Mock Interview Setup
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Tell us a bit about yourself before we begin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="candidate-name">Candidate Name</Label>
                    <Input
                      id="candidate-name"
                      placeholder="Enter your full name"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target-role">Target Role</Label>
                    <Input
                      id="target-role"
                      placeholder="e.g. Frontend Developer"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full h-11 text-base"
                    disabled={!canBegin || isStarting}
                    onClick={handleBeginInterview}
                  >
                    {isStarting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Starting…
                      </>
                    ) : (
                      'Begin Interview'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : screeningSubmitted ? (
            /* ── Final confirmation screen ── */
            <motion.div
              key="submitted"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <Card className="glass-card border-border/30 w-full max-w-2xl">
                <CardContent className="flex flex-col items-center gap-6 py-12 px-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold gradient-text mb-2">
                      Screening Round Completed
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Your responses have been successfully submitted and are being analyzed by the AI interviewer.
                      Please wait while we generate your evaluation.
                    </p>
                  </div>

                  {/* Per-question submission status */}
                  <div className="w-full space-y-2 mt-4">
                    {questions.map((q, i) => (
                      <div key={q.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/20">
                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                        <div className="text-left flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">Question {i + 1}</p>
                          <p className="text-xs text-muted-foreground truncate">{q.text}</p>
                        </div>
                        <span className="text-xs font-medium text-accent whitespace-nowrap">✓ Answer submitted</span>
                      </div>
                    ))}
                  </div>

                  {/* Evaluate button */}
                  {!screeningResult && (
                    <Button
                      className="w-full gap-2 h-12 text-base bg-gradient-to-r from-primary to-primary/80 mt-4"
                      size="lg"
                      disabled={isEvaluatingScreening}
                      onClick={handleEvaluateScreening}
                    >
                      {isEvaluatingScreening ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing your interview responses...
                        </>
                      ) : (
                        <>
                          <ClipboardCheck className="w-4 h-4" />
                          Get Screening Evaluation
                        </>
                      )}
                    </Button>
                  )}

                  {/* Screening result modal */}
                  {screeningResult && (
                    <ScreeningResultModal
                      result={screeningResult}
                      open={!!screeningResult}
                      onProceed={() => {
                        setScreeningResult(null);
                        setCurrentRound('technical');
                        setCurrentQuestionIndex(0);
                        setQuestions([]);
                        setSavedQuestions(new Set());
                        setScreeningSubmitted(false);
                        collectedAudiosRef.current = new Map();
                        audioBlobRef.current = null;
                      }}
                      onRetake={() => {
                        setScreeningResult(null);
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="interview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Page header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Mic className="w-5 h-5 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold gradient-text">Mock Interview</h1>
                </div>
                <p className="text-muted-foreground ml-[52px]">
                  Simulated interview environment — audio responses only
                </p>
              </div>

              {/* Personalized greeting */}
              <div className="mb-4 glass-card border-border/30 p-4 rounded-xl">
                <p className="text-lg font-medium text-foreground">
                  Hi {candidateName.trim()}, welcome to your mock interview 👋
                </p>
              </div>

              {/* Round indicator */}
              <div className="mb-6 glass-card border-border/30 p-3 rounded-xl">
                <RoundIndicator currentRound={currentRound} />
              </div>

              {/* Progress: saved answers tracker */}
              <div className="mb-6 flex flex-wrap gap-2">
                {questions.map((q, i) => (
                  <div
                    key={q.id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      savedQuestions.has(q.id)
                        ? 'bg-accent/10 border-accent/30 text-accent'
                        : currentQuestionIndex === i
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-muted/30 border-border/20 text-muted-foreground'
                    }`}
                  >
                    {savedQuestions.has(q.id) && <CheckCircle2 className="w-3 h-3" />}
                    Q{i + 1}
                  </div>
                ))}
              </div>

              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left panel — Interview flow */}
                <div className="lg:col-span-2 space-y-6">
                  {!currentQuestion ? (
                    <Card className="glass-card border-border/30 p-6">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading questions…</span>
                      </div>
                    </Card>
                  ) : (
                    <>
                      <QuestionCard
                        question={currentQuestion}
                        currentIndex={currentQuestionIndex + 1}
                        totalQuestions={questions.length}
                        autoPlay={currentQuestionIndex === 0}
                      />

                      {/* Saved indicator for current question */}
                      {savedQuestions.has(currentQuestion.id) && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium text-accent">✓ Answer saved for this question</span>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        className="w-full gap-2 h-11"
                        disabled={isLastQuestion}
                        onClick={handleNextQuestion}
                      >
                        Next Question
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  <AudioRecorder
                    key={recorderKey}
                    onRecordingComplete={handleRecordingComplete}
                    isEvaluating={isSubmittingScreening}
                  />

                  {/* Save answer button (local only) */}
                  <Button
                    disabled={!hasRecorded || isSubmittingScreening}
                    className="w-full gap-2 h-12 text-base"
                    size="lg"
                    onClick={handleSaveAnswer}
                  >
                    <Send className="w-4 h-4" />
                    Save Audio Answer
                  </Button>

                  {/* Submit Screening Round button */}
                  {!screeningSubmitted && (
                    <div className="space-y-3">
                      {!allQuestionsRecorded && questions.length > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 border border-border/20">
                          <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Please record answers for all {questions.length} questions before submitting.
                            ({savedQuestions.size}/{questions.length} recorded)
                          </span>
                        </div>
                      )}
                      <Button
                        disabled={!allQuestionsRecorded || isSubmittingScreening}
                        className="w-full gap-2 h-12 text-base bg-gradient-to-r from-primary to-primary/80"
                        size="lg"
                        onClick={handleSubmitScreening}
                      >
                        {isSubmittingScreening ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting your answers…
                          </>
                        ) : (
                          <>
                            <ClipboardCheck className="w-4 h-4" />
                            Submit Screening Round
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Right panel — Environment */}
                <div className="space-y-6">
                  <CameraPreview />
                  <InterviewContextCard
                    candidateName={candidateName.trim()}
                    targetRole={targetRole.trim()}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default MockInterviewPage;
