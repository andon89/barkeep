-- Barkeep runs entirely server-side with the service-role key, which bypasses RLS.
-- personal-shared is shared with other apps whose publishable key is public, so
-- nothing may be readable or writable by anon/authenticated roles.
drop policy if exists "allow all" on barkeep_bottles;
drop policy if exists "allow all" on barkeep_menus;
drop policy if exists "allow all" on barkeep_drinks;
drop policy if exists "allow all" on barkeep_jobs;
drop policy if exists "allow all" on barkeep_meta;

drop policy if exists "service role only" on barkeep_bottles;
drop policy if exists "service role only" on barkeep_menus;
drop policy if exists "service role only" on barkeep_drinks;
drop policy if exists "service role only" on barkeep_jobs;
drop policy if exists "service role only" on barkeep_meta;

create policy "service role only" on barkeep_bottles for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role only" on barkeep_menus for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role only" on barkeep_drinks for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role only" on barkeep_jobs for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "service role only" on barkeep_meta for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
