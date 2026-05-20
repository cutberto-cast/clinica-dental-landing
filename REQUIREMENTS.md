# Especificación de Requerimientos — Sistema de Agendamiento Dental

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Estado:** Activo  
**Proyecto:** Consultorio Dental — Plataforma de Gestión Inteligente de Citas

---

## Índice

1. [Contexto y Situación Actual](#1-contexto-y-situación-actual)
2. [Problema Principal](#2-problema-principal)
3. [Objetivo del Sistema](#3-objetivo-del-sistema)
4. [Stack Tecnológico](#4-stack-tecnológico)
5. [Arquitectura General](#5-arquitectura-general)
6. [Estructura de Base de Datos](#6-estructura-de-base-de-datos)
7. [Módulos del Sistema](#7-módulos-del-sistema)
8. [Motor de Disponibilidad](#8-motor-de-disponibilidad)
9. [Integración con Google Calendar](#9-integración-con-google-calendar)
10. [Requerimientos No Funcionales](#10-requerimientos-no-funcionales)
11. [Plan de Fases](#11-plan-de-fases)
12. [Estructura de Carpetas](#12-estructura-de-carpetas)
13. [Variables de Entorno](#13-variables-de-entorno)

---

## 1. Contexto y Situación Actual

El sitio web actual del consultorio dental cumple una función informativa: presenta los servicios del consultorio y simula un proceso de agendamiento que termina enviando un mensaje por WhatsApp al dentista.

**Lo que funciona actualmente:**
- Presentación de información del consultorio
- Listado de servicios
- Formulario de contacto con envío a WhatsApp

**Lo que no funciona:**
- El paciente selecciona fecha y hora sin validación real de disponibilidad
- El dentista revisa manualmente su agenda para confirmar o rechazar
- No existe fuente centralizada de disponibilidad
- El dentista ya usa Google Calendar como agenda personal, pero este no refleja disponibilidad real del consultorio

---

## 2. Problema Principal

No existe una fuente centralizada y dinámica de disponibilidad real.

| Actor | Problema |
|---|---|
| Paciente | No sabe qué horarios están realmente libres |
| Dentista | Administra disponibilidad manualmente por WhatsApp |
| Sistema | No tiene lógica de negocio — solo es un formulario de contacto |

**Consecuencias directas:**
- Reagendaciones frecuentes
- Saturación del WhatsApp del dentista
- Riesgo de doble reservación
- Mala experiencia para el paciente
- Tiempo operativo perdido en gestión manual

---

## 3. Objetivo del Sistema

Transformar el sitio web en una plataforma de gestión inteligente de citas bajo el principio:

> **"Disponibilidad administrada + reservación automática"**

El sistema será la fuente principal de disponibilidad real. Google Calendar funcionará como espejo de visualización, sincronización y recordatorio — no como sistema de lógica.

**El paciente podrá:**
- Ver horarios realmente disponibles (calculados en tiempo real)
- Seleccionar servicio, fecha y hora
- Reservar automáticamente sin intervención del dentista
- Recibir confirmación inmediata

**El dentista podrá:**
- Administrar su disponibilidad semanal
- Bloquear horarios específicos
- Gestionar servicios (agregar, editar, desactivar)
- Ver su agenda en tiempo real
- Recibir nuevas citas automáticamente en Google Calendar

---

## 4. Stack Tecnológico

| Capa | Tecnología | Razón |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Ya existe en el proyecto; SSR para SEO, API Routes |
| Despliegue | Vercel | Ya configurado; integración nativa con Next.js |
| Base de datos | Supabase (PostgreSQL) | Auth, Realtime, Storage, Edge Functions en un solo lugar |
| Autenticación | Supabase Auth — Magic Link | Sin contraseñas; acceso exclusivo para el dentista |
| Lógica de servidor | Supabase Edge Functions (Deno) | Motor de disponibilidad; webhooks de calendario |
| Tiempo real | Supabase Realtime | Panel admin con actualizaciones en vivo |
| Almacenamiento | Supabase Storage | Imágenes de servicios |
| Calendario externo | Google Calendar API v3 | Sincronización automática bidireccional |
| Email (fase 2) | Resend | Confirmaciones y recordatorios automáticos |
| UI | Tailwind CSS + shadcn/ui | Ya común en ecosistema Next.js |

---

## 5. Arquitectura General

```
┌────────────────────────────────────────────────────────┐
│  VERCEL — Frontend Next.js                             │
│                                                        │
│  /app/(public)      → Sitio para pacientes             │
│  /app/(admin)       → Panel para el dentista           │
│  /app/api/          → API Routes (webhooks, OAuth)     │
└───────────────────────┬────────────────────────────────┘
                        │ fetch / supabase-js
┌───────────────────────▼────────────────────────────────┐
│  SUPABASE                                              │
│                                                        │
│  PostgreSQL + RLS   → Tablas de datos                  │
│  Auth               → Sesión del dentista              │
│  Edge Functions     → Motor de disponibilidad          │
│  Realtime           → Actualizaciones en vivo          │
│  Storage            → Imágenes de servicios            │
│  Database Webhooks  → Disparan sync con Calendar       │
└───────────────────────┬────────────────────────────────┘
                        │ HTTP + OAuth2
┌───────────────────────▼────────────────────────────────┐
│  SERVICIOS EXTERNOS                                    │
│                                                        │
│  Google Calendar API → Espejo de citas                 │
│  Resend (fase 2)     → Emails de confirmación          │
└────────────────────────────────────────────────────────┘
```

### Flujo de reservación (paciente)

```
1. Paciente entra al sitio
2. Selecciona un servicio
3. Sistema consulta disponibilidad real (Edge Function)
4. Paciente elige fecha y hora
5. Ingresa nombre y teléfono
6. Sistema crea la cita en PostgreSQL
7. Database Webhook dispara Edge Function
8. Edge Function crea evento en Google Calendar del dentista
9. Paciente recibe confirmación en pantalla
```

### Flujo de administración (dentista)

```
1. Dentista entra al panel con Magic Link
2. Configura horarios semanales base
3. Agrega excepciones o bloqueos cuando necesita
4. Ve agenda en tiempo real (Supabase Realtime)
5. Puede reagendar o cancelar citas
6. Los cambios se sincronizan automáticamente con Google Calendar
```

---

## 6. Estructura de Base de Datos

### 6.1 Tabla `services`

Catálogo de servicios ofrecidos por el consultorio.

```sql
create table services (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       numeric(10,2),
  duration    int not null,        -- duración en minutos
  image_url   text,
  is_active   boolean default true,
  sort_order  int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
```

### 6.2 Tabla `availability_rules`

Horarios base semanales del consultorio.

```sql
create table availability_rules (
  id         uuid primary key default gen_random_uuid(),
  day_of_week int not null,        -- 0=domingo, 1=lunes, ..., 6=sábado
  start_time  time not null,       -- ej. '09:00'
  end_time    time not null,       -- ej. '14:00'
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- Restricción: no duplicar el mismo día de semana activo
create unique index availability_rules_day_unique
  on availability_rules(day_of_week)
  where is_active = true;
```

### 6.3 Tabla `blocked_slots`

Excepciones dinámicas: bloqueos puntuales, vacaciones, cierres.

```sql
create table blocked_slots (
  id          uuid primary key default gen_random_uuid(),
  date        date,                -- si aplica a un día completo
  start_at    timestamptz,         -- bloqueo parcial desde
  end_at      timestamptz,         -- bloqueo parcial hasta
  reason      text,                -- nota interna (vacaciones, cita personal, etc.)
  is_full_day boolean default false,
  created_at  timestamptz default now()
);
```

### 6.4 Tabla `patients`

Registro básico de pacientes.

```sql
create table patients (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  phone        text not null,
  email        text,
  notes        text,               -- notas internas del dentista
  created_at   timestamptz default now()
);

create unique index patients_phone_unique on patients(phone);
```

### 6.5 Tabla `appointments`

Citas agendadas.

```sql
create table appointments (
  id                  uuid primary key default gen_random_uuid(),
  patient_id          uuid references patients(id),
  service_id          uuid references services(id),
  starts_at           timestamptz not null,
  ends_at             timestamptz not null,
  status              text default 'pending',
                      -- pending | confirmed | cancelled | completed | no_show
  notes               text,        -- nota del paciente al agendar
  internal_notes      text,        -- notas internas del dentista
  google_calendar_event_id text,   -- ID del evento en Google Calendar
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index appointments_starts_at_idx on appointments(starts_at);
create index appointments_status_idx on appointments(status);
```

### 6.6 Tabla `calendar_tokens`

Token OAuth2 del dentista para Google Calendar.

```sql
create table calendar_tokens (
  id             uuid primary key default gen_random_uuid(),
  access_token   text not null,
  refresh_token  text not null,
  expires_at     timestamptz not null,
  updated_at     timestamptz default now()
);

-- Solo debe existir un registro (token del dentista)
```

### 6.7 Row Level Security (RLS)

```sql
-- Pacientes: solo pueden leer servicios y disponibilidad
-- No pueden leer ni escribir directamente appointments
-- Las citas se crean a través de una función con SECURITY DEFINER

alter table services enable row level security;
create policy "servicios visibles al público"
  on services for select using (is_active = true);

alter table appointments enable row level security;
create policy "solo el dentista ve citas"
  on appointments for all using (auth.role() = 'authenticated');

alter table availability_rules enable row level security;
create policy "reglas visibles al público"
  on availability_rules for select using (true);
create policy "solo el dentista modifica reglas"
  on availability_rules for all using (auth.role() = 'authenticated');

alter table blocked_slots enable row level security;
create policy "solo el dentista administra bloqueos"
  on blocked_slots for all using (auth.role() = 'authenticated');

alter table calendar_tokens enable row level security;
create policy "solo el dentista accede al token"
  on calendar_tokens for all using (auth.role() = 'authenticated');
```

---

## 7. Módulos del Sistema

### 7.1 Sitio Público (`/app/(public)`)

**Página de inicio** (`/`)
- Información del consultorio
- CTA principal: "Agenda tu cita"
- Sección de servicios (cards con nombre, descripción y precio)

**Flujo de agendamiento** (`/agendar`)

Paso 1 — Selección de servicio
- Grid de cards de servicios activos
- Cada card muestra: nombre, descripción, duración y precio
- Al seleccionar un servicio → avanza al paso 2

Paso 2 — Selección de fecha
- Calendario interactivo
- Días sin disponibilidad deshabilitados (gris)
- Al seleccionar fecha → carga slots del paso 3

Paso 3 — Selección de horario
- Grid de botones con horarios disponibles
- Calculados en tiempo real por el Motor de Disponibilidad
- Horarios ocupados o bloqueados no aparecen

Paso 4 — Datos del paciente
- Nombre completo (requerido)
- Teléfono (requerido, validado)
- Email (opcional)
- Nota para el dentista (opcional)
- Resumen de la cita antes de confirmar

Paso 5 — Confirmación
- Mensaje de éxito con los detalles de la cita
- Instrucciones para cambios (teléfono del consultorio)

### 7.2 Panel Administrativo (`/app/(admin)`)

Acceso exclusivo para el dentista mediante Magic Link de Supabase Auth.

**Agenda** (`/admin`)
- Vista de calendario semanal con citas del día/semana
- Actualización en tiempo real vía Supabase Realtime
- Click en cita → detalle completo del paciente y servicio
- Acciones por cita: confirmar, reagendar, cancelar, marcar como completada

**Disponibilidad** (`/admin/disponibilidad`)
- Tabla con los 7 días de la semana
- Toggle activo/inactivo por día
- Campos de hora inicio y hora fin por día
- Guardado inmediato al modificar

**Bloqueos** (`/admin/bloqueos`)
- Lista de bloqueos activos y futuros
- Formulario para agregar bloqueo:
  - Tipo: día completo o rango de horas
  - Fecha o rango de fechas
  - Razón (campo libre, interno)
- Eliminar bloqueos existentes

**Servicios** (`/admin/servicios`)
- Lista de servicios con estado activo/inactivo
- Formulario para crear/editar:
  - Nombre, descripción, precio, duración
  - Imagen (upload a Supabase Storage)
  - Estado activo/inactivo
- Reordenar servicios (drag & drop o flechas)

**Configuración** (`/admin/configuracion`)
- Conectar/desconectar Google Calendar (OAuth2)
- Estado de la sincronización
- Datos básicos del consultorio (nombre, teléfono, dirección)

---

## 8. Motor de Disponibilidad

El Motor de Disponibilidad es el núcleo operativo del sistema. Es una Supabase Edge Function que calcula los slots disponibles para una fecha y servicio dados.

### 8.1 Endpoint

```
GET /functions/v1/available-slots?date=YYYY-MM-DD&service_id=UUID
```

### 8.2 Algoritmo

```typescript
async function getAvailableSlots(date: string, serviceId: string): Promise<string[]> {

  // 1. Obtener la duración del servicio
  const service = await getService(serviceId)
  const duration = service.duration // minutos

  // 2. Obtener la regla base para ese día de semana
  const dayOfWeek = new Date(date).getDay()
  const rule = await getAvailabilityRule(dayOfWeek)

  if (!rule || !rule.is_active) return [] // día cerrado

  // 3. Verificar si el día completo está bloqueado
  const fullDayBlock = await getFullDayBlock(date)
  if (fullDayBlock) return []

  // 4. Generar todos los slots posibles (intervalos de 'duration' minutos)
  const allSlots = generateSlots(rule.start_time, rule.end_time, duration)
  // Ejemplo con duración 60min y horario 9:00-14:00:
  // ['09:00', '10:00', '11:00', '12:00', '13:00']

  // 5. Obtener citas existentes del día
  const existingAppointments = await getAppointmentsForDate(date)

  // 6. Obtener bloqueos parciales del día
  const partialBlocks = await getPartialBlocksForDate(date)

  // 7. Filtrar slots que colisionen con citas o bloqueos
  const availableSlots = allSlots.filter(slot => {
    const slotStart = parseTime(date, slot)
    const slotEnd = addMinutes(slotStart, duration)

    const collidesWithAppointment = existingAppointments.some(appt =>
      overlaps(slotStart, slotEnd, appt.starts_at, appt.ends_at)
    )

    const collidesWithBlock = partialBlocks.some(block =>
      overlaps(slotStart, slotEnd, block.start_at, block.end_at)
    )

    return !collidesWithAppointment && !collidesWithBlock
  })

  return availableSlots // ['09:00', '11:00', '13:00']
}
```

### 8.3 Función de colisión

Dos rangos de tiempo se solapan si el inicio de uno es anterior al fin del otro y viceversa:

```typescript
function overlaps(
  aStart: Date, aEnd: Date,
  bStart: Date, bEnd: Date
): boolean {
  return aStart < bEnd && aEnd > bStart
}
```

### 8.4 Creación de cita (función con SECURITY DEFINER)

Para permitir que pacientes anónimos creen citas sin exponer la tabla directamente:

```sql
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
as $$
declare
  v_service       services%rowtype;
  v_patient_id    uuid;
  v_appointment_id uuid;
begin
  -- Obtener servicio y calcular fin
  select * into v_service from services where id = p_service_id and is_active = true;
  if not found then raise exception 'Servicio no válido'; end if;

  -- Verificar que el slot sigue disponible (previene race conditions)
  -- (llamada interna a la lógica del motor)

  -- Crear o recuperar paciente por teléfono
  insert into patients (name, phone, email)
  values (p_patient_name, p_patient_phone, p_patient_email)
  on conflict (phone) do update set name = excluded.name
  returning id into v_patient_id;

  -- Crear la cita
  insert into appointments (patient_id, service_id, starts_at, ends_at, notes, status)
  values (
    v_patient_id,
    p_service_id,
    p_starts_at,
    p_starts_at + (v_service.duration || ' minutes')::interval,
    p_notes,
    'pending'
  )
  returning id into v_appointment_id;

  return v_appointment_id;
end;
$$;
```

---

## 9. Integración con Google Calendar

### 9.1 Estrategia

Google Calendar es el **espejo**, no la fuente de verdad. La lógica de disponibilidad vive completamente en Supabase. El calendario recibe eventos automáticamente cuando se crean o modifican citas.

### 9.2 Flujo de autenticación

1. El dentista va a `/admin/configuracion`
2. Hace click en "Conectar Google Calendar"
3. Se redirige al flujo OAuth2 de Google (`/api/auth/google/callback`)
4. Google devuelve `access_token` y `refresh_token`
5. Los tokens se guardan en la tabla `calendar_tokens` (encriptados)
6. El estado de conexión se muestra en la pantalla de configuración

**Scopes requeridos:**
```
https://www.googleapis.com/auth/calendar.events
```

### 9.3 Sincronización automática

Se usa un **Database Webhook** de Supabase que dispara una Edge Function cuando hay cambios en `appointments`:

```
Supabase Webhook → POST /functions/v1/sync-calendar
  - INSERT en appointments → crear evento en Google Calendar
  - UPDATE status = cancelled → eliminar o actualizar evento
  - UPDATE starts_at → actualizar evento (nuevo horario)
```

### 9.4 Edge Function `sync-calendar`

```typescript
// /supabase/functions/sync-calendar/index.ts

Deno.serve(async (req) => {
  const { type, record } = await req.json() // payload del webhook

  // Obtener token válido (con refresh automático si expiró)
  const token = await getValidToken()

  if (type === 'INSERT') {
    const event = await createCalendarEvent(token, record)
    // Guardar el google_calendar_event_id en la cita
    await supabase
      .from('appointments')
      .update({ google_calendar_event_id: event.id })
      .eq('id', record.id)
  }

  if (type === 'UPDATE' && record.status === 'cancelled') {
    await deleteCalendarEvent(token, record.google_calendar_event_id)
  }

  return new Response('ok')
})
```

### 9.5 Formato del evento en Google Calendar

```json
{
  "summary": "Cita — [Nombre del servicio]",
  "description": "Paciente: [Nombre]\nTeléfono: [Teléfono]\nNota: [Nota]",
  "start": { "dateTime": "2026-05-20T10:00:00-06:00", "timeZone": "America/Mexico_City" },
  "end":   { "dateTime": "2026-05-20T11:00:00-06:00", "timeZone": "America/Mexico_City" },
  "reminders": {
    "useDefault": false,
    "overrides": [{ "method": "popup", "minutes": 60 }]
  }
}
```

---

## 10. Requerimientos No Funcionales

### Rendimiento
- El Motor de Disponibilidad debe responder en menos de 500ms
- El sitio público debe cargarse en menos de 2s (LCP) en conexión 4G
- Las imágenes de servicios deben servirse optimizadas (Next.js Image + Supabase CDN)

### Seguridad
- El panel admin requiere sesión activa de Supabase Auth en todas las rutas
- Las rutas `/admin/*` verifican el JWT en middleware de Next.js
- Los tokens de Google Calendar se almacenan encriptados
- Las citas de pacientes se crean solo a través de funciones con `SECURITY DEFINER`
- RLS activo en todas las tablas

### Disponibilidad
- El sistema debe manejar correctamente la zona horaria `America/Mexico_City`
- Todas las fechas se almacenan en UTC en PostgreSQL
- La conversión a hora local ocurre en el frontend

### Experiencia de usuario
- El flujo de agendamiento es completamente funcional en móvil
- El paso de selección de horario no recarga la página (SPA behavior)
- Los errores de validación se muestran inline, no en alertas del navegador

### Prevención de race conditions
- La función `create_appointment` verifica disponibilidad dentro de la transacción
- Si el slot ya fue tomado entre la consulta y la reservación, devuelve error claro al paciente

---

## 11. Plan de Fases

### Fase 1 — MVP (prioridad inmediata)

**Objetivo:** El dentista deja de gestionar citas por WhatsApp.

- [ ] Configurar Supabase: tablas, RLS, funciones
- [ ] Motor de Disponibilidad (Edge Function)
- [ ] Sitio público: catálogo de servicios
- [ ] Flujo de agendamiento completo (4 pasos)
- [ ] Panel admin: vista de agenda
- [ ] Panel admin: configuración de disponibilidad semanal
- [ ] Panel admin: gestión de bloqueos
- [ ] Integración Google Calendar (OAuth2 + sync automático)
- [ ] Autenticación del dentista (Magic Link)

### Fase 2 — Automatización

**Objetivo:** Reducir intervención manual a cero.

- [ ] Confirmación por email al paciente (Resend)
- [ ] Recordatorio automático 24h antes (pg_cron)
- [ ] Gestión de servicios desde el panel (crear, editar, imagen)
- [ ] Reagendamiento desde el panel admin

### Fase 3 — Escala

**Objetivo:** Plataforma lista para crecer.

- [ ] Notificaciones por WhatsApp (WhatsApp Business API)
- [ ] Historial de pacientes en el panel
- [ ] Estadísticas básicas (citas por mes, servicios más populares)
- [ ] Soporte para múltiples sucursales o dentistas

---

## 12. Estructura de Carpetas

```
/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  # Página de inicio
│   │   └── agendar/
│   │       ├── page.tsx              # Paso 1: selección de servicio
│   │       ├── [serviceId]/
│   │       │   ├── page.tsx          # Paso 2: selección de fecha
│   │       │   └── [date]/
│   │       │       └── page.tsx      # Paso 3: selección de horario + datos
│   │       └── confirmacion/
│   │           └── page.tsx          # Paso 5: confirmación
│   ├── (admin)/
│   │   ├── layout.tsx                # Layout con verificación de sesión
│   │   ├── admin/
│   │   │   ├── page.tsx              # Agenda principal
│   │   │   ├── disponibilidad/
│   │   │   │   └── page.tsx
│   │   │   ├── bloqueos/
│   │   │   │   └── page.tsx
│   │   │   ├── servicios/
│   │   │   │   └── page.tsx
│   │   │   └── configuracion/
│   │   │       └── page.tsx
│   └── api/
│       ├── auth/
│       │   └── google/
│       │       └── callback/
│       │           └── route.ts      # OAuth2 callback de Google
│       └── appointments/
│           └── route.ts              # Endpoint de creación de citas
├── components/
│   ├── booking/                      # Componentes del flujo de agendamiento
│   ├── admin/                        # Componentes del panel admin
│   └── ui/                           # Componentes base (shadcn/ui)
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Cliente del lado del browser
│   │   └── server.ts                 # Cliente del lado del servidor (SSR)
│   ├── google-calendar.ts            # Helpers de la Google Calendar API
│   └── availability.ts              # Helpers de disponibilidad (cliente)
├── supabase/
│   ├── functions/
│   │   ├── available-slots/          # Motor de disponibilidad
│   │   │   └── index.ts
│   │   └── sync-calendar/            # Sincronización con Google Calendar
│   │       └── index.ts
│   └── migrations/                   # Migraciones SQL en orden
│       ├── 001_create_services.sql
│       ├── 002_create_availability_rules.sql
│       ├── 003_create_blocked_slots.sql
│       ├── 004_create_patients.sql
│       ├── 005_create_appointments.sql
│       ├── 006_create_calendar_tokens.sql
│       ├── 007_rls_policies.sql
│       └── 008_create_appointment_function.sql
├── middleware.ts                      # Protección de rutas /admin/*
├── REQUIREMENTS.md                   # Este archivo
└── .env.local                        # Variables de entorno (no commitear)
```

---

## 13. Variables de Entorno

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # Solo en servidor, nunca en cliente

# Google Calendar OAuth2
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://tu-dominio.com/api/auth/google/callback

# App
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
NEXT_PUBLIC_TIMEZONE=America/Mexico_City

# Email (Fase 2)
RESEND_API_KEY=
```

> **Nota de seguridad:** Las variables `SUPABASE_SERVICE_ROLE_KEY` y `GOOGLE_CLIENT_SECRET` nunca deben exponerse al cliente (sin prefijo `NEXT_PUBLIC_`). El token de Google Calendar guardado en la base de datos debe encriptarse con una clave adicional antes de almacenarse.

---

## Decisiones de Diseño Importantes

**¿Por qué Google Calendar no es la fuente de disponibilidad?**  
La API de Google Calendar no tiene un concepto nativo de "horario de trabajo con slots reservables". Consultarla en tiempo real para calcular disponibilidad sería lento, frágil y dependiente de conexión externa. La disponibilidad vive en Supabase y Google Calendar solo recibe los eventos resultantes.

**¿Por qué Magic Link y no usuario/contraseña?**  
El sistema tiene un solo usuario administrador (el dentista). Magic Link elimina el riesgo de contraseña débil, olvidada o comprometida. Es más seguro y más simple de implementar.

**¿Por qué `SECURITY DEFINER` para crear citas?**  
Los pacientes son usuarios anónimos. Con RLS activado, no pueden escribir directamente en `appointments`. La función `create_appointment` opera con permisos elevados pero encapsula toda la validación, evitando exposición directa de la tabla.

**¿Por qué Edge Functions para el motor de disponibilidad y no API Routes de Next.js?**  
El motor necesita acceso directo y rápido a PostgreSQL. Las Edge Functions de Supabase corren junto a la base de datos, reduciendo latencia. También se pueden invocar directamente desde el cliente sin pasar por Vercel.
