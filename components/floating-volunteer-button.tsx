"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartHandshake } from "lucide-react";

export function FloatingVolunteerButton() {
  const pathname = usePathname() || "";
  const isAdminPath = pathname.startsWith("/skillistanadminventures");

  // Hide on admin routes or if already on the volunteer page
  if (isAdminPath || pathname === "/volunteer") {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Link
        href="/volunteer"
        className="flex items-center gap-2 bg-foreground text-background px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors border border-border shadow-lg cursor-pointer select-none"
        aria-label="Volunteer with Skillistan"
      >
        <HeartHandshake className="size-4 shrink-0" />
        <span>Volunteer</span>
      </Link>
    </div>
  );
}
