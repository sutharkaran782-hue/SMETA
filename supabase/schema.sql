create extension if not exists "pgcrypto";

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  symptoms text not null,
  priority text not null check (priority in ('CRITICAL', 'MODERATE', 'LOW')),
  summary text not null,
  image_url text,
  created_at timestamp with time zone not null default timezone('utc', now())
);

alter table public.patients enable row level security;

drop policy if exists "Allow public inserts on patients" on public.patients;
create policy "Allow public inserts on patients"
on public.patients
for insert
to anon
with check (true);

drop policy if exists "Allow public reads on patients" on public.patients;
create policy "Allow public reads on patients"
on public.patients
for select
to anon
using (true);

insert into storage.buckets (id, name, public)
values ('patient-images', 'patient-images', true)
on conflict (id) do nothing;

drop policy if exists "Allow public uploads to patient-images" on storage.objects;
create policy "Allow public uploads to patient-images"
on storage.objects
for insert
to anon
with check (bucket_id = 'patient-images');

drop policy if exists "Allow public reads from patient-images" on storage.objects;
create policy "Allow public reads from patient-images"
on storage.objects
for select
to anon
using (bucket_id = 'patient-images');
