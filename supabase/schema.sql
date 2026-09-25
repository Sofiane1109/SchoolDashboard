-- School Dashboard schema. Run in Supabase → SQL Editor.
-- Data is public (no auth): RLS is enabled with policies granting the anon role full access.

create extension if not exists "pgcrypto";

create table if not exists public.courses (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 100),
  teacher     text,
  color       text not null default '#0D9488' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  created_at  timestamptz not null default now()
);

create table if not exists public.assignments (
  id           uuid primary key default gen_random_uuid(),
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
  title       text not null check (char_length(title) between 1 and 200),
  status      text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  task_date   date not null default current_date,
  position    double precision not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists assignments_due_date_idx on public.assignments (due_date);
create index if not exists assignments_course_id_idx on public.assignments (course_id);
create index if not exists daily_tasks_task_date_idx on public.daily_tasks (task_date);

alter table public.courses     enable row level security;
alter table public.assignments enable row level security;
alter table public.daily_tasks enable row level security;

do $$
declare t text;
begin
  foreach t in array array['courses', 'assignments', 'daily_tasks'] loop
    execute format('drop policy if exists "public_all" on public.%I', t);
    execute format(
      'create policy "public_all" on public.%I for all to anon, authenticated using (true) with check (true)',
      t
    );
  end loop;
end $$;
