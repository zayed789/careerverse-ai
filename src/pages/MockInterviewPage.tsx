import { useState } from 'react';
import { Mic, Send } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import QuestionCard from '@/components/mock-interview/QuestionCard';
import AudioRecorder from '@/components/mock-interview/AudioRecorder';
import CameraPreview from '@/components/mock-interview/CameraPreview';
import InterviewContextCard from '@/components/mock-interview/InterviewContextCard';

const MockInterviewPage = () => {
  const [hasRecorded, setHasRecorded] = useState(false);

  return (
    <Layout>
      <div className="section-container py-10">
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
            <InterviewContextCard />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MockInterviewPage;
