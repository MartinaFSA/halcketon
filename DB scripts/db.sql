create table profiles (
  id uuid primary key
    references auth.users(id),
  full_name text,
  role text default 'admin',
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

alter table donors
enable row level security;

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

/*POLICIES*/

create policy "authenticated users can read donors"
on donors
for select
to authenticated
using (true);

create policy "authenticated users can insert donors"
on donors
for insert
to authenticated
with check (true);

create policy "authenticated users can update donors"
on donors
for update
to authenticated
using (true);

create policy "authenticated users can delete donors"
on donors
for delete
to authenticated
using (true);