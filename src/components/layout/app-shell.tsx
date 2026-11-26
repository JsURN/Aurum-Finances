import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";

import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { SkipLink } from "./skip-link";

/**
 * Estrutura das páginas internas: sidebar (desktop), header e área de conteúdo.
 * Separada da landing page, que continua na rota `/` com o próprio layout.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <SkipLink />
      <div className="flex min-h-dvh w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader />
          <main id="content" tabIndex={-1} className="flex-1 outline-none">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
