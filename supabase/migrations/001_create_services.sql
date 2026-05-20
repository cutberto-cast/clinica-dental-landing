create table if not exists services (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       numeric(10,2),
  duration    int not null,
  image_url   text,
  is_active   boolean default true,
  sort_order  int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Trigger para actualizar updated_at automáticamente
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger services_updated_at
  before update on services
  for each row execute function update_updated_at();

-- Datos semilla de ejemplo
insert into services (name, description, price, duration, sort_order) values
  ('Limpieza Dental', 'Limpieza profunda con ultrasonido y pulido dental.', 450.00, 60, 1),
  ('Blanqueamiento Láser', 'Blanqueamiento profesional en una sola sesión.', 1800.00, 90, 2),
  ('Ortodoncia Invisible', 'Alineadores transparentes para dientes perfectos.', 15000.00, 60, 3),
  ('Implantes Dentales', 'Reemplaza piezas perdidas con implantes de titanio.', 12000.00, 120, 4),
  ('Odontopediatría', 'Atención especializada para niños y adolescentes.', 350.00, 45, 5),
  ('Tratamiento sin Dolor', 'Procedimientos con sedación para pacientes con fobia dental.', 2500.00, 90, 6);
