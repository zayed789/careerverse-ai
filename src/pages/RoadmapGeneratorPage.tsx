import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Briefcase, Clock, Target, Building2, Loader2, Award, FolderGit2, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ROADMAP_WEBHOOK_URL = 'https://figo6788.app.n8n.cloud/webhook-test/roadmap-generator';

interface RoadmapPhase {
  phase: string;
  duration: string;
  title: string;
  skills: string[];
  certifications: string[];
  projects: string[];
}

const RoadmapGeneratorPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapPhases, setRoadmapPhases] = useState<RoadmapPhase[]>([]);
  const [error, setError] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [experience, setExperience] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [goalRole, setGoalRole] = useState('');
  const [previousCompanies, setPreviousCompanies] = useState('');

  const isFormValid = currentRole.trim() !== '' && experience.trim() !== '' && goalRole.trim() !== '';
  const roadmapGenerated = roadmapPhases.length > 0;

  const handleGenerate = async () => {
    if (isGenerating || !isFormValid) return;

    setIsGenerating(true);
    setError('');
    setRoadmapPhases([]);

    try {
      const response = await fetch(ROADMAP_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRole: currentRole,
          experience: experience,
          currentSkills: currentSkills,
          targetRole: goalRole,
          previousCompanies: previousCompanies,
        }),
      });

      if (!response.ok) {
        throw new Error('Webhook request failed');
      }

      const data = await response.json();

      // Handle n8n response format: [{"output": "<JSON string>"}]
      let roadmapData = data;
      if (Array.isArray(data) && data.length > 0 && typeof data[0]?.output === 'string') {
        roadmapData = JSON.parse(data[0].output);
      } else if (Array.isArray(data) && data.length > 0 && data[0]?.roadmap) {
        roadmapData = data[0];
      }

      if (roadmapData?.roadmap && Array.isArray(roadmapData.roadmap)) {
        setRoadmapPhases(roadmapData.roadmap);
        localStorage.setItem('careerverse_generated_roadmap', JSON.stringify(roadmapData.roadmap));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Unable to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setRoadmapPhases([]);
    setError('');
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
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
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
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
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
                    value={currentSkills}
                    onChange={(e) => setCurrentSkills(e.target.value)}
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
                    value={goalRole}
                    onChange={(e) => setGoalRole(e.target.value)}
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
                    value={previousCompanies}
                    onChange={(e) => setPreviousCompanies(e.target.value)}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !isFormValid}
                  className={`glow-button text-white border-0 h-12 mt-4 transition-all ${!isFormValid ? 'opacity-50 cursor-not-allowed !shadow-none' : ''}`}
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
              {/* Header */}
              <div className="glass-card p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-glow-gradient flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Your Personalized Roadmap</h3>
                  <p className="text-sm text-muted-foreground">Generated based on your profile</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative pl-8 sm:pl-12">
                {/* Dotted vertical line */}
                <div className="absolute left-[15px] sm:left-[23px] top-0 bottom-0 w-px border-l-2 border-dashed border-primary/40" />

                <div className="space-y-10">
                  {roadmapPhases.map((phase, index) => (
                    <motion.div
                      key={phase.phase + index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + index * 0.12, duration: 0.5 }}
                      className="relative"
                    >
                      {/* Timeline dot */}
                      <div className="absolute -left-8 sm:-left-12 top-1">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.12, type: 'spring', stiffness: 300 }}
                          className="w-[14px] h-[14px] rounded-full bg-primary border-2 border-background shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
                        />
                      </div>

                      {/* Phase card */}
                      <div className="glass-card p-5 sm:p-6 hover:border-primary/30 transition-colors">
                        {/* Phase label & time */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-primary/20 text-primary">
                            {phase.phase || `Phase ${index + 1}`}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {phase.duration}
                          </span>
                        </div>

                        <h4 className="text-lg font-bold mb-4">{phase.title}</h4>

                        {/* Skills */}
                        {phase.skills && phase.skills.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5 text-primary" />
                              Skills to Learn
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {phase.skills.map((skill) => (
                                <span key={skill} className="px-2.5 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/20">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Certifications */}
                        {phase.certifications && phase.certifications.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-amber-400" />
                              Certifications
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {phase.certifications.map((cert) => (
                                <span key={cert} className="px-2.5 py-1 text-xs rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Projects */}
                        {phase.projects && phase.projects.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                              Projects to Build
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {phase.projects.map((project) => (
                                <span key={project} className="px-2.5 py-1 text-xs rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  {project}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* End dot */}
                  <div className="relative">
                    <div className="absolute -left-8 sm:-left-12 top-0">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, type: 'spring', stiffness: 300 }}
                        className="w-[14px] h-[14px] rounded-full bg-emerald-400 border-2 border-background shadow-[0_0_10px_hsl(142_71%_45%/0.5)]"
                      />
                    </div>
                    <p className="text-sm font-semibold text-emerald-400">🎯 Goal Achieved — Ready for your target role!</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleReset}
                variant="outline"
                className="mt-2"
              >
                Generate New Roadmap
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RoadmapGeneratorPage;
