import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, Download, User, Briefcase, GraduationCap, Code } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ResumeBuilderPage = () => {
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
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
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Build Your <span className="gradient-text">ATS-Optimized Resume</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Create a professional resume that passes applicant tracking systems
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 space-y-6"
          >
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" className="bg-secondary/50 mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" className="bg-secondary/50 mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" className="bg-secondary/50 mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+1 (555) 000-0000" className="bg-secondary/50 mt-1" />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-primary" />
                Skills
              </h3>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="bg-secondary/50"
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill} size="icon" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-3 py-1 rounded-full text-sm bg-primary/20 text-primary flex items-center gap-2"
                  >
                    {skill}
                    <button onClick={() => removeSkill(index)} className="hover:text-destructive transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-primary" />
                Experience
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Job Title</Label>
                  <Input placeholder="Software Engineer" className="bg-secondary/50 mt-1" />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input placeholder="Tech Company Inc." className="bg-secondary/50 mt-1" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe your responsibilities and achievements..."
                    className="bg-secondary/50 mt-1 min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-primary" />
                Education
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Degree</Label>
                  <Input placeholder="B.S. Computer Science" className="bg-secondary/50 mt-1" />
                </div>
                <div>
                  <Label>Institution</Label>
                  <Input placeholder="University Name" className="bg-secondary/50 mt-1" />
                </div>
              </div>
            </div>

            <Button className="w-full glow-button text-white border-0 h-12">
              <Download className="w-5 h-5 mr-2" />
              Generate & Download PDF
            </Button>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 bg-white/5"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Live Preview
              </h3>
              <span className="text-xs text-muted-foreground">ATS Score: 92%</span>
            </div>

            {/* Resume preview */}
            <div className="bg-white text-gray-900 rounded-lg p-6 min-h-[600px] shadow-xl">
              <div className="text-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
                <p className="text-gray-600 text-sm">john@example.com • +1 (555) 000-0000</p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Skills</h3>
                <p className="text-sm text-gray-700">{skills.join(' • ')}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Experience</h3>
                <div className="mb-3">
                  <p className="font-semibold text-gray-900">Software Engineer</p>
                  <p className="text-sm text-gray-600">Tech Company Inc. • 2022 - Present</p>
                  <p className="text-sm text-gray-700 mt-1">
                    Developed and maintained web applications using React and Node.js...
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Education</h3>
                <p className="font-semibold text-gray-900">B.S. Computer Science</p>
                <p className="text-sm text-gray-600">University Name • 2018 - 2022</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeBuilderPage;
