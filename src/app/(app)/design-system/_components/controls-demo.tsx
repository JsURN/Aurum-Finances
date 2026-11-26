import { ArrowRightIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { DemoLabel, DemoSection } from "./demo-section";

export function ControlsDemo() {
  return (
    <>
      <DemoSection
        id="botoes"
        title="Botões e badges"
        description="Use Tab para ver o foco visível. Desabilitados não recebem foco nem clique."
      >
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex flex-col gap-3">
            <DemoLabel>Variantes</DemoLabel>
            <div className="flex flex-wrap gap-2">
              <Button>Principal</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="outline">Contorno</Button>
              <Button variant="ghost">Discreto</Button>
              <Button variant="destructive">
                <Trash2Icon aria-hidden="true" />
                Excluir
              </Button>
              <Button variant="link" asChild>
                <Link href="/settings">Link</Link>
              </Button>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-3">
            <DemoLabel>Tamanhos e estados</DemoLabel>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Pequeno</Button>
              <Button>Padrão</Button>
              <Button size="lg">
                Grande
                <ArrowRightIcon aria-hidden="true" />
              </Button>
              <Button size="icon" variant="outline" aria-label="Adicionar">
                <PlusIcon aria-hidden="true" />
              </Button>
              <Button disabled>Desabilitado</Button>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-3">
            <DemoLabel>Badges</DemoLabel>
            <div className="flex flex-wrap gap-2">
              <Badge>Padrão</Badge>
              <Badge variant="secondary">Secundário</Badge>
              <Badge variant="outline">Contorno</Badge>
              <Badge variant="gold">Destaque</Badge>
              <Badge variant="success">Recebido</Badge>
              <Badge variant="danger">Atrasado</Badge>
            </div>
          </div>
        </div>
      </DemoSection>

      <DemoSection
        id="formularios"
        title="Formulários"
        description="Campos com rótulo associado, dica, erro anunciado e estado desabilitado. Nada aqui é enviado ou salvo."
      >
        <div className="grid gap-5 rounded-xl border border-border bg-surface p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="demo-description">Descrição</Label>
            <Input id="demo-description" placeholder="Ex.: Mercado" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="demo-amount">Valor</Label>
            <Input
              id="demo-amount"
              inputMode="decimal"
              placeholder="0,00"
              aria-describedby="demo-amount-hint"
            />
            <p id="demo-amount-hint" className="text-sm text-muted-foreground">
              Em reais, com vírgula para os centavos.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="demo-account">Conta</Label>
            <Select>
              <SelectTrigger id="demo-account" className="w-full">
                <SelectValue placeholder="Selecione uma conta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Conta corrente</SelectItem>
                <SelectItem value="savings">Poupança</SelectItem>
                <SelectItem value="wallet">Carteira</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="demo-invalid">Data</Label>
            <Input
              id="demo-invalid"
              defaultValue="31/02/2026"
              aria-invalid="true"
              aria-describedby="demo-invalid-error"
            />
            <p id="demo-invalid-error" className="text-sm text-danger">
              Informe uma data válida.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="demo-disabled">Campo desabilitado</Label>
            <Input id="demo-disabled" disabled placeholder="Indisponível" />
          </div>
        </div>
      </DemoSection>
    </>
  );
}
