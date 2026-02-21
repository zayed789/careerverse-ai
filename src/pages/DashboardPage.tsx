import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Brain, FileText, Target, Mic, Flame,
  TrendingUp, AlertTriangle, CheckCircle, Clock,
  BarChart3, Zap, ShieldCheck, BookOpen
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAppContext } from '@/contexts/AppContext';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';

const streak = 0;
const weeklyActiveDays = 0;

const riskColors: Record<string, string> = {
  Low: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  High: 'text-red-400 bg-red-400/10 border-red-400/30',
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const GaugeChart = ({ score }: { score: number }) => {
  const radius = 80;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" strokeLinecap="round" />
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none" stroke="url(#gaugeGradient)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--gradient-start))" />
            <stop offset="100%" stopColor="hsl(var(--gradient-end))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute bottom-2 text-center">
        <motion.span className="text-4xl font-bold gradient-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          {score}
        </motion.span>
        <p className="text-xs text-muted-foreground mt-1">out of 100</p>
      </div>
    </div>
  );
};

const MetricCard = ({
  icon: Icon, title, metrics, delay = 0, onClick,
}: {
  icon: React.ElementType;
  title: string;
  metrics: { label: string; value: string | number; highlight?: boolean }[];
  delay?: number;
  onClick?: () => void;
}) => (
  <motion.div
    {...fadeUp}
    transition={{ delay }}
    className={`glass-card p-5 card-hover ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h3 className="font-semibold text-sm">{title}</h3>
    </div>
    <div className="space-y-3">
      {metrics.map((m) => (
        <div key={m.label} className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{m.label}</span>
          <span className={`text-sm font-semibold ${m.highlight ? 'gradient-text' : ''}`}>{m.value}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

const chartTooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
};

const DashboardPage = () => {
  const { scores, readiness } = useAppContext();
  const navigate = useNavigate();

  const riskStatus = readiness >= 75 ? 'Low' : readiness >= 50 ? 'Medium' : 'High';

  return (
    <Layout>
      <div className="section-container py-8">
        {/* Header */}
        <motion.div {...fadeUp} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="gradient-text">Placement Intelligence</span> Dashboard
          </h1>
          <p className="text-muted-foreground">
            Unified view of your career readiness and preparation metrics
          </p>
        </motion.div>

        {/* Top Section – Career Readiness Overview */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Career Readiness Index
              </h2>
              <GaugeChart score={readiness} />
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <div className={`px-4 py-2 rounded-lg border text-sm font-medium ${riskColors[riskStatus]}`}>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Risk: {riskStatus}
                </div>
              </div>
              <div className="glass-card px-4 py-3 text-center">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Flame className="w-4 h-4" />
                  <span className="text-lg font-bold">{streak}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">Day Streak</p>
              </div>
              <div className="glass-card px-4 py-3 text-center">
                <div className="flex items-center gap-1.5 text-primary">
                  <Clock className="w-4 h-4" />
                  <span className="text-lg font-bold">{weeklyActiveDays}/7</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">Active Days</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Breakdown Grid */}
        <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="mb-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Performance Breakdown
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <MetricCard
            icon={Brain} title="DSA Performance" delay={0.2}
            onClick={() => navigate('/puzzles')}
            metrics={[
              { label: 'DSA Score', value: `${scores.dsa}/100`, highlight: true },
            ]}
          />
          <MetricCard
            icon={Zap} title="Aptitude Performance" delay={0.25}
            onClick={() => navigate('/quiz')}
            metrics={[
              { label: 'Aptitude Score', value: `${scores.aptitude}/100`, highlight: true },
            ]}
          />
          <MetricCard
            icon={FileText} title="Resume Optimization" delay={0.3}
            onClick={() => navigate('/resume-builder')}
            metrics={[
              { label: 'ATS Score', value: `${scores.ats}/100`, highlight: true },
            ]}
          />
          <MetricCard
            icon={Target} title="Skill Gap Analysis" delay={0.35}
            onClick={() => navigate('/skill-gap')}
            metrics={[
              { label: 'Alignment Score', value: `${scores.skillGap}/100`, highlight: true },
            ]}
          />
          <MetricCard
            icon={Mic} title="Interview Performance" delay={0.4}
            onClick={() => navigate('/mock-interview')}
            metrics={[
              { label: 'Interview Score', value: `${scores.interview}/100`, highlight: true },
            ]}
          />
          <MetricCard
            icon={Activity} title="Consistency Metrics" delay={0.45}
            onClick={() => navigate('/planner')}
            metrics={[
              { label: 'Active Days (week)', value: `${weeklyActiveDays}/7` },
              { label: 'Current Streak', value: `${streak} days` },
              { label: 'Consistency Score', value: `${scores.consistency}/100`, highlight: true },
            ]}
          />
        </div>

        {/* Trend Analytics */}
        <motion.div {...fadeUp} transition={{ delay: 0.5 }} className="mb-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Trend Analytics
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <motion.div {...fadeUp} transition={{ delay: 0.55 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-4">Current Scores Overview</h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'DSA', value: scores.dsa },
                  { name: 'Aptitude', value: scores.aptitude },
                  { name: 'ATS', value: scores.ats },
                  { name: 'Skill Gap', value: scores.skillGap },
                  { name: 'Interview', value: scores.interview },
                  { name: 'Consistency', value: scores.consistency },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 100]} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="value" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
