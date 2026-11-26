import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // text-base no mobile evita o zoom automático do iOS ao focar o campo.
        "h-10 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base text-foreground transition-colors duration-150 placeholder:text-muted-foreground md:text-sm",
        "hover:border-muted-foreground focus-visible:border-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-danger",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
