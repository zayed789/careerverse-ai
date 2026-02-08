import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import type { InterviewQuestion } from './types';

interface QuestionCardProps {
  question: InterviewQuestion;
  currentIndex: number;
  totalQuestions: number;
}

const QuestionCard = ({ question, currentIndex = 1, totalQuestions = 5 }: QuestionCardProps) => {
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
