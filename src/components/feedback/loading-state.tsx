import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/*
 * Estado de carregamento. Os blocos são decorativos; o anúncio para leitores de
 * tela é feito uma vez, pela região `role="status"`.
 */

export type LoadingStateProps = {
  /** Texto anunciado para leitores de tela. */
  label?: string;
  variant?: "cards" | "list";
  className?: string;
};

export function LoadingState({
  label = "Carregando…",
  variant = "cards",
  className,
}: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className={cn("flex flex-col gap-4", className)}>
      <span className="sr-only">{label}</span>
      {variant === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex flex-col gap-4 rounded-xl border border-border p-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="flex items-center gap-4 p-4">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
