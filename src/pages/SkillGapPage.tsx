import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, BarChart3, CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const mockResults = {
  matchScore: 72,
  matchedSkills: ['React', 'JavaScript', 'TypeScript', 'Git', 'REST APIs'],
  missingSkills: ['GraphQL', 'AWS', 'Docker', 'Kubernetes'],
  recommendations: [
    'Learn GraphQL to improve API skills',
    'Get AWS Cloud Practitioner certification',
    'Practice containerization with Docker',
    'Build projects using microservices architecture',
  ],
};

const SkillGapPage = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<typeof mockResults | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setResults(mockResults);
    }, 2500);
  };

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Skill Gap</span> Analyzer
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Compare your skills against job requirements and get personalized recommendations
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {!results ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Job Description Input */}
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Job Description
                </h3>
                <Textarea
                  placeholder="Paste the job description here, or upload a PDF/DOC file..."
                  className="bg-secondary/50 min-h-[200px] mb-4"
                />
                <div className="flex items-center justify-center p-6 border-2 border-dashed border-border/50 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Drop PDF/DOC here</p>
                  </div>
                </div>
              </div>

              {/* Your Skills Input */}
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Your Skills
                </h3>
                <Textarea
                  placeholder="List your skills (one per line or comma-separated)&#10;&#10;Example:&#10;React&#10;JavaScript&#10;TypeScript&#10;Node.js"
                  className="bg-secondary/50 min-h-[280px]"
                  defaultValue="React, JavaScript, TypeScript, Git, REST APIs, HTML, CSS, Node.js"
                />
              </div>

              <div className="md:col-span-2">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full glow-button text-white border-0 h-12"
                >
                  {isAnalyzing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analyze Skill Gap
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Match Score */}
              <div className="glass-card p-8 text-center">
                <h3 className="text-lg font-semibold mb-4">Skill Match Score</h3>
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      className="fill-none stroke-secondary"
                      strokeWidth="12"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      className="fill-none stroke-primary"
                      strokeWidth="12"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '0 440' }}
                      animate={{ strokeDasharray: `${results.matchScore * 4.4} 440` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold gradient-text">{results.matchScore}%</span>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {results.matchScore >= 80 ? 'Excellent match!' : results.matchScore >= 60 ? 'Good match with room to improve' : 'Some skills need development'}
                </p>
              </div>

              {/* Skills Analysis */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Matched Skills */}
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Matched Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.matchedSkills.map((skill) => (
                      <motion.span
                        key={skill}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    Missing Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.missingSkills.map((skill) => (
                      <motion.span
                        key={skill}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 rounded-full text-sm bg-red-500/20 text-red-400"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  Recommendations
                </h3>
                <ul className="space-y-3">
                  {results.recommendations.map((rec, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg"
                    >
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span>{rec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <Button onClick={() => setResults(null)} variant="outline" className="w-full">
                Analyze Another Job
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SkillGapPage;
