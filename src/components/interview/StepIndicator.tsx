import { motion } from 'framer-motion';
import { Check, X, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

type RoundKey = 'screening' | 'technical' | 'scenario' | 'final';

interface StepIndicatorProps {
  currentRound: RoundKey;
  roundResults: Record<string, { passed?: boolean }>;
}

const steps: { key: RoundKey; label: string }[] = [
  { key: 'screening', label: 'Screening' },
  { key: 'technical', label: 'Technical' },
  { key: 'scenario', label: 'Scenario' },
  { key: 'final', label: 'Decision' },
];

const StepIndicator = ({ currentRound, roundResults }: StepIndicatorProps) => {
  const currentIndex = steps.findIndex((s) => s.key === currentRound);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 w-full max-w-2xl mx-auto mb-8">
      {steps.map((step, i) => {
        const result = roundResults[step.key];
        const isActive = step.key === currentRound;
        const isPast = i < currentIndex;
        const passed = result?.passed;
        const failed = result?.passed === false;

        return (
          <div key={step.key} className="flex items-center gap-1 sm:gap-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={cn(
                  'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  isActive && 'border-primary bg-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.4)]',
                  isPast && passed && 'border-emerald-500 bg-emerald-500/20',
                  failed && 'border-red-500 bg-red-500/20',
                  !isActive && !isPast && !failed && 'border-border/50 bg-secondary/30'
                )}
              >
                {isPast && passed ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : failed ? (
                  <X className="w-4 h-4 text-red-400" />
                ) : (
                  <span
                    className={cn(
                      'text-xs font-bold',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] sm:text-xs font-medium whitespace-nowrap',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </motion.div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-6 sm:w-12 rounded-full mt-[-18px]',
                  i < currentIndex
                    ? failed
                      ? 'bg-red-500/50'
                      : 'bg-emerald-500/50'
                    : 'bg-border/30'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
