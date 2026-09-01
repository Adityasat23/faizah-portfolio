-- Update Projects Table to support Draft mode
ALTER TABLE public.projects 
ADD COLUMN is_published boolean DEFAULT true;

-- Update Site Settings Table to support dynamic Hero Text
ALTER TABLE public.site_settings 
ADD COLUMN hero_text text DEFAULT 'Faizah she/her is an independent creative director and designer who builds brands that resonate.';

-- Since we already had an existing row in site_settings, ensure it's populated
UPDATE public.site_settings 
SET hero_text = 'Faizah she/her is an independent creative director and designer who builds brands that resonate.' 
WHERE hero_text IS NULL;
