"use client";

import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";

import { setPreference, usePreference } from "@/components/preferences/use-preference";

/*
 * Recolhe/expande a sidebar do desktop. O texto e o ícone mudam por CSS
 * (atributo `data-sidebar` no <html>), então já aparecem certos antes da
 * hidratação. A escolha persiste no navegador.
 */
export function SidebarToggle({ controls }: { controls: string }) {
  const state = usePreference("sidebar");
  const collapsed = state === "collapsed";

  return (
    <button
      type="button"
      aria-controls={controls}
      aria-expanded={state === null ? undefined : !collapsed}
      onClick={() => setPreference("sidebar", collapsed ? "expanded" : "collapsed")}
      className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-highlight hover:text-foreground sidebar-collapsed:justify-center sidebar-collapsed:px-0"
    >
      <PanelLeftCloseIcon
        aria-hidden="true"
        className="size-[1.125rem] shrink-0 sidebar-collapsed:hidden"
      />
      <PanelLeftOpenIcon
        aria-hidden="true"
        className="hidden size-[1.125rem] shrink-0 sidebar-collapsed:block"
      />
      <span className="sidebar-collapsed:hidden">Recolher menu</span>
      <span className="sr-only sidebar-expanded:hidden">Expandir menu</span>
    </button>
  );
}
