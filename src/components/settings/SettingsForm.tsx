"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface SettingsFormProps {
  name: string;
  email: string;
  phone: string;
}

export function SettingsForm({ name, email, phone }: SettingsFormProps) {
  const [p, setP] = useState(phone);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setErr(null);
    setSaved(false);
    const res = await fetch("/api/user/phone", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: p }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error ?? "Erro ao salvar");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    }
    setSaving(false);
  }

  return (
    <div className="mt-3 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Nome">
          <input
            value={name}
            disabled
            className="w-full px-3 py-2.5 rounded-xl bg-muted/60 border border-border text-sm opacity-70"
          />
        </Field>
        <Field label="E-mail">
          <input
            value={email}
            disabled
            className="w-full px-3 py-2.5 rounded-xl bg-muted/60 border border-border text-sm opacity-70"
          />
        </Field>
      </div>
      <Field
        label="Telefone (só usamos se você pedir suporte)"
        hint="🔒 Não compartilhamos com terceiros. Você pode deixar em branco."
      >
        <input
          value={p}
          onChange={(e) => setP(e.target.value)}
          placeholder="(11) 99999-9999"
          className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus-glow"
        />
      </Field>

      {err && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm p-2.5">
          {err}
        </div>
      )}
      {saved && (
        <div className="rounded-xl border border-success/30 bg-success/10 text-success text-sm p-2.5">
          ✅ Telefone salvo com sucesso
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={save} loading={saving} size="sm">
          Salvar telefone
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>
      )}
    </div>
  );
}
