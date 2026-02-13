import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, TrendingUp, TrendingDown, ChevronRight, RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ScreeningResult } from './ScreeningResultCard';

interface ScreeningResultModalProps {
  result: ScreeningResult;
  open: boolean;
  onProceed: () => void;
  onRetake: () => void;
}

const ScreeningResultModal = ({ result, open, onProceed, onRetake }: ScreeningResultModalProps) => {
  const passed = result.passed;
  const score = result.overall_score;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-[700px] border-0 p-0 overflow-hidden rounded-2xl shadow-xl bg-transparent"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div
          className="relative p-8 rounded-2xl"
          style={{
            background: 'linear-gradient(145deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)',
            boxShadow: passed
              ? '0 0 40px -10px rgba(34,197,94,0.25), inset 0 1px 0 0 rgba(255,255,255,0.05)'
              : '0 0 40px -10px rgba(239,68,68,0.25), inset 0 1px 0 0 rgba(255,255,255,0.05)',
            border: `1px solid ${passed ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          }}
        >
          {/* Header */}
          <DialogHeader className="text-center mb-8">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Screening Round Results
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm mt-1">
              Evaluation Summary
            </DialogDescription>
          </DialogHeader>

          {/* Circular Score */}
          <div className="flex justify-center mb-8">
            <div
              className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center"
              style={{
                border: `3px solid ${passed ? 'rgba(34,197,94,0.7)' : 'rgba(239,68,68,0.7)'}`,
                boxShadow: passed
                  ? '0 0 30px -5px rgba(34,197,94,0.3)'
                  : '0 0 30px -5px rgba(239,68,68,0.3)',
                background: passed
                  ? 'rgba(34,197,94,0.05)'
                  : 'rgba(239,68,68,0.05)',
              }}
            >
              <span className="text-4xl font-bold text-foreground">{score}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
              <div className="mt-1 flex items-center gap-1">
                {passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                )}
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: passed ? 'rgb(34,197,94)' : 'rgb(239,68,68)' }}
                >
                  {passed ? 'PASSED' : 'NOT SELECTED'}
                </span>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
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
            {result.weaknesses.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Areas for Improvement
                  </p>
                </div>
                <ul className="space-y-1.5">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Reasoning */}
          {result.reasoning && (
            <div className="mb-8 rounded-xl p-4" style={{ background: 'hsl(var(--muted) / 0.4)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Interviewer Feedback
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed italic">
                {result.reasoning}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {passed ? (
              <Button
                className="w-full h-12 text-base gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg hover:shadow-blue-500/20 transition-all"
                onClick={onProceed}
              >
                Proceed to Technical Round
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="w-full">
                        <Button
                          className="w-full h-12 text-base cursor-not-allowed opacity-50"
                          disabled
                        >
                          Proceed to Technical Round
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>You must pass the screening round to proceed.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="outline"
                  className="w-full h-11 gap-2"
                  onClick={onRetake}
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Screening
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScreeningResultModal;
