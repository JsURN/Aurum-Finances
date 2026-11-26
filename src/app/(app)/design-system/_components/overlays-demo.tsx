import { EllipsisIcon, InfoIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { DemoSection } from "./demo-section";

export function OverlaysDemo() {
  return (
    <DemoSection
      id="modais"
      title="Modais e sobreposições"
      description="O foco fica preso dentro do modal, Esc fecha e o foco volta para o botão que o abriu. Nenhuma ação aqui salva dados."
    >
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-5 sm:p-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Abrir modal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modal de exemplo</DialogTitle>
              <DialogDescription>
                Demonstração do componente. Os campos não são enviados nem salvos.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="demo-dialog-name">Nome da meta</Label>
              <Input id="demo-dialog-name" placeholder="Ex.: Viagem" />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Entendi</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Abrir painel lateral</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="pr-12">
              <SheetTitle>Painel lateral</SheetTitle>
              <SheetDescription>
                Usado no menu mobile e, no futuro, em detalhes e filtros.
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Fechar painel</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Mais ações">
              <EllipsisIcon aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <PencilIcon aria-hidden="true" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Trash2Icon aria-hidden="true" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Sobre os tooltips">
              <InfoIcon aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Abre no hover e no foco do teclado.</TooltipContent>
        </Tooltip>
      </div>
    </DemoSection>
  );
}
