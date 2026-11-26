import type { Metadata } from "next";

import { InDevelopment } from "@/components/feedback/in-development";
import { PageHeader } from "@/components/layout/page-header";
import { getNavItem } from "@/config/navigation";

const item = getNavItem("/receivables");

export const metadata: Metadata = { title: item.label };

export default function ReceivablesPage() {
  return (
    <>
      <PageHeader title={item.label} description={item.description} />
      <InDevelopment phase={item.phase} />
    </>
  );
}
