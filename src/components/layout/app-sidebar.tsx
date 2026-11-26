import Link from "next/link";

import { HOME_LINK_LABEL, Logo } from "@/components/brand/logo";

import { NavList } from "./nav-list";
import { SidebarToggle } from "./sidebar-toggle";

const SIDEBAR_ID = "app-sidebar";

/** Sidebar do desktop (a partir de 1024px). Abaixo disso, o menu é o `MobileNav`. */
export function AppSidebar() {
  return (
    <aside
      id={SIDEBAR_ID}
      aria-label="Barra lateral"
      className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-background transition-[width] duration-200 ease-out lg:flex sidebar-collapsed:w-[4.5rem]"
    >
      <div className="flex h-16 shrink-0 items-center px-4 sidebar-collapsed:justify-center sidebar-collapsed:px-0">
        <Link href="/" aria-label={HOME_LINK_LABEL} className="rounded-md">
          <Logo wordmarkClassName="sidebar-collapsed:hidden" />
        </Link>
      </div>

      <nav
        aria-label="Navegação principal"
        className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto px-3 py-4"
      >
        <NavList section="main" variant="sidebar" />
        <div className="mt-auto border-t border-border pt-4">
          <NavList section="settings" variant="sidebar" />
        </div>
      </nav>

      <div className="shrink-0 border-t border-border px-3 py-3">
        <SidebarToggle controls={SIDEBAR_ID} />
      </div>
    </aside>
  );
}
