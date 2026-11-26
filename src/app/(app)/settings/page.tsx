import { SwatchBookIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { InDevelopment } from "@/components/feedback/in-development";
import { ValuesVisibilityToggle } from "@/components/finance/values-visibility-toggle";
import { PageHeader } from "@/components/layout/page-header";
import { ThemeSelect } from "@/components/preferences/theme-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = { title: "Configurações" };

const isDevelopment = process.env.NODE_ENV === "development";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Configurações"
        description="Preferências de aparência e de exibição. Elas ficam salvas neste navegador."
      />

      <Tabs defaultValue="appearance">
        <TabsList aria-label="Seções das configurações">
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="display">Exibição</TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2>Tema da interface</h2>
              </CardTitle>
              <CardDescription>
                Escolha entre o tema escuro (padrão), o claro ou o automático.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeSelect />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2>Ocultar valores financeiros</h2>
              </CardTitle>
              <CardDescription>
                Troca os valores por “R$ •••••” em todas as telas, por exemplo ao usar o Aurum em
                público. Leitores de tela passam a anunciar “Valor oculto”.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-4">
              <ValuesVisibilityToggle variant="button" />
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Este recurso é apenas visual e <strong className="text-foreground">não</strong> é um
                mecanismo de segurança: os valores continuam carregados na página e qualquer pessoa
                com acesso a este navegador pode exibi-los de novo.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <InDevelopment
            phase={5}
            description="Perfil, sessão e segurança da conta chegam junto com a autenticação."
          />
        </TabsContent>
      </Tabs>

      {isDevelopment ? (
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Desenvolvimento</h2>
            </CardTitle>
            <CardDescription>
              Visível apenas em ambiente de desenvolvimento. Em produção, esta seção não existe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/design-system">
                <SwatchBookIcon aria-hidden="true" />
                Abrir o Design System
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
