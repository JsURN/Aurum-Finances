"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { usePreference } from "@/components/preferences/use-preference";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { isActivePath, mainNavigation, settingsNavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

/*
 * Lista de links do App Shell, usada na sidebar do desktop e no menu mobile.
 * - A página ativa recebe `aria-current="page"` e um indicador que não depende
 *   só de cor (barra lateral + peso da fonte).
 * - Na sidebar recolhida, o rótulo fica disponível para leitores de tela
 *   (`sr-only`) e aparece visualmente num tooltip, no hover e no foco.
 * Os itens vêm da configuração dentro do próprio componente cliente: ícones são
 * funções e não podem ser passados de um Server Component como prop.
 */

type NavListItem = { label: string; href: string; icon: LucideIcon };

const SECTIONS = {
  main: mainNavigation,
  settings: [settingsNavItem],
} as const satisfies Record<string, readonly NavListItem[]>;

type NavListProps = {
  section: keyof typeof SECTIONS;
  /** "sidebar": responde ao estado recolhido. "sheet": sempre com rótulos. */
  variant: "sidebar" | "sheet";
  onNavigate?: () => void;
};

export function NavList({ section, variant, onNavigate }: NavListProps) {
  const items: readonly NavListItem[] = SECTIONS[section];
  const pathname = usePathname();
  const collapsed = usePreference("sidebar") === "collapsed" && variant === "sidebar";
  const inSidebar = variant === "sidebar";

  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((item) => {
        const active = isActivePath(pathname, item.href);
        const Icon = item.icon;

        const link = (
          <Link
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              "group relative flex h-10 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-highlight hover:text-foreground",
              "aria-[current=page]:bg-highlight aria-[current=page]:font-semibold aria-[current=page]:text-foreground",
              "before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-accent before:opacity-0 aria-[current=page]:before:opacity-100",
              inSidebar && "sidebar-collapsed:justify-center sidebar-collapsed:px-0",
            )}
          >
            <Icon
              aria-hidden="true"
              className="size-[1.125rem] shrink-0 group-aria-[current=page]:text-accent"
            />
            <span className={cn("truncate", inSidebar && "sidebar-collapsed:sr-only")}>
              {item.label}
            </span>
          </Link>
        );

        return (
          <li key={item.href}>
            {inSidebar ? (
              <Tooltip>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                {/* Só existe com a sidebar recolhida, para não repetir o rótulo visível. */}
                {collapsed ? <TooltipContent side="right">{item.label}</TooltipContent> : null}
              </Tooltip>
            ) : (
              link
            )}
          </li>
        );
      })}
    </ul>
  );
}
