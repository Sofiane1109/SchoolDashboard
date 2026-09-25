-- School Dashboard schema for a fresh project. Run in Supabase → SQL Editor.
-- Each row belongs to the signed-in user (Google OAuth); RLS limits every user to their own rows.
-- Existing database created with the old public schema? Run migrations/001_google_auth.sql instead.

create extension if not exists "pgcrypto";

create table if not exists public.courses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 100),
  teacher     text,
  color       text not null default '#0D9488' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  created_at  timestamptz not null default now()
);

create table if not exists public.assignments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid default auth.uid() references auth.users (id) on delete cascade,
  course_id    uuid references public.courses (id) on delete cascade,
  title        text not null check (char_length(title) between 1 and 200),
  description  text,
  due_date     date not null,
  priority     text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status       text not null default 'todo'   check (status in ('todo', 'in_progress', 'done')),
  created_at   timestamptz not null default now()
);

create table if not exists public.daily_tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid default auth.uid() references auth.users (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 200),
  status      text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  task_date   date not null default current_date,
  position    double precision not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists assignments_due_date_idx  on public.assignments (due_date);
create index if not exists assignments_course_id_idx on public.assignments (course_id);
create index if not exists daily_tasks_task_date_idx on public.daily_tasks (task_date);
create index if not exists courses_user_id_idx       on public.courses (user_id);
create index if not exists assignments_user_id_idx   on public.assignments (user_id);
create index if not exists daily_tasks_user_id_idx   on public.daily_tasks (user_id);

alter table public.courses     enable row level security;
alter table public.assignments enable row level security;
alter table public.daily_tasks enable row level security;

do $$
declare t text;
begin
  foreach t in array array['courses', 'assignments', 'daily_tasks'] loop
    execute format('drop policy if exists "public_all" on public.%I', t);
    execute format('drop policy if exists "owner_all" on public.%I', t);
    execute format(
      'create policy "owner_all" on public.%I for all to authenticated
         using ((select auth.uid()) = user_id)
         with check ((select auth.uid()) = user_id)',
      t
    );
  end loop;
end $$;
