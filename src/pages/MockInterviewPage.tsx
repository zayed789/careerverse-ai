import { useState, useRef } from 'react';
import { Mic, Send, Loader2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
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
import type { InterviewRound, InterviewQuestion } from '@/components/mock-interview/types';

const AUDIO_WEBHOOK_URL = 'https://figo6788.app.n8n.cloud/webhook/audio-to-text';

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

const MockInterviewPage = () => {
  const { toast } = useToast();
  const [started, setStarted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Audio blob from recorder
  const audioBlobRef = useRef<Blob | null>(null);
  const [hasRecorded, setHasRecorded] = useState(false);

  // Session & interview progress state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState<InterviewRound>('screening');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Transcripts mapped by question id
  const [transcripts, setTranscripts] = useState<Record<string, string>>({});

  const currentQuestion = questions.length > 0 ? questions[currentQuestionIndex] : null;
  const isLastQuestion = currentQuestionIndex >= questions.length - 1;
  const currentTranscript = currentQuestion ? transcripts[currentQuestion.id] : undefined;

  const canBegin = candidateName.trim().length > 0 && targetRole.trim().length > 0;

  const handleBeginInterview = async () => {
    if (!canBegin || isStarting) return;

    setIsStarting(true);
    const newSessionId = generateSessionId();

    try {
      const response = await fetch('https://figo6788.app.n8n.cloud/webhook/screening', {
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

      const data = await response.json();
      const payload = Array.isArray(data) ? data[0] : data;
      const transcript = payload?.transcript || '';

      setTranscripts((prev) => ({ ...prev, [currentQuestion.id]: transcript }));
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

                      {/* Transcript display */}
                      {currentTranscript && (
                        <div className="glass-card border-border/30 p-4 rounded-xl">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Your Response (Transcript)
                          </p>
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {currentTranscript}
                          </p>
                        </div>
                      )}

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
