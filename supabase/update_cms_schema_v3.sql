-- Faizah CMS Phase 3: Theme and Hero Customization
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS theme text DEFAULT 'light';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_image_radius text DEFAULT 'rounded-[1.5rem]';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_image_padding text DEFAULT 'p-0';
