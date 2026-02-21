
-- Create a security definer function to check admin role without recursion
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- Drop existing SELECT policies on profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new SELECT policy: users see own row, admins see all
CREATE POLICY "Users can view own profile or admin sees all"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = user_id
  OR public.is_admin(auth.uid())
);

-- Drop existing SELECT policy on user_metrics
DROP POLICY IF EXISTS "Users can view their own metrics" ON public.user_metrics;

-- Create new SELECT policy: users see own row, admins see all
CREATE POLICY "Users can view own metrics or admin sees all"
ON public.user_metrics
FOR SELECT
USING (
  auth.uid() = user_id
  OR public.is_admin(auth.uid())
);
