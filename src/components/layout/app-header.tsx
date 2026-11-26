import Link from "next/link";

import { LogoMark } from "@/components/brand/logo";
import { ValuesVisibilityToggle } from "@/components/finance/values-visibility-toggle";
import { ThemeMenu } from "@/components/preferences/theme-menu";

import { Breadcrumbs } from "./breadcrumbs";
import { MobileNav } from "./mobile-nav";

/** Header das páginas internas: menu mobile, trilha e preferências rápidas. */
export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:gap-3 sm:px-6 lg:px-8">
      <MobileNav />
      <Link
        href="/dashboard"
        aria-label="Aurum Finances, ir para a Visão geral"
        className="shrink-0 rounded-md lg:hidden"
      >
        <LogoMark className="size-7" />
      </Link>
      <Breadcrumbs className="flex-1" />
      <div className="flex shrink-0 items-center gap-1">
        <ValuesVisibilityToggle />
        <ThemeMenu />
      </div>
    </header>
  );
}
