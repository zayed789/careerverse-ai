-- Enable RLS (already enabled but safe to keep)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove old policies (avoid duplicates)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- USERS: View their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- USERS: Insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- USERS: Update profile but NOT role
CREATE POLICY "Users can update their own profile (except role)"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
);

-- ADMINS: View all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND LOWER(role) = 'admin'
  )
);

-- ADMINS: Update any profile
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND LOWER(role) = 'admin'
  )
);

ALTER TABLE public.user_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own metrics" ON public.user_metrics;
DROP POLICY IF EXISTS "Users can insert their own metrics" ON public.user_metrics;
DROP POLICY IF EXISTS "Users can update their own metrics" ON public.user_metrics;
DROP POLICY IF EXISTS "Admins can view all metrics" ON public.user_metrics;

-- USERS: View own metrics
CREATE POLICY "Users can view their own metrics"
ON public.user_metrics
FOR SELECT
USING (auth.uid() = user_id);

-- USERS: Insert own metrics
CREATE POLICY "Users can insert their own metrics"
ON public.user_metrics
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- USERS: Update own metrics
CREATE POLICY "Users can update their own metrics"
ON public.user_metrics
FOR UPDATE
USING (auth.uid() = user_id);

-- ADMINS: View all metrics
CREATE POLICY "Admins can view all metrics"
ON public.user_metrics
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND LOWER(role) = 'admin'
  )
);
