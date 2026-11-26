"use client";

import { RotateCwIcon } from "lucide-react";

import { ErrorState } from "@/components/feedback/error-state";
import { Button } from "@/components/ui/button";

/*
 * Erro inesperado em uma página interna. A mensagem técnica não é exibida:
 * em produção ela é genérica, e pode conter detalhes internos.
 */
export default function AppError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <ErrorState
      live
      title="Algo deu errado nesta página"
      action={
        <Button variant="outline" onClick={() => retry()}>
          <RotateCwIcon aria-hidden="true" />
          Tentar novamente
        </Button>
      }
    />
  );
}
