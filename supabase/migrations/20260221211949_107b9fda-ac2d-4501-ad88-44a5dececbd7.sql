-- Backfill existing user_metrics rows with profile data
UPDATE public.user_metrics um
SET 
  name = p.name,
  email = p.email,
  role = p.role
FROM public.profiles p
WHERE um.user_id = p.user_id;

-- Create trigger function to sync profile changes to user_metrics
CREATE OR REPLACE FUNCTION public.sync_profile_to_metrics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_metrics
  SET 
    name = NEW.name,
    email = NEW.email,
    role = NEW.role
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- Attach trigger to profiles table
CREATE TRIGGER on_profile_updated_sync_metrics
AFTER INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_to_metrics();
