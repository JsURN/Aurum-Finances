"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { setPreference, usePreference } from "@/components/preferences/use-preference";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/*
 * Alterna a ocultação de valores financeiros (preferência compartilhada por
 * todos os componentes `Money`). Botão de alternância com `aria-pressed` e
 * rótulo fixo. Os ícones mudam por CSS, a partir de `data-values` no <html>.
 * Privacidade visual, não segurança (ADR-008).
 */

type ValuesVisibilityToggleProps = {
  /** "icon": botão compacto do header. "button": botão com texto (Configurações). */
  variant?: "icon" | "button";
  className?: string;
};

const LABEL = "Ocultar valores financeiros";

export function ValuesVisibilityToggle({
  variant = "icon",
  className,
}: ValuesVisibilityToggleProps) {
  const visibility = usePreference("values");
  const hidden = visibility === "hidden";

  const toggle = () => setPreference("values", hidden ? "visible" : "hidden");

  const icons = (
    <>
      <EyeIcon aria-hidden="true" className="values-hidden:hidden" />
      <EyeOffIcon aria-hidden="true" className="hidden values-hidden:block" />
    </>
  );

  if (variant === "button") {
    return (
      <Button
        type="button"
        variant="outline"
        aria-pressed={hidden}
        disabled={visibility === null}
        onClick={toggle}
        className={cn("aria-pressed:border-accent aria-pressed:text-accent", className)}
      >
        {icons}
        {LABEL}
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={LABEL}
          aria-pressed={hidden}
          onClick={toggle}
          className={cn("aria-pressed:text-accent", className)}
        >
          {icons}
        </Button>
      </TooltipTrigger>
      {/* O tooltip só abre após interação (já hidratado), então pode usar o estado. */}
      <TooltipContent>{hidden ? "Mostrar valores" : "Ocultar valores"}</TooltipContent>
    </Tooltip>
  );
}
