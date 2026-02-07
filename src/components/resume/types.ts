export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ProjectEntry {
  title: string;
  description: string;
  contributions: string;
  tools: string[];
}

export interface ExperienceEntry {
  jobTitle: string;
  organization: string;
  dateRange: string;
  description: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  yearRange: string;
  gpa: string;
}

export interface CertificationEntry {
  name: string;
  organization: string;
  credentialId: string;
}

export interface ResumeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  summary: string;
  skillCategories: SkillCategory[];
  projects: ProjectEntry[];
  experiences: ExperienceEntry[];
  educations: EducationEntry[];
  certifications: CertificationEntry[];
  coursework: string[];
}

export interface AtsFeedbackItem {
  type: 'strength' | 'missing' | 'formatting' | 'suggestion';
  text: string;
}

export interface AtsResult {
  score: number;
  feedback: AtsFeedbackItem[];
}

export const initialResumeData: ResumeData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  summary: '',
  skillCategories: [
    { category: 'Security Operations', skills: [] },
    { category: 'Frontend Development', skills: [] },
    { category: 'Databases', skills: [] },
  ],
  projects: [],
  experiences: [],
  educations: [],
  certifications: [],
  coursework: [],
};
