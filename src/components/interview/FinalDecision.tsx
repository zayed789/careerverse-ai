import { motion } from 'framer-motion';
import {
  Trophy,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinalDecisionProps {
  data: {
    decision?: string;
    overall_score?: number;
    strengths?: string[];
    weaknesses?: string[];
    recommendation?: string;
  };
}

const FinalDecision = ({ data }: FinalDecisionProps) => {
  const decision = (data.decision || '').toLowerCase();
  const isHire = decision === 'hire';
  const isHold = decision === 'hold';

  const decisionConfig = isHire
    ? {
        icon: Trophy,
        color: 'text-emerald-400',
        border: 'border-emerald-500/30',
        bg: 'bg-emerald-500/10',
        glow: 'shadow-[0_0_30px_hsl(142,70%,45%,0.15)]',
        label: 'HIRE',
      }
    : isHold
    ? {
        icon: Clock,
        color: 'text-amber-400',
        border: 'border-amber-500/30',
        bg: 'bg-amber-500/10',
        glow: 'shadow-[0_0_30px_hsl(45,70%,50%,0.15)]',
        label: 'HOLD',
      }
    : {
        icon: XCircle,
        color: 'text-red-400',
        border: 'border-red-500/30',
        bg: 'bg-red-500/10',
        glow: 'shadow-[0_0_30px_hsl(0,70%,50%,0.15)]',
        label: 'REJECT',
      };

  const Icon = decisionConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Decision Card */}
      <div
        className={cn(
          'rounded-2xl border p-8 backdrop-blur-xl text-center',
          decisionConfig.border,
          decisionConfig.bg,
          decisionConfig.glow
        )}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <Icon className={cn('w-16 h-16 mx-auto mb-4', decisionConfig.color)} />
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Final Interview Decision
        </h2>
        <div
          className={cn(
            'inline-block px-6 py-2 rounded-full text-lg font-bold tracking-wider',
            decisionConfig.bg,
            decisionConfig.color,
            'border',
            decisionConfig.border
          )}
        >
          {decisionConfig.label}
        </div>

        {data.overall_score !== undefined && (
          <div className="mt-6">
            <span className="text-sm text-muted-foreground">Overall Score</span>
            <p className="text-4xl font-bold text-foreground">
              {data.overall_score}
              <span className="text-lg text-muted-foreground"> / 100</span>
            </p>
          </div>
        )}
      </div>

      {/* Strengths */}
      {data.strengths && data.strengths.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-foreground">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {data.strengths.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Weaknesses */}
      {data.weaknesses && data.weaknesses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-bold text-foreground">Weaknesses</h3>
          </div>
          <ul className="space-y-2">
            {data.weaknesses.map((w, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Recommendation */}
      {data.recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">
              Recommendation
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {data.recommendation}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FinalDecision;
