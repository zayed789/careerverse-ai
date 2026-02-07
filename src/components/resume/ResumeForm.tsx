import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Trash2, User, Briefcase, GraduationCap, Code,
  FileText, FolderOpen, Award, BookOpen, Linkedin, Github,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type {
  ResumeData, SkillCategory, ProjectEntry,
  ExperienceEntry, EducationEntry, CertificationEntry,
} from './types';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

/* ── tiny reusable tag-input ── */
const TagInput = ({
  tags,
  onChange,
  placeholder = 'Add…',
}: {
  tags: string[];
  onChange: (t: string[]) => void;
  placeholder?: string;
}) => {
  const [value, setValue] = useState('');
  const add = () => {
    if (value.trim()) {
      onChange([...tags, value.trim()]);
      setValue('');
    }
  };
  return (
    <>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="bg-secondary/50"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
        />
        <Button onClick={add} size="icon" variant="outline" type="button">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((t, i) => (
            <motion.span
              key={`${t}-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 rounded-full text-sm bg-primary/20 text-primary flex items-center gap-2"
            >
              {t}
              <button
                type="button"
                onClick={() => onChange(tags.filter((_, idx) => idx !== i))}
                className="hover:text-destructive transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </div>
      )}
    </>
  );
};

/* ── section heading ── */
const SectionHeading = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
    <Icon className="w-5 h-5 text-primary" />
    {title}
  </h3>
);

const ResumeForm = ({ data, onChange }: ResumeFormProps) => {
  const update = (field: keyof ResumeData, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  /* ── skill-category helpers ── */
  const updateSkillCategory = (idx: number, skills: string[]) => {
    const cats = [...data.skillCategories];
    cats[idx] = { ...cats[idx], skills };
    update('skillCategories', cats);
  };
  const addSkillCategory = () => {
    update('skillCategories', [
      ...data.skillCategories,
      { category: '', skills: [] } as SkillCategory,
    ]);
  };
  const removeSkillCategory = (idx: number) => {
    update('skillCategories', data.skillCategories.filter((_, i) => i !== idx));
  };
  const renameSkillCategory = (idx: number, name: string) => {
    const cats = [...data.skillCategories];
    cats[idx] = { ...cats[idx], category: name };
    update('skillCategories', cats);
  };

  /* ── project helpers ── */
  const addProject = () => {
    update('projects', [
      ...data.projects,
      { title: '', description: '', contributions: '', tools: [] } as ProjectEntry,
    ]);
  };
  const removeProject = (idx: number) => {
    update('projects', data.projects.filter((_, i) => i !== idx));
  };
  const updateProject = (idx: number, patch: Partial<ProjectEntry>) => {
    const p = [...data.projects];
    p[idx] = { ...p[idx], ...patch };
    update('projects', p);
  };

  /* ── experience helpers ── */
  const addExperience = () => {
    update('experiences', [
      ...data.experiences,
      { jobTitle: '', organization: '', dateRange: '', description: '' } as ExperienceEntry,
    ]);
  };
  const removeExperience = (idx: number) => {
    update('experiences', data.experiences.filter((_, i) => i !== idx));
  };
  const updateExperience = (idx: number, patch: Partial<ExperienceEntry>) => {
    const e = [...data.experiences];
    e[idx] = { ...e[idx], ...patch };
    update('experiences', e);
  };

  /* ── education helpers ── */
  const addEducation = () => {
    update('educations', [
      ...data.educations,
      { degree: '', institution: '', yearRange: '', gpa: '' } as EducationEntry,
    ]);
  };
  const removeEducation = (idx: number) => {
    update('educations', data.educations.filter((_, i) => i !== idx));
  };
  const updateEducation = (idx: number, patch: Partial<EducationEntry>) => {
    const ed = [...data.educations];
    ed[idx] = { ...ed[idx], ...patch };
    update('educations', ed);
  };

  /* ── certification helpers ── */
  const addCertification = () => {
    update('certifications', [
      ...data.certifications,
      { name: '', organization: '', credentialId: '' } as CertificationEntry,
    ]);
  };
  const removeCertification = (idx: number) => {
    update('certifications', data.certifications.filter((_, i) => i !== idx));
  };
  const updateCertification = (idx: number, patch: Partial<CertificationEntry>) => {
    const c = [...data.certifications];
    c[idx] = { ...c[idx], ...patch };
    update('certifications', c);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6 space-y-8"
    >
      {/* ─── SECTION 1: Personal Information ─── */}
      <div>
        <SectionHeading icon={User} title="Personal Information" />
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" className="bg-secondary/50 mt-1"
                value={data.firstName} onChange={(e) => update('firstName', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" className="bg-secondary/50 mt-1"
                value={data.lastName} onChange={(e) => update('lastName', e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" className="bg-secondary/50 mt-1"
              value={data.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="+1 (555) 000-0000" className="bg-secondary/50 mt-1"
              value={data.phone} onChange={(e) => update('phone', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="linkedin" className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn URL
            </Label>
            <Input id="linkedin" placeholder="https://linkedin.com/in/johndoe" className="bg-secondary/50 mt-1"
              value={data.linkedin} onChange={(e) => update('linkedin', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="github" className="flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5" /> GitHub URL
            </Label>
            <Input id="github" placeholder="https://github.com/johndoe" className="bg-secondary/50 mt-1"
              value={data.github} onChange={(e) => update('github', e.target.value)} />
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: Professional Summary ─── */}
      <div>
        <SectionHeading icon={FileText} title="Professional Summary" />
        <Textarea
          placeholder="Brief summary highlighting your background, strengths, and career goals…"
          className="bg-secondary/50 min-h-[100px]"
          value={data.summary}
          onChange={(e) => update('summary', e.target.value)}
        />
      </div>

      {/* ─── SECTION 3: Technical Skills (Categorized) ─── */}
      <div>
        <SectionHeading icon={Code} title="Technical Skills" />
        <div className="space-y-4">
          {data.skillCategories.map((cat, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-border/50 bg-secondary/20 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  value={cat.category}
                  onChange={(e) => renameSkillCategory(idx, e.target.value)}
                  placeholder="Category name"
                  className="bg-secondary/50 font-medium"
                />
                <Button variant="ghost" size="icon" type="button"
                  onClick={() => removeSkillCategory(idx)}
                  className="text-muted-foreground hover:text-destructive shrink-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <TagInput
                tags={cat.skills}
                onChange={(skills) => updateSkillCategory(idx, skills)}
                placeholder={`Add ${cat.category || 'skill'}…`}
              />
            </div>
          ))}
          <Button variant="outline" type="button" onClick={addSkillCategory} className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Add Skill Category
          </Button>
        </div>
      </div>

      {/* ─── SECTION 4: Projects (Repeatable) ─── */}
      <div>
        <SectionHeading icon={FolderOpen} title="Projects" />
        <div className="space-y-4">
          {data.projects.map((proj, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-border/50 bg-secondary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Project {idx + 1}</span>
                <Button variant="ghost" size="icon" type="button"
                  onClick={() => removeProject(idx)}
                  className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <Label>Project Title</Label>
                <Input className="bg-secondary/50 mt-1" placeholder="My Awesome Project"
                  value={proj.title} onChange={(e) => updateProject(idx, { title: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea className="bg-secondary/50 mt-1 min-h-[70px]" placeholder="What is this project about…"
                  value={proj.description} onChange={(e) => updateProject(idx, { description: e.target.value })} />
              </div>
              <div>
                <Label>Key Contributions</Label>
                <Textarea className="bg-secondary/50 mt-1 min-h-[70px]"
                  placeholder="• Built the auth system&#10;• Improved performance by 40%"
                  value={proj.contributions} onChange={(e) => updateProject(idx, { contributions: e.target.value })} />
              </div>
              <div>
                <Label>Tools / Tech Used</Label>
                <TagInput
                  tags={proj.tools}
                  onChange={(tools) => updateProject(idx, { tools })}
                  placeholder="Add tech…"
                />
              </div>
            </div>
          ))}
          <Button variant="outline" type="button" onClick={addProject} className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Add Project
          </Button>
        </div>
      </div>

      {/* ─── SECTION 5: Experience (Repeatable) ─── */}
      <div>
        <SectionHeading icon={Briefcase} title="Experience" />
        <div className="space-y-4">
          {data.experiences.map((exp, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-border/50 bg-secondary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Experience {idx + 1}</span>
                <Button variant="ghost" size="icon" type="button"
                  onClick={() => removeExperience(idx)}
                  className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <Label>Job Title</Label>
                <Input className="bg-secondary/50 mt-1" placeholder="Software Engineer"
                  value={exp.jobTitle} onChange={(e) => updateExperience(idx, { jobTitle: e.target.value })} />
              </div>
              <div>
                <Label>Organization</Label>
                <Input className="bg-secondary/50 mt-1" placeholder="Tech Company Inc."
                  value={exp.organization} onChange={(e) => updateExperience(idx, { organization: e.target.value })} />
              </div>
              <div>
                <Label>Date Range</Label>
                <Input className="bg-secondary/50 mt-1" placeholder="Jan 2022 – Present"
                  value={exp.dateRange} onChange={(e) => updateExperience(idx, { dateRange: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea className="bg-secondary/50 mt-1 min-h-[80px]"
                  placeholder="• Led a team of 5 engineers&#10;• Shipped 3 major features"
                  value={exp.description} onChange={(e) => updateExperience(idx, { description: e.target.value })} />
              </div>
            </div>
          ))}
          <Button variant="outline" type="button" onClick={addExperience} className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Add Experience
          </Button>
        </div>
      </div>

      {/* ─── SECTION 6: Education (Repeatable) ─── */}
      <div>
        <SectionHeading icon={GraduationCap} title="Education" />
        <div className="space-y-4">
          {data.educations.map((ed, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-border/50 bg-secondary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Education {idx + 1}</span>
                <Button variant="ghost" size="icon" type="button"
                  onClick={() => removeEducation(idx)}
                  className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <Label>Degree / Program</Label>
                <Input className="bg-secondary/50 mt-1" placeholder="B.S. Computer Science"
                  value={ed.degree} onChange={(e) => updateEducation(idx, { degree: e.target.value })} />
              </div>
              <div>
                <Label>Institution</Label>
                <Input className="bg-secondary/50 mt-1" placeholder="University Name"
                  value={ed.institution} onChange={(e) => updateEducation(idx, { institution: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Year Range</Label>
                  <Input className="bg-secondary/50 mt-1" placeholder="2018 – 2022"
                    value={ed.yearRange} onChange={(e) => updateEducation(idx, { yearRange: e.target.value })} />
                </div>
                <div>
                  <Label>GPA (optional)</Label>
                  <Input className="bg-secondary/50 mt-1" placeholder="3.8 / 4.0"
                    value={ed.gpa} onChange={(e) => updateEducation(idx, { gpa: e.target.value })} />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" type="button" onClick={addEducation} className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Add Education
          </Button>
        </div>
      </div>

      {/* ─── SECTION 7: Certifications ─── */}
      <div>
        <SectionHeading icon={Award} title="Certifications" />
        <div className="space-y-4">
          {data.certifications.map((cert, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-border/50 bg-secondary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Certification {idx + 1}</span>
                <Button variant="ghost" size="icon" type="button"
                  onClick={() => removeCertification(idx)}
                  className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <Label>Certification Name</Label>
                <Input className="bg-secondary/50 mt-1" placeholder="AWS Solutions Architect"
                  value={cert.name} onChange={(e) => updateCertification(idx, { name: e.target.value })} />
              </div>
              <div>
                <Label>Issuing Organization</Label>
                <Input className="bg-secondary/50 mt-1" placeholder="Amazon Web Services"
                  value={cert.organization} onChange={(e) => updateCertification(idx, { organization: e.target.value })} />
              </div>
              <div>
                <Label>Credential ID (optional)</Label>
                <Input className="bg-secondary/50 mt-1" placeholder="ABC-123-XYZ"
                  value={cert.credentialId} onChange={(e) => updateCertification(idx, { credentialId: e.target.value })} />
              </div>
            </div>
          ))}
          <Button variant="outline" type="button" onClick={addCertification} className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Add Certification
          </Button>
        </div>
      </div>

      {/* ─── SECTION 8: Relevant Coursework ─── */}
      <div>
        <SectionHeading icon={BookOpen} title="Relevant Coursework" />
        <TagInput
          tags={data.coursework}
          onChange={(c) => update('coursework', c)}
          placeholder="Add coursework…"
        />
      </div>
    </motion.div>
  );
};

export default ResumeForm;
