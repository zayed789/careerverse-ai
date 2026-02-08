import { useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type RecordingStatus = 'ready' | 'recording' | 'completed';

interface AudioRecorderProps {
  onRecordingComplete: () => void;
}

const statusConfig: Record<RecordingStatus, { text: string; color: string }> = {
  ready: { text: 'Ready to record', color: 'text-muted-foreground' },
  recording: { text: 'Listening…', color: 'text-primary' },
  completed: { text: 'Recording completed', color: 'text-accent' },
};

const AudioRecorder = ({ onRecordingComplete }: AudioRecorderProps) => {
  const [status, setStatus] = useState<RecordingStatus>('ready');

  const handleStart = () => {
    setStatus('recording');
  };

  const handleStop = () => {
    setStatus('completed');
    onRecordingComplete();
  };

  return (
    <Card className="glass-card border-border/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Mic className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="text-base font-semibold text-muted-foreground uppercase tracking-wider">
            Audio Response
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 py-8">
        {/* Mic icon with pulse animation */}
        <div className="relative">
          <div
            className={cn(
              'w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300',
              status === 'recording'
                ? 'bg-primary/20'
                : status === 'completed'
                ? 'bg-accent/20'
                : 'bg-muted/50'
            )}
          >
            <Mic
              className={cn(
                'w-10 h-10 transition-colors duration-300',
                status === 'recording'
                  ? 'text-primary'
                  : status === 'completed'
                  ? 'text-accent'
                  : 'text-muted-foreground'
              )}
            />
          </div>
          {/* Pulse rings when recording */}
          {status === 'recording' && (
            <>
              <span className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping" />
              <span
                className="absolute inset-[-8px] rounded-full border border-primary/20 animate-ping"
                style={{ animationDelay: '0.5s' }}
              />
            </>
          )}
        </div>

        {/* Status text */}
        <p className={cn('text-sm font-medium transition-colors duration-300', statusConfig[status].color)}>
          {statusConfig[status].text}
        </p>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleStart}
            disabled={status === 'recording'}
            className="gap-2"
          >
            <Mic className="w-4 h-4" />
            Start Audio
          </Button>
          <Button
            onClick={handleStop}
            disabled={status !== 'recording'}
            variant="destructive"
            className="gap-2"
          >
            <Square className="w-4 h-4" />
            Stop Audio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioRecorder;
