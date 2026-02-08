import { cn } from '@/lib/utils';
import { INTERVIEW_ROUNDS, type InterviewRound } from './types';

interface RoundIndicatorProps {
  currentRound: InterviewRound;
}

const RoundIndicator = ({ currentRound }: RoundIndicatorProps) => {
  const currentIndex = INTERVIEW_ROUNDS.findIndex((r) => r.key === currentRound);

  return (
    <div className="flex items-center justify-center gap-0">
      {INTERVIEW_ROUNDS.map((round, index) => {
        const isActive = index === currentIndex;
        const isPast = index < currentIndex;
        const isLast = index === INTERVIEW_ROUNDS.length - 1;

        return (
          <div key={round.key} className="flex items-center">
            {/* Step dot + label */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'w-2.5 h-2.5 rounded-full shrink-0 transition-colors duration-300',
                  isActive && 'bg-primary shadow-[0_0_8px_hsl(var(--glow-primary)/0.6)]',
                  isPast && 'bg-primary/50',
                  !isActive && !isPast && 'bg-muted-foreground/30'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium whitespace-nowrap transition-colors duration-300',
                  isActive && 'text-primary',
                  isPast && 'text-muted-foreground',
                  !isActive && !isPast && 'text-muted-foreground/50'
                )}
              >
                {round.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  'w-8 h-px mx-2 transition-colors duration-300',
                  index < currentIndex ? 'bg-primary/40' : 'bg-muted-foreground/20'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RoundIndicator;
