import { AppShell } from "@/components/layout/app-shell";

/* Layout das páginas internas. Na Fase 5, este grupo passa a exigir sessão. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return <AppShell>{children}</AppShell>;
}
