"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isAdminPath = pathname.startsWith("/skillistanadminventures");

  if (isAdminPath) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
