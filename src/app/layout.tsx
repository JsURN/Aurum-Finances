import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";

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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#101014" },
    { media: "(prefers-color-scheme: light)", color: "#f8f6f3" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Tema escuro é o padrão. A alternância de tema chega na Fase 2 (Design System).
    <html lang="pt-BR" className={`dark ${manrope.variable} ${fraunces.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
