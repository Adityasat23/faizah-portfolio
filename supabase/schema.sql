-- Schema for Faizah Creative Archive Portfolio

-- 1. Projects Table
CREATE TABLE public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  subtitle text,
  description text,
  what_we_did text[] DEFAULT '{}',
  scope_of_work text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view projects
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.projects FOR SELECT
  USING ( true );

-- Policy: Only authenticated users (admins) can insert/update/delete
CREATE POLICY "Admins can insert projects"
  ON public.projects FOR INSERT
  WITH CHECK ( auth.role() = 'authenticated' );

CREATE POLICY "Admins can update projects"
  ON public.projects FOR UPDATE
  USING ( auth.role() = 'authenticated' );

CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE
  USING ( auth.role() = 'authenticated' );

-- 2. Site Settings Table
CREATE TABLE public.site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  about_text text,
  email text,
  linkedin_url text,
  client_logos text[] DEFAULT '{}',
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert a single row for settings
INSERT INTO public.site_settings (about_text, email, linkedin_url)
VALUES ('Creative professional specializing in branding, design, and creative direction.', 'hello@example.com', 'https://linkedin.com');

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view site settings
CREATE POLICY "Public settings are viewable by everyone."
  ON public.site_settings FOR SELECT
  USING ( true );

-- Policy: Only authenticated users (admins) can update settings
CREATE POLICY "Admins can update settings"
  ON public.site_settings FOR UPDATE
  USING ( auth.role() = 'authenticated' );

-- 3. Storage Bucket for Portfolio Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio_images', 'portfolio_images', true);

-- Storage Policies
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'portfolio_images' );

CREATE POLICY "Admin Upload Access"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'portfolio_images' AND auth.role() = 'authenticated' );

CREATE POLICY "Admin Update Access"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'portfolio_images' AND auth.role() = 'authenticated' );

CREATE POLICY "Admin Delete Access"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'portfolio_images' AND auth.role() = 'authenticated' );
