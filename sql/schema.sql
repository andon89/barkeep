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

drop policy if exists "service role only" on barkeep_bottles;
create policy "service role only" on barkeep_bottles for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
drop policy if exists "service role only" on barkeep_menus;
create policy "service role only" on barkeep_menus for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
drop policy if exists "service role only" on barkeep_drinks;
create policy "service role only" on barkeep_drinks for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
drop policy if exists "service role only" on barkeep_jobs;
create policy "service role only" on barkeep_jobs for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
drop policy if exists "service role only" on barkeep_meta;
create policy "service role only" on barkeep_meta for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Writes a menu and its drinks and makes it the active one, all in one transaction, so a
-- failure part-way never leaves the board blank or an orphaned menu in history. Two menu
-- jobs racing each other: the second blocks on the first's row lock, then its insert trips
-- barkeep_menus_one_active and the whole call rolls back cleanly.
create or replace function barkeep_create_menu(p_title text, p_intro text, p_prompt text, p_drinks jsonb)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  v_menu barkeep_menus;
  v_drinks jsonb;
begin
  update barkeep_menus set is_active = false where is_active;
  insert into barkeep_menus (title, intro, prompt, is_active)
    values (p_title, p_intro, p_prompt, true)
    returning * into v_menu;
  insert into barkeep_drinks (menu_id, name, description, ingredients, instructions, glassware, garnish, sort_order)
    select v_menu.id, d->>'name', d->>'description', coalesce(d->'ingredients', '[]'::jsonb), d->>'instructions', d->>'glassware', d->>'garnish', ord - 1
    from jsonb_array_elements(p_drinks) with ordinality as t(d, ord);
  select coalesce(jsonb_agg(to_jsonb(r) order by r.sort_order), '[]'::jsonb) into v_drinks
    from barkeep_drinks r where r.menu_id = v_menu.id;
  return jsonb_build_object('menu', to_jsonb(v_menu), 'drinks', v_drinks);
end
$$;
-- Same rule as the tables: only the service role may call it.
revoke execute on function barkeep_create_menu(text, text, text, jsonb) from public, anon, authenticated;
