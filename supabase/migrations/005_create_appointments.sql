create table if not exists appointments (
  id                       uuid primary key default gen_random_uuid(),
  patient_id               uuid references patients(id) on delete restrict,
  service_id               uuid references services(id) on delete restrict,
  starts_at                timestamptz not null,
  ends_at                  timestamptz not null,
  status                   text not null default 'pending'
                             check (status in ('pending','confirmed','cancelled','completed','no_show')),
  notes                    text,
  internal_notes           text,
  google_calendar_event_id text,
  created_at               timestamptz default now(),
  updated_at               timestamptz default now()
);

create index appointments_starts_at_idx on appointments(starts_at);
create index appointments_status_idx on appointments(status);
create index appointments_patient_id_idx on appointments(patient_id);

create trigger appointments_updated_at
  before update on appointments
  for each row execute function update_updated_at();
