import { HammerIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { EmptyState } from "./empty-state";

export type InDevelopmentProps = {
  /** Fase do roadmap em que o módulo será entregue. */
  phase: number;
  description?: string;
};

/**
 * Estado das páginas cujo módulo ainda não existe. Não simula dados nem
 * operações: apenas informa o que acontece e quando o módulo chega.
 */
export function InDevelopment({
  phase,
  description = "Esta página ainda não exibe nem registra dados. Ela será liberada quando o módulo for implementado.",
}: InDevelopmentProps) {
  return (
    <EmptyState
      icon={HammerIcon}
      title="Este módulo está em desenvolvimento"
      description={description}
      meta={<Badge variant="gold">Previsto para a Fase {phase} do roadmap</Badge>}
    />
  );
}
