ALTER TABLE public.user_metrics
  ADD COLUMN name text DEFAULT '',
  ADD COLUMN email text DEFAULT '',
  ADD COLUMN role text DEFAULT 'Student';
