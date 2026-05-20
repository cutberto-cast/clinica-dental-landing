create table if not exists blocked_slots (
  id          uuid primary key default gen_random_uuid(),
  date        date,
  start_at    timestamptz,
  end_at      timestamptz,
  reason      text,
  is_full_day boolean default false,
  created_at  timestamptz default now(),

  -- O es día completo (date + is_full_day) o es rango parcial (start_at + end_at)
  constraint blocked_slots_check check (
    (is_full_day = true and date is not null) or
    (is_full_day = false and start_at is not null and end_at is not null)
  )
);

create index blocked_slots_date_idx on blocked_slots(date);
create index blocked_slots_start_at_idx on blocked_slots(start_at);
