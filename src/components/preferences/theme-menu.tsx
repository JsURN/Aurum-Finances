"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THEME_LABELS, THEME_PREFERENCES } from "@/config/preferences";
import { isThemePreference } from "@/lib/preferences";

import { setThemePreference, usePreference } from "./use-preference";

const THEME_ICONS = { dark: MoonIcon, light: SunIcon, system: MonitorIcon } as const;

/** Alternância de tema do header: Claro, Escuro ou Automático. */
export function ThemeMenu() {
  const preference = usePreference("theme");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Tema da interface">
          {/* O ícone segue o tema aplicado via CSS, então não depende da hidratação. */}
          <SunIcon aria-hidden="true" className="dark:hidden" />
          <MoonIcon aria-hidden="true" className="hidden dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Tema</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={preference ?? ""}
          onValueChange={(value) => {
            if (isThemePreference(value)) setThemePreference(value);
          }}
        >
          {THEME_PREFERENCES.map((option) => {
            const Icon = THEME_ICONS[option];
            return (
              <DropdownMenuRadioItem key={option} value={option}>
                <Icon aria-hidden="true" />
                {THEME_LABELS[option]}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
