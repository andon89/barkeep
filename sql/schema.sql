create table if not exists barkeep_bottles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  in_stock boolean not null default true,
  style jsonb not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists barkeep_menus (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  intro text not null default '',
  prompt text,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index if not exists barkeep_menus_one_active on barkeep_menus (is_active) where is_active;

create table if not exists barkeep_drinks (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid references barkeep_menus(id) on delete cascade,
  name text not null,
  description text not null default '',
  ingredients jsonb not null default '[]'::jsonb,
  instructions text not null default '',
  glassware text not null default '',
  garnish text not null default '',
  source_prompt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists barkeep_drinks_menu_id on barkeep_drinks (menu_id);

create table if not exists barkeep_jobs (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('menu', 'make')),
  input jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'done', 'failed')),
  result jsonb,
  error text,
  created_at timestamptz not null default now()
);

create table if not exists barkeep_meta (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table barkeep_bottles enable row level security;
alter table barkeep_menus enable row level security;
alter table barkeep_drinks enable row level security;
alter table barkeep_jobs enable row level security;
alter table barkeep_meta enable row level security;

create policy "allow all" on barkeep_bottles for all using (true) with check (true);
create policy "allow all" on barkeep_menus for all using (true) with check (true);
create policy "allow all" on barkeep_drinks for all using (true) with check (true);
create policy "allow all" on barkeep_jobs for all using (true) with check (true);
create policy "allow all" on barkeep_meta for all using (true) with check (true);
