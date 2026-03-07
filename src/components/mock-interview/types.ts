export type InterviewRound = 'screening' | 'technical' | 'scenario' | 'decision';

export interface InterviewQuestion {
  id: string;
  text: string;
  audio?: string; // Base64 encoded audio/mpeg
}

export const INTERVIEW_ROUNDS: { key: InterviewRound; label: string }[] = [
  { key: 'screening', label: 'Screening' },
  { key: 'technical', label: 'Technical' },
  { key: 'scenario', label: 'Scenario' },
  { key: 'decision', label: 'Decision' },
];
