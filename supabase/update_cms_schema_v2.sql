-- ==============================================================================
-- FAIZAH CREATIVE ARCHIVE — CMS SCHEMA MIGRATION V2
-- Run this in your Supabase SQL Editor to apply Phase 1 & 2 schema changes.
-- ==============================================================================

-- 1. site_settings additions
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_image_url text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS is_available_for_work boolean DEFAULT true;

-- 2. projects additions
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS category_tags text[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS media jsonb[] DEFAULT '{}';

-- 3. Data Migration for existing projects (images -> media)
-- Convert existing strings in the 'images' array to the new JSONB media format.
UPDATE public.projects
SET media = (
  SELECT array_agg(
    jsonb_build_object(
      'type', 'image',
      'url', img,
      'order', idx - 1
    )
  )
  FROM unnest(images) WITH ORDINALITY AS t(img, idx)
)
WHERE images IS NOT NULL AND array_length(images, 1) > 0;

-- Optionally, you can drop the old images column once everything works:
-- ALTER TABLE public.projects DROP COLUMN images;

