create table profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  role text default 'donor',
  created_at timestamptz default now()
);

create table donors (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text unique not null,
  phone text,
  created_at timestamptz default now(),
  cancelled_at timestamptz,
  cancellation_reason text
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid references donors(id),
  amount numeric not null,
  status text not null,
  created_at timestamptz default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid references donors(id),
  amount numeric not null,
  status text not null,
  mercadopago_id text,
  paid_at timestamptz default now(),
  created_at timestamptz default now()
);

create table communication_logs (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid
    references donors(id),
  channel text not null,
  subject text,
  content text,
  sent_at timestamptz default now()
);

create table subscription_plans (
  id uuid primary key default gen_random_uuid(),
  mercadopago_plan_id text not null,
  amount numeric not null,
  created_at timestamptz default now()
);

alter table donors
  add column user_id uuid
  references auth.users(id)
  unique;

alter table profiles
add column email text unique;

/*RLS*/
alter table donors enable row level security;
alter table profiles enable row level security;
alter table subscriptions enable row level security;
alter table payments enable row level security;
alter table communication_logs enable row level security;
alter table subscription_plans enable row level security;

/*FUNCTIONS*/
create or replace function public.is_admin()
  returns boolean
  language sql
  security definer
  as $$
    select exists (
      select 1
      from profiles
      where id = auth.uid()
      and role = 'admin'
    );
$$;

create or replace function public.cancel_subscription()
  returns void
  language plpgsql
  security definer
  as $$
  begin
    update donors
    set
      cancelled_at = now(),
      cancellation_reason = 'Solicitada por usuario'
    where user_id = auth.uid();
  end;
$$;


/*POLICIES*/
create policy "admins can read donors"
on donors
for select
to authenticated
using (public.is_admin());

create policy "admins can update donors"
on donors
for update
to authenticated
using (public.is_admin());

create policy "admins can insert donors"
on donors
for insert
to authenticated
with check (public.is_admin());

create policy "admins can delete donors"
on donors
for delete
to authenticated
using (public.is_admin());

create policy "users can view own profile"
on profiles
for select
using (
  auth.uid() = id
);

create policy "donor can read self"
on donors
for select
to authenticated
using (
  user_id = auth.uid()
);

create policy "donor can update self"
on donors
for update
to authenticated
using (
  user_id = auth.uid()
  and not public.is_admin()
);