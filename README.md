# Faizah Creative Archive - Portfolio Website

This is the codebase for Faizah's portfolio website. It features an iOS-core inspired aesthetic, full-bleed color blocks, and bold typography. It includes a custom built-in CMS using Supabase for content management.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Database / Auth / Storage**: Supabase
- **Forms**: React Hook Form + Zod
- **Deployment Adapter**: OpenNext for Cloudflare (`@opennextjs/cloudflare`)

## Setup Instructions

### 1. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor in your Supabase dashboard.
3. Copy the contents of `supabase/schema.sql` and run it. This will create the necessary tables (`projects`, `site_settings`), set up Row Level Security (RLS), and create the `portfolio_images` storage bucket.
4. Go to **Authentication -> Users** and create a user account. This will be your Admin login.

### 2. Local Environment Variables
Create a `.env.local` file in the root of the project:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Running Locally
Install dependencies and run the development server:
```bash
npm install
npm run dev
```
Visit `http://localhost:3000` for the public site, and `http://localhost:3000/admin` to access the CMS.

## Deployment to Cloudflare Pages / Workers

This project uses `@opennextjs/cloudflare` to run the Next.js App Router on Cloudflare Workers/Pages. 

1. Push your repository to GitHub.
2. In the Cloudflare Dashboard, create a new **Pages** project and connect your GitHub repository.
3. Configure the build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `.open-next/worker` (This is where OpenNext compiles the output for Cloudflare)
4. Add your Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Cloudflare Pages settings.
5. Deploy.

## Managing Content (CMS)

- **Login**: Go to `/admin/login` and sign in with the Supabase Auth user you created.
- **Projects**: Add, edit, and delete your portfolio projects in the "Projects" tab.
- **Site Settings**: Update global text, email, and social links in the "Site Settings" tab. 

*Note: Changes made in the CMS reflect immediately on the frontend.*
