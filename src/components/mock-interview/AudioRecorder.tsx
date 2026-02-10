import { useState, useRef, useCallback } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type RecordingStatus = 'ready' | 'recording' | 'completed';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isEvaluating: boolean;
}

const statusConfig: Record<RecordingStatus, { text: string; color: string }> = {
  ready: { text: 'Ready to record', color: 'text-muted-foreground' },
  recording: { text: 'Listening…', color: 'text-primary' },
  completed: { text: 'Recording completed', color: 'text-accent' },
};

const AudioRecorder = ({ onRecordingComplete, isEvaluating }: AudioRecorderProps) => {
  const [status, setStatus] = useState<RecordingStatus>('ready');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleStart = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        onRecordingComplete(blob);
      };

      mediaRecorder.start();
      setStatus('recording');
    } catch {
      console.error('Microphone access denied');
    }
  }, [onRecordingComplete]);

  const handleStop = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setStatus('completed');
  }, []);

  const reset = useCallback(() => {
    setStatus('ready');
    chunksRef.current = [];
    mediaRecorderRef.current = null;
  }, []);

  // Expose reset via a stable ref pattern — parent calls it indirectly through key remount
  // (kept simple: parent remounts by changing key on question advance)

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
              isEvaluating
                ? 'bg-muted/50'
                : status === 'recording'
                ? 'bg-primary/20'
                : status === 'completed'
                ? 'bg-accent/20'
                : 'bg-muted/50'
            )}
          >
            {isEvaluating ? (
              <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
            ) : (
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
            )}
          </div>
          {/* Pulse rings when recording */}
          {status === 'recording' && !isEvaluating && (
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
        <p
          className={cn(
            'text-sm font-medium transition-colors duration-300',
            isEvaluating ? 'text-muted-foreground' : statusConfig[status].color
          )}
        >
          {isEvaluating ? 'Evaluating your response…' : statusConfig[status].text}
        </p>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleStart}
            disabled={status === 'recording' || isEvaluating}
            className="gap-2"
          >
            <Mic className="w-4 h-4" />
            Start Audio
          </Button>
          <Button
            onClick={handleStop}
            disabled={status !== 'recording' || isEvaluating}
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
