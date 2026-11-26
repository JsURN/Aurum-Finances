import { getPreferencesScript } from "@/lib/preferences-script";

/**
 * Script inline do <head> que aplica tema, sidebar e ocultação de valores antes
 * da primeira pintura (ver `src/lib/preferences-script.ts` e ADR-007).
 * Server Component: o conteúdo é gerado no build, sem dados do usuário.
 */
export function PreferencesScript() {
  return <script dangerouslySetInnerHTML={{ __html: getPreferencesScript() }} />;
}
