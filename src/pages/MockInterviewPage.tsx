import { useState } from 'react';
import { Mic, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import QuestionCard from '@/components/mock-interview/QuestionCard';
import AudioRecorder from '@/components/mock-interview/AudioRecorder';
import CameraPreview from '@/components/mock-interview/CameraPreview';
import InterviewContextCard from '@/components/mock-interview/InterviewContextCard';

const MockInterviewPage = () => {
  const [started, setStarted] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [hasRecorded, setHasRecorded] = useState(false);

  const canBegin = candidateName.trim().length > 0 && targetRole.trim().length > 0;

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
                    disabled={!canBegin}
                    onClick={() => setStarted(true)}
                  >
                    Begin Interview
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
              <div className="mb-6 glass-card border-border/30 p-4 rounded-xl">
                <p className="text-lg font-medium text-foreground">
                  Hi {candidateName.trim()}, welcome to your mock interview 👋
                </p>
              </div>

              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left panel — Interview flow */}
                <div className="lg:col-span-2 space-y-6">
                  <QuestionCard />
                  <AudioRecorder onRecordingComplete={() => setHasRecorded(true)} />

                  {/* Submit button */}
                  <Button
                    disabled={!hasRecorded}
                    className="w-full gap-2 h-12 text-base"
                    size="lg"
                  >
                    <Send className="w-4 h-4" />
                    Submit Audio Answer
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
