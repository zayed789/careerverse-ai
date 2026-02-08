import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

const QuestionCard = () => {
  return (
    <Card className="glass-card border-border/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="text-base font-semibold text-muted-foreground uppercase tracking-wider">
            Current Question
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-medium leading-relaxed text-foreground">
          "Tell me about yourself and why you're interested in this role."
        </p>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
