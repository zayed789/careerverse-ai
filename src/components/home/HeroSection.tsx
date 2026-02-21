import { motion } from 'framer-motion';
import { ArrowRight, LayoutDashboard, ClipboardEdit, Sparkles, Flame, Code2, Brain, FileCheck, Users, BookOpen, BarChart3, Shield, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FloatingElements from './FloatingElements';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <FloatingElements />

      <div className="relative z-10 section-container py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              AI-Powered Placement Intelligence
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Track Your{' '}
            <span className="gradient-text-bright">Placement Readiness</span>
            <br />
            with Intelligence
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            A centralized platform to monitor DSA, Aptitude, Resume, and Interview
            preparation with a unified Career Readiness Index and risk detection system.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/domains">
              <Button size="lg" className="glow-button text-white border-0 h-12 px-8 text-base">
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/planner">
              <Button size="lg" variant="outline" className="glow-button-secondary h-12 px-8 text-base">
                <ClipboardEdit className="w-5 h-5 mr-2" />
                Start Logging Activity
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Metric Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto"
        >
          {[
            { label: 'Career Readiness Index', value: '—', icon: Award, accent: true },
            { label: 'Current Streak', value: '0 days', icon: Flame },
            { label: 'DSA Score', value: '—', icon: Code2 },
            { label: 'Aptitude Score', value: '—', icon: Brain },
            { label: 'Resume ATS Score', value: '—', icon: FileCheck },
            { label: 'Interview Readiness', value: '—', icon: Users },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
              className={`glass-card p-4 text-center ${stat.accent ? 'border-primary/30' : ''}`}
            >
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.accent ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className={`text-2xl font-bold mb-1 ${stat.accent ? 'gradient-text' : 'text-foreground'}`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-24 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-12 gradient-text">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Log Daily Preparation', icon: BookOpen, desc: 'Track DSA, aptitude & interview practice daily.' },
              { step: '02', title: 'AI Analyzes Performance', icon: BarChart3, desc: 'Agents evaluate your strengths & weak areas.' },
              { step: '03', title: 'Risk & Consistency Tracking', icon: Shield, desc: 'Detect gaps and maintain preparation streaks.' },
              { step: '04', title: 'Unified Readiness Score', icon: Award, desc: 'Get a single placement readiness index.' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.15, duration: 0.6 }}
                className="glass-card p-6 text-center card-hover"
              >
                <div className="text-xs font-mono text-primary/60 mb-3">{item.step}</div>
                <item.icon className="w-8 h-8 mx-auto mb-3 text-primary/80" />
                <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
