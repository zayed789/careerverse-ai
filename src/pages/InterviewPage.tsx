import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import StepIndicator from '@/components/interview/StepIndicator';
import InterviewSetup from '@/components/interview/InterviewSetup';
import ScreeningRound from '@/components/interview/ScreeningRound';
import TechnicalRound from '@/components/interview/TechnicalRound';
import ScenarioRound from '@/components/interview/ScenarioRound';
import FinalDecision from '@/components/interview/FinalDecision';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { WEBHOOK_URLS } from '@/lib/interviewWebhooks';

type RoundKey = 'setup' | 'screening' | 'technical' | 'scenario' | 'final';

interface ScreeningQuestion {
  id: number;
  question: string;
}

const InterviewPage = () => {
  const [currentRound, setCurrentRound] = useState<RoundKey>('setup');
  const [sessionId, setSessionId] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [roundResults, setRoundResults] = useState<Record<string, { passed?: boolean }>>({});
  const [finalData, setFinalData] = useState<Record<string, unknown> | null>(null);
  const [interviewEnded, setInterviewEnded] = useState(false);

  // Dynamic screening data from the start webhook
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [screeningQuestions, setScreeningQuestions] = useState<ScreeningQuestion[]>([]);
  const [startError, setStartError] = useState('');

  const handleStart = async (name: string, role: string) => {
    setCandidateName(name);
    setTargetRole(role);
    setStartError('');

    const payload = {
      candidate_name: name,
      target_role: role,
      round: 'screening',
    };

    try {
      const res = await fetch(WEBHOOK_URLS.start, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to start interview');
      const raw = await res.json();
      const data = Array.isArray(raw) ? raw[0] : raw;

      setSessionId(data.session_id || '');
      setWelcomeMessage(data.welcome_message || '');
      setScreeningQuestions(data.questions || []);
      setCurrentRound('screening');
    } catch {
      setStartError('Something went wrong starting the interview. Please try again.');
    }
  };

  const handleScreeningResult = (result: { passed: boolean; [k: string]: unknown }) => {
    setRoundResults((prev) => ({ ...prev, screening: result }));
    if (result.passed) {
      setTimeout(() => setCurrentRound('technical'), 2000);
    } else {
      setInterviewEnded(true);
    }
  };

  const handleTechnicalResult = (result: { passed: boolean; [k: string]: unknown }) => {
    setRoundResults((prev) => ({ ...prev, technical: result }));
    if (result.passed) {
      setTimeout(() => setCurrentRound('scenario'), 2000);
    } else {
      setInterviewEnded(true);
    }
  };

  const handleScenarioResult = (result: { passed: boolean; [k: string]: unknown }) => {
    setRoundResults((prev) => ({ ...prev, scenario: result }));
    setFinalData(result as Record<string, unknown>);
    setTimeout(() => setCurrentRound('final'), 2000);
  };

  const handleRestart = () => {
    setCurrentRound('setup');
    setSessionId('');
    setCandidateName('');
    setTargetRole('');
    setRoundResults({});
    setFinalData(null);
    setInterviewEnded(false);
    setWelcomeMessage('');
    setScreeningQuestions([]);
    setStartError('');
  };

  const stepRound = currentRound === 'setup' ? 'screening' : currentRound;

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Multi-Round Interview
          </h1>
          <p className="text-muted-foreground text-sm">
            AI-powered interview simulation with real-time evaluation
          </p>
        </motion.div>

        {currentRound !== 'setup' && (
          <StepIndicator
            currentRound={stepRound as 'screening' | 'technical' | 'scenario' | 'final'}
            roundResults={roundResults}
          />
        )}

        <AnimatePresence mode="wait">
          {currentRound === 'setup' && (
            <motion.div key="setup" exit={{ opacity: 0, y: -20 }}>
              <InterviewSetup onStart={handleStart} error={startError} />
            </motion.div>
          )}

          {currentRound === 'screening' && (
            <motion.div key="screening" exit={{ opacity: 0, y: -20 }}>
              <ScreeningRound
                sessionId={sessionId}
                candidateName={candidateName}
                targetRole={targetRole}
                welcomeMessage={welcomeMessage}
                questions={screeningQuestions}
                onResult={handleScreeningResult}
              />
            </motion.div>
          )}

          {currentRound === 'technical' && (
            <motion.div key="technical" exit={{ opacity: 0, y: -20 }}>
              <TechnicalRound
                sessionId={sessionId}
                targetRole={targetRole}
                onResult={handleTechnicalResult}
              />
            </motion.div>
          )}

          {currentRound === 'scenario' && (
            <motion.div key="scenario" exit={{ opacity: 0, y: -20 }}>
              <ScenarioRound
                sessionId={sessionId}
                targetRole={targetRole}
                onResult={handleScenarioResult}
              />
            </motion.div>
          )}

          {currentRound === 'final' && finalData && (
            <motion.div key="final" exit={{ opacity: 0, y: -20 }}>
              <FinalDecision data={finalData as any} />
            </motion.div>
          )}
        </AnimatePresence>

        {interviewEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <Button
              onClick={handleRestart}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Start New Interview
            </Button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default InterviewPage;
