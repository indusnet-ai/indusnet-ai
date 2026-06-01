# Indusnet AI — Premium Enterprise AI Solutions Website

Production-ready modern enterprise website for **Indusnet AI** (https://indusnet-ai.com/). This project serves as a highly polished portal positioning Indusnet AI as a leading AI consulting, custom AI solutions engineering, and certified CPMAI training provider.

---

## 🚀 Technology Stack
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Core**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Primitives**: Base UI & shadcn/ui
- **Animations**: Framer Motion
- **Database / API**: Supabase JS SDK (PostgreSQL)
- **Deployment**: Vercel-ready

---

## 📂 Project Directory Structure

```bash
/app                  # Next.js App Router (pages and API routes)
  /about              # About Us page
  /api                # API endpoint routing
    /consultations    # Lead logging & scheduling API
    /newsletter       # Newsletter subscription API
  /blog               # Technical Insights publications listing
  /contact            # Multi-channel contact & strategy call scheduler
  /industries         # Sector-specific AI use-case matrices
  /portfolio          # Detailed enterprise case studies
  /services           # 9 core detailed service catalog cards
  /training           # certified CPMAI & developer syllabus bootcamps
  globals.css         # Dark theme tokens, glassmorphism, & grid backgrounds
  layout.tsx          # Default layout with ThemeProvider, Navbar, & Footer
  page.tsx            # Cosmic AI Homepage
/components           # Reusable UI component modules
  /navbar             # Sticky Glassmorphism Header
  /footer             # Modern multi-column footer
  /ui                 # Primitive buttons, inputs, sheet trigger drawer
  theme-provider.tsx  # next-themes dark mode toggle wrapper
  scroll-progress.tsx # Glowing custom viewport scroll height tracker
/lib                  # Utilities (Supabase Client, clsx merges)
/supabase             # DDL SQL Schema scripts
/public               # SVG assets, logos, and static placeholders
```

---

## 🛠️ Local Startup & Execution

### 1. Prerequisite Installations
Ensure Node.js v18.x or v20.x is active on your machine.

### 2. Configure Environment Variables
Copy the `.env.example` template into a new `.env.local` file at the root directory:
```bash
cp .env.example .env.local
```
Fill in your Supabase connection parameters:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-api-key-here
```
*Note: If these variables are not set, the contact and newsletter forms automatically run in a **Graceful Simulation Mode**, allowing full visual prototyping without crashes.*

### 3. Install NPM Packages
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser.

---

## 💾 Database SQL Schemas (PostgreSQL)
Initialize your database by running the DDL scripts from `/supabase/schema.sql` inside the **Supabase SQL Editor**:

```sql
-- 1. Newsletter subscription table
CREATE TABLE IF NOT EXISTS public.newsletter (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Consultations booking table
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(150),
    service VARCHAR(100) NOT NULL,
    booking_date VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Generic leads table (general inquiries)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(150),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

---

## 🌐 Production Cloud Deployment (Vercel)

1. Push your local workspace directory to a secure **GitHub** repository.
2. Link the repository inside your **Vercel Console**.
3. In **Environment Variables**, append the matching Supabase production keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will build the optimized serverless Next.js edge assets.
