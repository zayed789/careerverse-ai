
-- Add columns for persisting full module results
ALTER TABLE public.user_metrics
  ADD COLUMN IF NOT EXISTS skill_gap_missing_skills jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS skill_gap_analysis_summary text DEFAULT '',
  ADD COLUMN IF NOT EXISTS ats_feedback_summary text DEFAULT '',
  ADD COLUMN IF NOT EXISTS keyword_match_percentage numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS aptitude_last_attempt_score numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS aptitude_answers jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS interview_feedback text DEFAULT '',
  ADD COLUMN IF NOT EXISTS interview_round_data jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS skill_gap_matched_skills jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS skill_gap_recommendations jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS skill_gap_match_label text DEFAULT '',
  ADD COLUMN IF NOT EXISTS ats_feedback jsonb DEFAULT '[]'::jsonb;
