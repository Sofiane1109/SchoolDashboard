-- Makes every row private to the signed-in user who created it.
-- Run once in Supabase → SQL Editor on a database created with the original (public) schema.sql.

alter table public.courses     add column if not exists user_id uuid default auth.uid() references auth.users (id) on delete cascade;
alter table public.assignments add column if not exists user_id uuid default auth.uid() references auth.users (id) on delete cascade;
alter table public.daily_tasks add column if not exists user_id uuid default auth.uid() references auth.users (id) on delete cascade;

create index if not exists courses_user_id_idx     on public.courses (user_id);
create index if not exists assignments_user_id_idx on public.assignments (user_id);
create index if not exists daily_tasks_user_id_idx on public.daily_tasks (user_id);

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

-- Rows created before this migration have no owner and are now invisible.
-- To keep them, sign in once with Google, then run (with your Google email):
--
-- update public.courses     set user_id = (select id from auth.users where email = 'you@gmail.com') where user_id is null;
-- update public.assignments set user_id = (select id from auth.users where email = 'you@gmail.com') where user_id is null;
-- update public.daily_tasks set user_id = (select id from auth.users where email = 'you@gmail.com') where user_id is null;
