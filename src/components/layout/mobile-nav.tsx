"use client";

import { MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { NavList } from "./nav-list";

const DESKTOP_QUERY = "(min-width: 64rem)";

/*
 * Menu mobile (abaixo de 1024px): painel lateral com foco preso, Esc para
 * fechar e foco devolvido ao botão. Fecha ao navegar e ao alargar a janela
 * até o layout de desktop (onde a sidebar assume).
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let media: MediaQueryList;
    try {
      media = window.matchMedia(DESKTOP_QUERY);
    } catch {
      return;
    }
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" aria-label="Abrir menu">
          <MenuIcon aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="gap-0">
        <SheetHeader className="h-16 justify-center px-4 py-0">
          <SheetTitle asChild>
            <div>
              <Logo />
              <span className="sr-only">Menu de navegação</span>
            </div>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Acesse as seções do Aurum Finances.
          </SheetDescription>
        </SheetHeader>
        <nav
          aria-label="Navegação principal"
          className="flex flex-1 flex-col gap-4 overflow-y-auto border-t border-border px-3 py-4"
        >
          <NavList section="main" variant="sheet" onNavigate={close} />
          <div className="mt-auto border-t border-border pt-4">
            <NavList section="settings" variant="sheet" onNavigate={close} />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
