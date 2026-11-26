import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";

import { PreferencesScript } from "@/components/preferences/preferences-script";
import { PreferencesSync } from "@/components/preferences/preferences-sync";
import { DEFAULT_PREFERENCES, THEME_COLORS } from "@/config/preferences";
import { siteConfig } from "@/config/site";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
};

// Uma única cor: o script de preferências a ajusta ao tema escolhido (ADR-007).
export const viewport: Viewport = {
  themeColor: THEME_COLORS[DEFAULT_PREFERENCES.theme],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // O HTML do servidor sai com as preferências padrão (tema escuro). O script
    // inline do <head> aplica as preferências salvas antes da primeira pintura;
    // `suppressHydrationWarning` vale só para os atributos deste elemento.
    <html
      lang="pt-BR"
      className={`dark ${manrope.variable} ${fraunces.variable} h-full`}
      data-sidebar={DEFAULT_PREFERENCES.sidebar}
      data-values={DEFAULT_PREFERENCES.values}
      suppressHydrationWarning
    >
      <head>
        <PreferencesScript />
      </head>
      <body className="flex min-h-full flex-col">
        <PreferencesSync />
        {children}
      </body>
    </html>
  );
}
