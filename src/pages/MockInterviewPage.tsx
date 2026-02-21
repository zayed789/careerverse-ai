import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Loader2, ChevronRight, ClipboardCheck } from 'lucide-react';
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

const AUDIO_WEBHOOK_URL = 'https://testcase6788.app.n8n.cloud/webhook/audio-to-text';
const SCREENING_EVALUATE_URL = 'https://testcase6788.app.n8n.cloud/webhook/screening_evaluate';

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

const MockInterviewPage = () => {
  const { toast } = useToast();
  const { updateScore } = useAppContext();
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
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
  const [candidateName, setCandidateName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Screening evaluation state
  const [isEvaluatingScreening, setIsEvaluatingScreening] = useState(false);
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);

  // Audio blob from recorder
  const audioBlobRef = useRef<Blob | null>(null);
  const [hasRecorded, setHasRecorded] = useState(false);

  // Session & interview progress state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState<InterviewRound>('screening');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Track which questions have been submitted
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<string>>(new Set());

  const currentQuestion = questions.length > 0 ? questions[currentQuestionIndex] : null;
  const isLastQuestion = currentQuestionIndex >= questions.length - 1;

  const canBegin = candidateName.trim().length > 0 && targetRole.trim().length > 0;

  const handleBeginInterview = async () => {
    if (!canBegin || isStarting) return;

    setIsStarting(true);
    const newSessionId = generateSessionId();

    try {
      const response = await fetch('https://testcase6788.app.n8n.cloud/webhook/screening', {
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

  const handleSubmit = async () => {
    if (!audioBlobRef.current || !currentQuestion || !sessionId) return;

    setIsEvaluating(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlobRef.current, 'recording.webm');
      formData.append('session_id', sessionId);
      formData.append('candidate_name', candidateName.trim());
      formData.append('target_role', targetRole.trim());
      formData.append('round', 'screening');
      formData.append('question_id', currentQuestion.id);
      formData.append('question_text', currentQuestion.text);

      const response = await fetch(AUDIO_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`);
      }

      setSubmittedQuestions((prev) => new Set(prev).add(currentQuestion.id));
    } catch (error) {
      console.error('Audio webhook error:', error);
      toast({
        title: 'Submission failed',
        description: 'Could not process your audio. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((i) => i + 1);
    // Reset recording state for next question
    setHasRecorded(false);
    audioBlobRef.current = null;
  };

  const handleSubmitScreening = async () => {
    if (!sessionId || isEvaluatingScreening) return;

    setIsEvaluatingScreening(true);
    try {
      const response = await fetch(SCREENING_EVALUATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          round: 'screening',
        }),
      });

      if (!response.ok) throw new Error(`Webhook returned ${response.status}`);

      const data = await response.json();
      const payload = Array.isArray(data) ? data[0] : data;
      const result: ScreeningResult = {
        overall_score: payload?.overall_score ?? 0,
        strengths: payload?.strengths ?? [],
        weaknesses: payload?.weaknesses ?? [],
        passed: payload?.passed ?? false,
        reasoning: payload?.reasoning ?? '',
      };

      setScreeningResult(result);
      // Update interview score in database
      updateScore('interview', result.overall_score);

      // Persist full interview results to DB
      if (user) {
        await supabase
          .from('user_metrics')
          .update({
            interview_score: result.overall_score,
            interview_feedback: result.reasoning || '',
            interview_round_data: {
              strengths: result.strengths,
              weaknesses: result.weaknesses,
              passed: result.passed,
            },
          } as any)
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Screening evaluate error:', error);
      toast({
        title: 'Evaluation failed',
        description: 'Could not evaluate screening round. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsEvaluatingScreening(false);
    }
  };

  // Derived: show screening submit button on last question after audio submitted
  const showScreeningSubmit =
    isLastQuestion && currentQuestion && submittedQuestions.has(currentQuestion.id);

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
                      />




                      <Button
                        variant="outline"
                        className="w-full gap-2 h-11"
                        disabled={isLastQuestion || isEvaluating}
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
                    isEvaluating={isEvaluating}
                  />

                  {/* Submit button */}
                  <Button
                    disabled={!hasRecorded || isEvaluating}
                    className="w-full gap-2 h-12 text-base"
                    size="lg"
                    onClick={handleSubmit}
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Evaluating…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Audio Answer
                      </>
                    )}
                   </Button>

                    {/* Submit Screening Round button — only on last question after transcript */}
                    {showScreeningSubmit && !screeningResult && (
                      <Button
                        disabled={isEvaluatingScreening}
                        className="w-full gap-2 h-12 text-base bg-gradient-to-r from-primary to-primary/80"
                        size="lg"
                        onClick={handleSubmitScreening}
                      >
                        {isEvaluatingScreening ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Evaluating…
                          </>
                        ) : (
                          <>
                            <ClipboardCheck className="w-4 h-4" />
                            Submit Screening Round
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
                          setSubmittedQuestions(new Set());
                          audioBlobRef.current = null;
                        }}
                        onRetake={() => {
                          setScreeningResult(null);
                        }}
                      />
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
