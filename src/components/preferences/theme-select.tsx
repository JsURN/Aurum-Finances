"use client";

import { useId } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { THEME_LABELS, THEME_PREFERENCES } from "@/config/preferences";
import { isThemePreference } from "@/lib/preferences";

import { setThemePreference, usePreference } from "./use-preference";

/** Seleção de tema da página de Configurações. */
export function ThemeSelect() {
  const id = useId();
  const preference = usePreference("theme");

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>Tema</Label>
      <Select
        // `""` mantém o Select controlado enquanto a preferência ainda não foi lida.
        value={preference ?? ""}
        onValueChange={(value) => {
          if (isThemePreference(value)) setThemePreference(value);
        }}
        disabled={preference === null}
      >
        <SelectTrigger id={id} className="w-full sm:w-64" aria-describedby={`${id}-hint`}>
          <SelectValue placeholder="Carregando…" />
        </SelectTrigger>
        <SelectContent>
          {THEME_PREFERENCES.map((option) => (
            <SelectItem key={option} value={option}>
              {THEME_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p id={`${id}-hint`} className="text-sm text-muted-foreground">
        “Automático” acompanha o tema do sistema operacional. A escolha fica salva neste navegador.
      </p>
    </div>
  );
}
