"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  BookOpen,
  MessageSquare,
  Mail,
  HeartHandshake,
  UserCheck,
  GraduationCap,
  Crown,
  Plus,
  ArrowUpRight,
  Loader2,
  FileText,
  ChevronRight,
  Layers,
} from "lucide-react";

type StatsData = {
  activeEvents: number;
  publishedStories: number;
  seniorManagement: number;
  employees: number;
  interns: number;
  totalQueries: number;
  newsletterSubmissions: number;
  volunteerSubmissions: number;
  totalEvents: number;
  totalStories: number;
  totalRegistrations: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to load dashboard metrics", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Active Events",
      value: stats ? stats.activeEvents : "-",
      subtext: `Out of ${stats ? stats.totalEvents : 0} total events`,
      icon: Calendar,
      href: "/skillistanadminventures/events",
    },
    {
      title: "Published Stories",
      value: stats ? stats.publishedStories : "-",
      subtext: `Out of ${stats ? stats.totalStories : 0} total articles`,
      icon: BookOpen,
      href: "/skillistanadminventures/stories",
    },
    {
      title: "Senior Management",
      value: stats ? stats.seniorManagement : "-",
      subtext: "Leadership category",
      icon: Crown,
      href: "/skillistanadminventures/team",
    },
    {
      title: "Employees",
      value: stats ? stats.employees : "-",
      subtext: "Staff & trainers",
      icon: UserCheck,
      href: "/skillistanadminventures/team",
    },
    {
      title: "Interns",
      value: stats ? stats.interns : "-",
      subtext: "Active internees",
      icon: GraduationCap,
      href: "/skillistanadminventures/team",
    },
    {
      title: "Total Queries",
      value: stats ? stats.totalQueries : "-",
      subtext: "Contact form & reviews",
      icon: MessageSquare,
      href: "/skillistanadminventures/submissions",
    },
    {
      title: "Newsletter Submissions",
      value: stats ? stats.newsletterSubmissions : "-",
      subtext: "Subscribed readers",
      icon: Mail,
      href: "/skillistanadminventures/submissions",
    },
    {
      title: "Volunteer Submissions",
      value: stats ? stats.volunteerSubmissions : "-",
      subtext: "Volunteer applications",
      icon: HeartHandshake,
      href: "/skillistanadminventures/submissions",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time metrics for events, articles, team rosters, and form submissions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/skillistanadminventures/events"
            className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer select-none"
          >
            <Plus size={14} />
            New Event
          </Link>
          <Link
            href="/skillistanadminventures/stories"
            className="flex items-center gap-1.5 border border-border bg-card px-4 py-2.5 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer select-none"
          >
            <FileText size={14} />
            Write Story
          </Link>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-base font-bold tracking-tight">
            Core Metrics
          </h2>
          {loading && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Loader2 size={12} className="animate-spin text-primary" />
              Loading metrics...
            </span>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group border border-border bg-card p-5 shadow-sm hover:border-primary/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {card.title}
                    </span>
                    <div className="p-1.5 border border-border bg-muted/30 text-foreground">
                      <Icon size={14} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="font-heading text-3xl font-bold tracking-tight text-foreground">
                      {card.value}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{card.subtext}</span>
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-primary"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation & System Health Summary */}
      <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
        {/* Shortcuts */}
        <div className="border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="font-heading text-base font-bold tracking-tight flex items-center gap-2">
            <Layers size={16} className="text-primary" />
            Management Shortcuts
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Quick links to manage website modules and database records.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 pt-1">
            <Link
              href="/skillistanadminventures/events"
              className="p-3 border border-border bg-card hover:bg-muted/40 transition-colors flex items-center justify-between group"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold group-hover:text-primary transition-colors">
                  Events & Registrations
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Manage workshops & attendees
                </p>
              </div>
              <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/skillistanadminventures/stories"
              className="p-3 border border-border bg-card hover:bg-muted/40 transition-colors flex items-center justify-between group"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold group-hover:text-primary transition-colors">
                  Articles & Stories
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Publish news & blog posts
                </p>
              </div>
              <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/skillistanadminventures/team"
              className="p-3 border border-border bg-card hover:bg-muted/40 transition-colors flex items-center justify-between group"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold group-hover:text-primary transition-colors">
                  Team Directory
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Manage staff, leadership & internees
                </p>
              </div>
              <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/skillistanadminventures/programs"
              className="p-3 border border-border bg-card hover:bg-muted/40 transition-colors flex items-center justify-between group"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold group-hover:text-primary transition-colors">
                  Programs Catalog
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Update program descriptions
                </p>
              </div>
              <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>

        {/* Aggregate Health Box */}
        <div className="border border-border bg-card p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="font-heading text-base font-bold tracking-tight">
              Aggregate Summary
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              System totals across registered entries.
            </p>

            <div className="mt-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-muted-foreground">Form Submissions</span>
                <span className="font-bold text-foreground">
                  {stats
                    ? stats.totalQueries + stats.newsletterSubmissions + stats.volunteerSubmissions
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-muted-foreground">Event Registrations</span>
                <span className="font-bold text-foreground">
                  {stats ? stats.totalRegistrations : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Team Roster</span>
                <span className="font-bold text-foreground">
                  {stats
                    ? stats.seniorManagement + stats.employees + stats.interns
                    : 0}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/skillistanadminventures/submissions"
            className="w-full bg-foreground text-background text-center py-2.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors block cursor-pointer select-none"
          >
            Manage All Submissions
          </Link>
        </div>
      </div>
    </div>
  );
}
