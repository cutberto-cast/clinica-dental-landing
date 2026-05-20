-- Función con SECURITY DEFINER para que pacientes anónimos puedan crear citas
-- sin acceso directo a las tablas appointments o patients.
create or replace function create_appointment(
  p_patient_name  text,
  p_patient_phone text,
  p_patient_email text,
  p_service_id    uuid,
  p_starts_at     timestamptz,
  p_notes         text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_service        services%rowtype;
  v_patient_id     uuid;
  v_appointment_id uuid;
  v_conflict_count int;
begin
  -- 1. Validar servicio activo
  select * into v_service
  from services
  where id = p_service_id and is_active = true;

  if not found then
    raise exception 'Servicio no válido o inactivo';
  end if;

  -- 2. Calcular fin de cita
  declare
    v_ends_at timestamptz := p_starts_at + (v_service.duration || ' minutes')::interval;
  begin
    -- 3. Verificar que el slot sigue disponible (previene race conditions)
    select count(*) into v_conflict_count
    from appointments
    where status not in ('cancelled', 'no_show')
      and starts_at < v_ends_at
      and ends_at > p_starts_at;

    if v_conflict_count > 0 then
      raise exception 'El horario seleccionado ya no está disponible. Por favor elige otro.';
    end if;

    -- 4. Crear o recuperar paciente por teléfono
    insert into patients (name, phone, email)
    values (p_patient_name, p_patient_phone, p_patient_email)
    on conflict (phone)
    do update set name = excluded.name, email = coalesce(excluded.email, patients.email)
    returning id into v_patient_id;

    -- 5. Crear la cita
    insert into appointments (
      patient_id, service_id, starts_at, ends_at, notes, status
    ) values (
      v_patient_id,
      p_service_id,
      p_starts_at,
      v_ends_at,
      p_notes,
      'pending'
    )
    returning id into v_appointment_id;

    return v_appointment_id;
  end;
end;
$$;

-- Dar acceso anónimo a la función
grant execute on function create_appointment(text, text, text, uuid, timestamptz, text)
  to anon;
