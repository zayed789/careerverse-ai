import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, User, Briefcase, GraduationCap, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ResumeData } from './types';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const ResumeForm = ({ data, onChange }: ResumeFormProps) => {
  const [newSkill, setNewSkill] = useState('');

  const update = (field: keyof ResumeData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      onChange({ ...data, skills: [...data.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    onChange({ ...data, skills: data.skills.filter((_, i) => i !== index) });
  };

  return (
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
              <Input
                id="firstName"
                placeholder="John"
                className="bg-secondary/50 mt-1"
                value={data.firstName}
                onChange={(e) => update('firstName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="bg-secondary/50 mt-1"
                value={data.lastName}
                onChange={(e) => update('lastName', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="bg-secondary/50 mt-1"
              value={data.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="+1 (555) 000-0000"
              className="bg-secondary/50 mt-1"
              value={data.phone}
              onChange={(e) => update('phone', e.target.value)}
            />
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
          {data.skills.map((skill, index) => (
            <motion.span
              key={`${skill}-${index}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 rounded-full text-sm bg-primary/20 text-primary flex items-center gap-2"
            >
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="hover:text-destructive transition-colors"
              >
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
            <Input
              placeholder="Software Engineer"
              className="bg-secondary/50 mt-1"
              value={data.jobTitle}
              onChange={(e) => update('jobTitle', e.target.value)}
            />
          </div>
          <div>
            <Label>Company</Label>
            <Input
              placeholder="Tech Company Inc."
              className="bg-secondary/50 mt-1"
              value={data.company}
              onChange={(e) => update('company', e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              placeholder="Describe your responsibilities and achievements..."
              className="bg-secondary/50 mt-1 min-h-[100px]"
              value={data.experienceDescription}
              onChange={(e) => update('experienceDescription', e.target.value)}
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
            <Input
              placeholder="B.S. Computer Science"
              className="bg-secondary/50 mt-1"
              value={data.degree}
              onChange={(e) => update('degree', e.target.value)}
            />
          </div>
          <div>
            <Label>Institution</Label>
            <Input
              placeholder="University Name"
              className="bg-secondary/50 mt-1"
              value={data.institution}
              onChange={(e) => update('institution', e.target.value)}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeForm;
