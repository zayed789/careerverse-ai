import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, TrendingUp, TrendingDown } from 'lucide-react';

export interface ScreeningResult {
  overall_score: number;
  strengths: string[];
  weaknesses: string[];
  passed: boolean;
  reasoning: string;
}

interface ScreeningResultCardProps {
  result: ScreeningResult;
}

const ScreeningResultCard = ({ result }: ScreeningResultCardProps) => {
  return (
    <Card className="glass-card border-border/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Screening Result</CardTitle>
          <Badge
            variant={result.passed ? 'default' : 'destructive'}
            className="gap-1.5 text-sm px-3 py-1"
          >
            {result.passed ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            {result.passed ? 'Passed' : 'Not Passed'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Score */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Score
          </p>
          <p className="text-3xl font-bold text-foreground">
            {result.overall_score}
            <span className="text-base font-normal text-muted-foreground">/100</span>
          </p>
        </div>

        {/* Strengths */}
        {result.strengths.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Strengths
              </p>
            </div>
            <ul className="space-y-1.5">
              {result.strengths.map((s, i) => (
                <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {result.weaknesses.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Areas for Improvement
              </p>
            </div>
            <ul className="space-y-1.5">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reasoning */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Reasoning
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed">{result.reasoning}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScreeningResultCard;
