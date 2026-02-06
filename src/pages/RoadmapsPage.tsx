import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Lock, ArrowRight, Briefcase, Award, BookOpen } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const roadmapSteps = [
  {
    week: 1,
    title: 'Foundations',
    status: 'completed',
    topics: ['HTML5 Semantics', 'CSS Flexbox & Grid', 'JavaScript Basics'],
    project: 'Personal Portfolio',
    milestone: true,
  },
  {
    week: 2,
    title: 'Advanced JavaScript',
    status: 'completed',
    topics: ['ES6+ Features', 'DOM Manipulation', 'Async/Await'],
    project: 'Interactive Quiz App',
    milestone: false,
  },
  {
    week: 3,
    title: 'React Fundamentals',
    status: 'current',
    topics: ['Components', 'Props & State', 'Hooks Basics'],
    project: 'Todo Application',
    milestone: true,
  },
  {
    week: 4,
    title: 'React Advanced',
    status: 'locked',
    topics: ['Context API', 'Custom Hooks', 'Performance'],
    project: 'E-commerce Frontend',
    milestone: false,
  },
  {
    week: 5,
    title: 'TypeScript',
    status: 'locked',
    topics: ['Types & Interfaces', 'Generics', 'React with TS'],
    project: 'Refactor Projects',
    milestone: false,
  },
  {
    week: 6,
    title: 'Backend Basics',
    status: 'locked',
    topics: ['Node.js', 'Express.js', 'REST APIs'],
    project: 'API Development',
    milestone: true,
  },
  {
    week: 7,
    title: 'Database',
    status: 'locked',
    topics: ['PostgreSQL', 'MongoDB', 'ORM (Prisma)'],
    project: 'Full-stack Blog',
    milestone: false,
  },
  {
    week: 8,
    title: 'Advanced Topics',
    status: 'locked',
    topics: ['Authentication', 'Testing', 'Deployment'],
    project: 'Complete SaaS MVP',
    milestone: true,
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    case 'current':
      return (
        <div className="relative">
          <Circle className="w-6 h-6 text-primary animate-pulse" />
          <div className="absolute inset-0 w-6 h-6 bg-primary rounded-full blur-md opacity-50 animate-pulse" />
        </div>
      );
    default:
      return <Lock className="w-6 h-6 text-muted-foreground/50" />;
  }
};

const RoadmapsPage = () => {
  return (
    <Layout>
      <div className="section-container py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Your <span className="gradient-text">Learning Roadmap</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A structured 8-week journey to become a Full Stack Developer
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-semibold gradient-text">25% Complete</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '25%' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-glow-gradient rounded-full"
            />
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-primary to-muted-foreground/20" />

          {roadmapSteps.map((step, index) => (
            <motion.div
              key={step.week}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-20 pb-12 last:pb-0"
            >
              {/* Status icon */}
              <div className="absolute left-5 top-0 bg-background p-1">
                {getStatusIcon(step.status)}
              </div>

              {/* Milestone badge */}
              {step.milestone && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                  className="absolute -left-2 top-0"
                >
                  <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                    <Award className="w-2.5 h-2.5 text-white" />
                  </div>
                </motion.div>
              )}

              {/* Card */}
              <div className={`feature-card ${step.status === 'locked' ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      Week {step.week}
                    </span>
                    <h3 className="text-xl font-bold mt-1">{step.title}</h3>
                  </div>
                  {step.status === 'current' && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                      In Progress
                    </span>
                  )}
                </div>

                {/* Topics */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {step.topics.map((topic) => (
                      <span key={topic} className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Project: </span>
                      <span className="font-medium">{step.project}</span>
                    </span>
                  </div>
                  {step.status !== 'locked' && (
                    <button className="flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all">
                      Start <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Jobs unlocked section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass-card p-8 max-w-4xl mx-auto"
        >
          <h3 className="text-xl font-bold mb-4">🎯 Jobs You'll Unlock</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Frontend Developer', 'React Developer', 'Full Stack Developer', 'Software Engineer'].map((job) => (
              <div key={job} className="p-4 bg-secondary/50 rounded-lg text-center">
                <span className="text-sm font-medium">{job}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default RoadmapsPage;
