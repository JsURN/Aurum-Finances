"use client";

import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import {
  auxiliaryRoutes,
  isActivePath,
  mainNavigation,
  settingsNavItem,
} from "@/config/navigation";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

const HOME: Crumb = { label: siteConfig.shortName, href: "/dashboard" };

function getTrail(pathname: string): Crumb[] {
  const section = [...mainNavigation, settingsNavItem].find((item) =>
    isActivePath(pathname, item.href),
  );
  if (section) {
    // Páginas de detalhe (fases futuras) ganham um nível a mais aqui.
    return [HOME, { label: section.label }];
  }
  const auxiliary = auxiliaryRoutes.find((route) => isActivePath(pathname, route.href));
  if (auxiliary) return [{ label: auxiliary.parent }, { label: auxiliary.label }];
  return [HOME];
}

/**
 * Trilha de navegação do header. No mobile mostra só a página atual; a partir
 * de 640px mostra a trilha completa.
 */
export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const trail = getTrail(pathname);

  return (
    <nav aria-label="Trilha de navegação" className={cn("min-w-0", className)}>
      <ol className="flex min-w-0 items-center gap-1.5 text-sm">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1;
          return (
            <li
              key={`${crumb.label}-${index}`}
              className={cn("flex min-w-0 items-center gap-1.5", !last && "hidden sm:flex")}
            >
              {last ? (
                <span aria-current="page" className="truncate font-medium text-foreground">
                  {crumb.label}
                </span>
              ) : crumb.href ? (
                <Link
                  href={crumb.href}
                  className="rounded-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-muted-foreground">{crumb.label}</span>
              )}
              {!last ? (
                <ChevronRightIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
