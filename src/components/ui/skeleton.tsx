import * as React from "react";

import { cn } from "@/lib/utils";

/** Bloco de carregamento. Decorativo: o anúncio fica com `LoadingState`. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
