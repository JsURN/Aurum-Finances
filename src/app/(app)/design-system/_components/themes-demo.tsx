import { Money } from "@/components/finance/money";
import { ProgressBar } from "@/components/finance/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { DemoSection } from "./demo-section";

function ThemeSample({ theme }: { theme: "light" | "dark" }) {
  const title = theme === "light" ? "Tema claro" : "Tema escuro";
  return (
    // As classes `light`/`dark` redefinem os tokens só dentro deste bloco.
    <div className={cn(theme, "rounded-xl border border-border bg-background p-5 text-foreground")}>
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <Badge variant="gold">Prévia</Badge>
        </div>
        <p className="font-display text-3xl font-medium tracking-tight">
          <Money cents={2_438_055} />
        </p>
        <ProgressBar label="Meta" currentCents={320_000} targetCents={500_000} showValues={false} />
        <Input aria-label={`Campo de exemplo (${title})`} placeholder="Campo" />
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Principal</Button>
          <Button size="sm" variant="outline">
            Contorno
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ThemesDemo() {
  return (
    <DemoSection
      id="temas"
      title="Temas claro e escuro"
      description="Os mesmos componentes nos dois temas, lado a lado. Para trocar o tema da aplicação inteira, use o botão de tema no header."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <ThemeSample theme="light" />
        <ThemeSample theme="dark" />
      </div>
    </DemoSection>
  );
}
