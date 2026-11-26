import { siteConfig } from "@/config/site";

type LogoMarkProps = {
  className?: string;
};

/** Monograma do Aurum: uma moeda com um "A" geométrico. Decorativo por padrão. */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" className={className}>
      <circle cx="16" cy="16" r="14.5" className="stroke-gold" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="11" className="stroke-gold/35" strokeWidth="1" />
      <path
        d="M10.5 22.5 16 9l5.5 13.5M12.6 17.5h6.8"
        className="stroke-gold"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type LogoProps = {
  className?: string;
};

/** Monograma + wordmark. O texto do nome fica acessível para leitores de tela. */
export function Logo({ className }: LogoProps) {
  return (
    <span className={["inline-flex items-center gap-2.5", className].filter(Boolean).join(" ")}>
      <LogoMark className="size-8 shrink-0" />
      <span className="font-display text-xl font-medium tracking-tight text-foreground">
        {siteConfig.shortName}
        <span className="text-muted-foreground"> Finances</span>
      </span>
    </span>
  );
}
