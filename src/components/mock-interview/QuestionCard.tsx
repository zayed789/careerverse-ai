import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import type { InterviewQuestion } from './types';

interface QuestionCardProps {
  question: InterviewQuestion;
  currentIndex: number;
  totalQuestions: number;
}

/** Pick the best female voice available in the browser. */
function pickFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Preferred female voice name fragments, ordered by quality
  const preferred = [
    'samantha',
    'microsoft zira',
    'microsoft aria',
    'microsoft jenny',
    'google uk english female',
    'google us english female',
    'karen',
    'fiona',
    'moira',
    'tessa',
    'veena',
  ];

  for (const pref of preferred) {
    const match = voices.find((v) => v.name.toLowerCase().includes(pref));
    if (match) return match;
  }

  // Fallback: any English female-sounding voice, then first English voice
  const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
  const femaleGuess = englishVoices.find(
    (v) =>
      /female|woman/i.test(v.name) ||
      /samantha|zira|aria|jenny|karen|fiona|moira|tessa|veena|victoria|allison/i.test(v.name)
  );
  return femaleGuess || englishVoices[0] || voices[0];
}

const QuestionCard = ({ question, currentIndex = 1, totalQuestions = 5 }: QuestionCardProps) => {
  const spokenIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!question || spokenIdRef.current === question.id) return;

    spokenIdRef.current = question.id;
    speechSynthesis.cancel();

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(question.text);
      utterance.rate = 1.0;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voice = pickFemaleVoice();
      if (voice) utterance.voice = voice;

      speechSynthesis.speak(utterance);
    };

    if (speechSynthesis.getVoices().length > 0) {
      speak();
    } else {
      speechSynthesis.addEventListener('voiceschanged', speak, { once: true });
    }

    return () => {
      speechSynthesis.cancel();
    };
  }, [question]);

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
      <CardContent>
        <p className="text-xl font-medium leading-relaxed text-foreground">
          "{question.text}"
        </p>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
