import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Briefcase, Clock, Target, Building2, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const RoadmapGeneratorPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setRoadmapGenerated(true);
    }, 3000);
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
            <span className="text-sm font-medium">AI-Powered</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Generate Your <span className="gradient-text">Personalized Roadmap</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Tell us about your experience and goals, and our AI will create a customized learning path
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {!roadmapGenerated ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8"
            >
              <div className="grid gap-6">
                {/* Current Role */}
                <div className="grid gap-2">
                  <Label htmlFor="role" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    Current Role
                  </Label>
                  <Input
                    id="role"
                    placeholder="e.g., Junior Developer, Student, Career Switcher"
                    className="bg-secondary/50"
                  />
                </div>

                {/* Experience */}
                <div className="grid gap-2">
                  <Label htmlFor="experience" className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Years of Experience
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="e.g., 2"
                    className="bg-secondary/50"
                  />
                </div>

                {/* Skills */}
                <div className="grid gap-2">
                  <Label htmlFor="skills" className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Current Skills
                  </Label>
                  <Textarea
                    id="skills"
                    placeholder="e.g., HTML, CSS, JavaScript basics, Git..."
                    className="bg-secondary/50 min-h-[100px]"
                  />
                </div>

                {/* Goal Role */}
                <div className="grid gap-2">
                  <Label htmlFor="goal" className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Target Role
                  </Label>
                  <Input
                    id="goal"
                    placeholder="e.g., Senior Full Stack Developer"
                    className="bg-secondary/50"
                  />
                </div>

                {/* Previous Companies */}
                <div className="grid gap-2">
                  <Label htmlFor="companies" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    Previous Companies (Optional)
                  </Label>
                  <Input
                    id="companies"
                    placeholder="e.g., Startup, Freelance, Acme Corp"
                    className="bg-secondary/50"
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="glow-button text-white border-0 h-12 mt-4"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Your Roadmap...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Personalized Roadmap
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
              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-glow-gradient flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Your Personalized Roadmap</h3>
                    <p className="text-sm text-muted-foreground">Generated based on your profile</p>
                  </div>
                </div>

                {/* Generated roadmap preview */}
                <div className="space-y-4">
                  {[
                    { phase: 'Phase 1 (Month 1-2)', title: 'Foundation Strengthening', skills: ['Advanced JavaScript', 'TypeScript', 'React Deep Dive'] },
                    { phase: 'Phase 2 (Month 3-4)', title: 'Backend Mastery', skills: ['Node.js Advanced', 'PostgreSQL', 'System Design'] },
                    { phase: 'Phase 3 (Month 5-6)', title: 'Senior Skills', skills: ['Architecture Patterns', 'Team Leadership', 'Technical Interviews'] },
                  ].map((phase, index) => (
                    <motion.div
                      key={phase.phase}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="p-4 bg-secondary/30 rounded-lg"
                    >
                      <span className="text-xs font-semibold text-primary">{phase.phase}</span>
                      <h4 className="font-semibold mt-1 mb-2">{phase.title}</h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.skills.map((skill) => (
                          <span key={skill} className="px-2 py-1 text-xs rounded bg-primary/20 text-primary">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={() => setRoadmapGenerated(false)}
                  variant="outline"
                  className="mt-6"
                >
                  Generate New Roadmap
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RoadmapGeneratorPage;
