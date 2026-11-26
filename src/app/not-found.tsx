import type { Metadata } from "next";
import Link from "next/link";

import { LogoMark } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <LogoMark className="size-12" />
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold tracking-[0.2em] text-gold uppercase">Erro 404</p>
        <h1 className="font-display text-3xl font-medium tracking-tight">Página não encontrada</h1>
        <p className="text-muted-foreground">O endereço acessado não existe ou foi movido.</p>
      </div>
      <Link
        href="/"
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Voltar para o início
      </Link>
    </main>
  );
}
