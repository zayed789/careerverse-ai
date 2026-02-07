export interface ResumeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skills: string[];
  jobTitle: string;
  company: string;
  experienceDescription: string;
  degree: string;
  institution: string;
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
  skills: ['React', 'TypeScript', 'Node.js'],
  jobTitle: '',
  company: '',
  experienceDescription: '',
  degree: '',
  institution: '',
};
