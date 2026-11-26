/** Primeiro elemento focável da página: pula a navegação e vai ao conteúdo. */
export function SkipLink({ targetId = "content" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform focus-visible:translate-y-0"
    >
      Pular para o conteúdo
    </a>
  );
}
