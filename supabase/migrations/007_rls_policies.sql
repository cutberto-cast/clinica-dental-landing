-- ── services ──────────────────────────────────────────────
alter table services enable row level security;

create policy "servicios visibles al público"
  on services for select
  using (is_active = true);

create policy "dentista gestiona servicios"
  on services for all
  using (auth.role() = 'authenticated');

-- ── availability_rules ────────────────────────────────────
alter table availability_rules enable row level security;

create policy "reglas visibles al público"
  on availability_rules for select
  using (true);

create policy "dentista gestiona reglas"
  on availability_rules for all
  using (auth.role() = 'authenticated');

-- ── blocked_slots ─────────────────────────────────────────
alter table blocked_slots enable row level security;

create policy "dentista gestiona bloqueos"
  on blocked_slots for all
  using (auth.role() = 'authenticated');

-- ── patients ──────────────────────────────────────────────
alter table patients enable row level security;

create policy "dentista gestiona pacientes"
  on patients for all
  using (auth.role() = 'authenticated');

-- ── appointments ──────────────────────────────────────────
alter table appointments enable row level security;

create policy "dentista gestiona citas"
  on appointments for all
  using (auth.role() = 'authenticated');

-- ── calendar_tokens ───────────────────────────────────────
alter table calendar_tokens enable row level security;

create policy "dentista gestiona tokens"
  on calendar_tokens for all
  using (auth.role() = 'authenticated');
