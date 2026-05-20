"use client";

import { useState } from "react";
import type { Service } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface Props {
  initialServices: Service[];
}

interface ServiceForm {
  name: string;
  description: string;
  price: string;
  duration: string;
  is_active: boolean;
}

const EMPTY_FORM: ServiceForm = {
  name: "",
  description: "",
  price: "",
  duration: "60",
  is_active: true,
};

export default function ServicesManager({ initialServices }: Props) {
  const [services, setServices] = useState(initialServices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<ServiceForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(service: Service) {
    setEditingId(service.id);
    setShowAdd(false);
    setForm({
      name: service.name,
      description: service.description ?? "",
      price: service.price?.toString() ?? "",
      duration: service.duration.toString(),
      is_active: service.is_active,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setShowAdd(false);
    setForm(EMPTY_FORM);
    setError(null);
  }

  async function handleSave(e: React.FormEvent, serviceId?: string) {
    e.preventDefault();
    if (!form.name || !form.duration) {
      setError("Nombre y duración son requeridos");
      return;
    }
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const payload = {
      name: form.name,
      description: form.description || null,
      price: form.price ? parseFloat(form.price) : null,
      duration: parseInt(form.duration),
      is_active: form.is_active,
    };

    if (serviceId) {
      const { error: err } = await supabase
        .from("services")
        .update(payload)
        .eq("id", serviceId);

      if (!err) {
        setServices((prev) =>
          prev.map((s) => (s.id === serviceId ? { ...s, ...payload } : s))
        );
        cancelEdit();
      } else {
        setError(err.message);
      }
    } else {
      const { data, error: err } = await supabase
        .from("services")
        .insert({ ...payload, sort_order: services.length + 1 })
        .select()
        .single();

      if (data) {
        setServices((prev) => [...prev, data]);
        cancelEdit();
      } else {
        setError(err?.message ?? "Error al crear");
      }
    }
    setSaving(false);
  }

  async function toggleActive(service: Service) {
    const supabase = createClient();
    await supabase
      .from("services")
      .update({ is_active: !service.is_active })
      .eq("id", service.id);
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, is_active: !s.is_active } : s))
    );
  }

  return (
    <div className="space-y-4">
      {/* Lista de servicios */}
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.id}>
            {editingId === service.id ? (
              <ServiceForm
                form={form}
                onChange={setForm}
                onSave={(e) => handleSave(e, service.id)}
                onCancel={cancelEdit}
                saving={saving}
                error={error}
                title="Editar servicio"
              />
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{service.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${service.is_active
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}>
                      {service.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  {service.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{service.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span>{service.duration} min</span>
                    {service.price !== null && (
                      <span>${service.price.toLocaleString("es-MX")} MXN</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(service)}
                    className="text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    {service.is_active ? "Desactivar" : "Activar"}
                  </button>
                  <button
                    onClick={() => startEdit(service)}
                    className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    Editar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Agregar nuevo */}
      {showAdd ? (
        <ServiceForm
          form={form}
          onChange={setForm}
          onSave={(e) => handleSave(e)}
          onCancel={cancelEdit}
          saving={saving}
          error={error}
          title="Nuevo servicio"
        />
      ) : (
        <button
          onClick={() => { setShowAdd(true); setEditingId(null); setForm(EMPTY_FORM); }}
          className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar servicio
        </button>
      )}
    </div>
  );
}

function ServiceForm({
  form,
  onChange,
  onSave,
  onCancel,
  saving,
  error,
  title,
}: {
  form: ServiceForm;
  onChange: (f: ServiceForm) => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
  title: string;
}) {
  return (
    <form onSubmit={onSave} className="bg-blue-50 dark:bg-slate-700/50 border border-primary/20 rounded-xl p-4 space-y-3">
      <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Nombre *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Duración (min) *</label>
          <input
            type="number"
            value={form.duration}
            min={15}
            step={15}
            onChange={(e) => onChange({ ...form, duration: e.target.value })}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Precio (MXN)</label>
          <input
            type="number"
            value={form.price}
            min={0}
            step={50}
            onChange={(e) => onChange({ ...form, price: e.target.value })}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2 pt-5">
          <input
            type="checkbox"
            id="is_active"
            checked={form.is_active}
            onChange={(e) => onChange({ ...form, is_active: e.target.checked })}
            className="rounded border-slate-300 text-primary focus:ring-primary"
          />
          <label htmlFor="is_active" className="text-sm text-slate-700 dark:text-slate-300">Activo</label>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-slate-500 mb-1">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => onChange({ ...form, description: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
