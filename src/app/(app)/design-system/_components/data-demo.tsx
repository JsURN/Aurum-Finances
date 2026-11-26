import { FlowIndicator } from "@/components/finance/flow-indicator";
import { Money } from "@/components/finance/money";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { demoTransactions } from "./demo-data";
import { DemoSection } from "./demo-section";

const SIGN = { income: 1, expense: -1, transfer: 0 } as const;

export function DataDemo() {
  // Transferências entre contas próprias não entram no resultado do período.
  const result = demoTransactions.reduce((sum, item) => sum + SIGN[item.type] * item.cents, 0);

  return (
    <DemoSection
      id="tabelas"
      title="Tabelas"
      description="A tabela rola na horizontal dentro do próprio contêiner (focável pelo teclado); a página nunca rola na horizontal."
    >
      <div className="rounded-xl border border-border bg-surface">
        <Table scrollLabel="Lançamentos de demonstração">
          <TableCaption className="pb-4">
            Lançamentos fictícios, apenas para demonstração.
          </TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Conta</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demoTransactions.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-muted-foreground tabular-nums">{item.date}</TableCell>
                <TableCell className="font-medium">{item.description}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.category}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.account}</TableCell>
                <TableCell className="text-right">
                  <FlowIndicator
                    type={item.type}
                    cents={item.cents}
                    hideLabel
                    className="justify-end"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4}>Resultado do período (sem transferências)</TableCell>
              <TableCell className="text-right">
                <Money cents={result} signDisplay="always" className="font-semibold" />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </DemoSection>
  );
}
