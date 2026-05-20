create table if not exists availability_rules (
  id          uuid primary key default gen_random_uuid(),
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time  time not null,
  end_time    time not null,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- No puede haber dos reglas activas para el mismo día
create unique index availability_rules_day_unique
  on availability_rules(day_of_week)
  where is_active = true;

-- Horario base: lunes a viernes 9:00–14:00 y 16:00–19:00
-- Se insertan como registros separados si se quieren dos turnos por día
-- En esta versión: un rango por día
insert into availability_rules (day_of_week, start_time, end_time, is_active) values
  (1, '09:00', '19:00', true),  -- lunes
  (2, '09:00', '19:00', true),  -- martes
  (3, '09:00', '19:00', true),  -- miércoles
  (4, '09:00', '19:00', true),  -- jueves
  (5, '09:00', '14:00', true),  -- viernes
  (0, '09:00', '13:00', false), -- domingo (inactivo)
  (6, '09:00', '13:00', false); -- sábado (inactivo)
