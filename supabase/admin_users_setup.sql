-- ====================================================================
-- UMRAH TAXI ONLINE: ADMIN AUTHENTICATION TABLE & ACCESS SETUP
-- ====================================================================

-- 1. Create table for Admin Portal Users
create table if not exists public.admin_users (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    username text unique not null,
    password text not null,
    role text not null default 'superadmin',
    is_active boolean not null default true
);

-- 2. Enable Row Level Security (RLS)
alter table public.admin_users enable row level security;

-- 3. Policy: Allow login authentication queries
drop policy if exists "Allow select for admin authentication" on public.admin_users;
create policy "Allow select for admin authentication"
    on public.admin_users for select
    using (true);

-- 4. Policy: Allow admins to update their own credentials
drop policy if exists "Allow admins to update credentials" on public.admin_users;
create policy "Allow admins to update credentials"
    on public.admin_users for update
    using (true);

-- 5. Insert Hardcoded Default Admin Credentials
-- (Username: admin | Password: umrah@admin2026)
insert into public.admin_users (username, password, role, is_active)
values ('admin', 'umrah@admin2026', 'superadmin', true)
on conflict (username) do update
set password = excluded.password,
    is_active = true;

-- 6. Verify inserted user
select id, username, role, is_active, created_at from public.admin_users;
