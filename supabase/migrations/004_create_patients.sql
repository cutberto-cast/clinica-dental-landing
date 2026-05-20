create table if not exists patients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  email      text,
  notes      text,
  created_at timestamptz default now()
);

create unique index patients_phone_unique on patients(phone);
