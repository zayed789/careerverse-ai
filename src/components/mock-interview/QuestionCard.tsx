import { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Play, Square, Volume2 } from 'lucide-react';
import type { InterviewQuestion } from './types';

interface QuestionCardProps {
  question: InterviewQuestion;
  currentIndex: number;
  totalQuestions: number;
  autoPlay?: boolean;
}

const QuestionCard = ({ question, currentIndex = 1, totalQuestions = 5, autoPlay = false }: QuestionCardProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playedAutoRef = useRef<string | null>(null);

  // Cleanup audio on unmount or question change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
    };
  }, [question?.id]);

  // Auto-play first question when interview starts
  useEffect(() => {
    if (autoPlay && question?.audio && playedAutoRef.current !== question.id) {
      playedAutoRef.current = question.id;
      playAudio();
    }
  }, [autoPlay, question?.id]);

  const playAudio = () => {
    if (!question?.audio) return;

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(`data:audio/mpeg;base64,${question.audio}`);
    audioRef.current = audio;

    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onpause = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);

    audio.play().catch(() => setIsPlaying(false));
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

  if (!question) return null;

  return (
    <Card className="glass-card border-border/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold text-muted-foreground uppercase tracking-wider">
              Current Question
            </CardTitle>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentIndex} of {totalQuestions}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xl font-medium leading-relaxed text-foreground">
          "{question.text}"
        </p>

        {question.audio && (
          <Button
            variant={isPlaying ? 'destructive' : 'outline'}
            className="gap-2"
            onClick={isPlaying ? stopAudio : playAudio}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4" />
                Stop Audio
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                Play Question
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
