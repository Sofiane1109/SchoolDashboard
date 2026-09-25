# SchoolDash — School Dashboard

A school dashboard built with **React 18 + Vite + Tailwind CSS + React Router**, with **Supabase** (PostgreSQL) as the backend.

- **Courses**: create, list, delete, one color per course
- **Assignments**: CRUD, due date, priority (Low/Medium/High), status (To do/In progress/Done)
- **Daily to-do**: Trello-style board with drag & drop (mouse, touch, keyboard)
- **Calendar**: monthly view with assignment count per day
- **Dashboard**: stats, today's tasks, what's due this week, progress by course
- **Filters**: by status, priority and course (synced to the URL)
- Mobile-first responsive layout, automatic light/dark theme (or forced via the switcher)

The design system (generated with UI/UX Pro Max) is documented in [design-system/MASTER.md](design-system/MASTER.md).

## Quick start

```bash
npm install
npm run dev
```

Without Supabase configured, the app runs in **demo mode** (data stored in the browser's `localStorage`).

## Setting up Supabase

1. Create a project on [supabase.com](https://supabase.com).
2. In the **SQL Editor**, run [supabase/schema.sql](supabase/schema.sql) (tables `courses`, `assignments`, `daily_tasks`, each row owned by a user, with RLS so users only see their own data).
   Database created with the old public schema? Run [supabase/migrations/001_google_auth.sql](supabase/migrations/001_google_auth.sql) instead.
3. Copy `.env.example` to `.env` and fill in the values from **Settings → API**:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## Google sign-in

1. **Google Cloud Console → Credentials**: create an OAuth client ID (*Web application*) with the authorized redirect URI
   `https://<project-ref>.supabase.co/auth/v1/callback`.
2. **Supabase → Authentication → Sign In / Providers → Google**: enable it and paste the client ID and secret.
3. **Supabase → Authentication → URL Configuration**:
   - *Site URL*: your production URL (e.g. `https://your-app.netlify.app`)
   - *Redirect URLs*: `https://your-app.netlify.app/**`, `http://localhost:5173/**`

When Supabase is configured, every page requires a Google sign-in. In demo mode there is no sign-in.

## Deployment

**Vercel**: import the repo, *Vite* preset, add both environment variables. `vercel.json` handles SPA routing.

**Netlify**: import the repo, add the environment variables (they are read at build time: redeploy after changing them). `netlify.toml` defines the build (`npm run build` → `dist`) and the SPA redirect.

## Structure

```
src/
  components/   layout/, ui/, dashboard/, courses/, assignments/, board/, calendar/
  context/      ThemeContext (light/dark/system), AuthContext (Google OAuth session), DataContext (state + optimistic actions)
  hooks/        useAuth, useData, useTheme, useAssignmentFilters, useStats
  services/     supabase.js (anon client), localBackend.js (demo mode), api.js
  lib/          constants (statuses, priorities, colors), date helpers
  pages/        Login, Dashboard, Assignments, To-do, Calendar, Courses
supabase/       schema.sql, migrations/
```
