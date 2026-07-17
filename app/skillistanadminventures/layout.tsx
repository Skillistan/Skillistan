"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Users,
  FileText,
  Inbox,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Render children directly for the login screen
  if (pathname === "/skillistanadminventures/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/skillistanadminventures/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/skillistanadminventures",
      icon: LayoutDashboard,
    },
    {
      name: "Events",
      href: "/skillistanadminventures/events",
      icon: Calendar,
    },
    {
      name: "Stories & Blog",
      href: "/skillistanadminventures/stories",
      icon: BookOpen,
    },
    {
      name: "Team & Internees",
      href: "/skillistanadminventures/team",
      icon: Users,
    },
    {
      name: "Programs",
      href: "/skillistanadminventures/programs",
      icon: FileText,
    },
    {
      name: "Submissions",
      href: "/skillistanadminventures/submissions",
      icon: Inbox,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.svg"
            alt=""
            width={24}
            height={22}
            className="h-6"
            style={{ width: "auto" }}
          />
          <span className="font-heading font-bold text-lg text-primary">
            Skillistan Admin
          </span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Shell */}
      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-card border-r border-border md:min-h-screen flex flex-col justify-between shrink-0`}
      >
        <div className="p-6">
          <div className="hidden md:block mb-8">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.svg"
                alt=""
                width={28}
                height={26}
                className="h-7"
                style={{ width: "auto" }}
              />
              <span className="font-heading font-bold text-lg text-primary">
                Skillistan
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Management Portal
            </p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
