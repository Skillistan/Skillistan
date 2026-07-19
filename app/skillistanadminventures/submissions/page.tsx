"use client";

import { useEffect, useState } from "react";
import {
  Inbox,
  Trash2,
  Download,
  Loader2,
  X,
  Mail,
  User,
  Phone,
  Calendar,
  FileText,
} from "lucide-react";

type SubmissionType = "volunteer" | "contact" | "newsletter";

type SubmissionItem = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  mobile?: string;
  message?: string;
  createdAt: string;
};

export default function AdminSubmissionsPage() {
  const [activeTab, setActiveTab] = useState<SubmissionType>("volunteer");
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab counts
  const [counts, setCounts] = useState({
    volunteer: 0,
    contact: 0,
    newsletter: 0,
  });

  // Selected item for reading details in a popup modal
  const [selectedItem, setSelectedItem] = useState<SubmissionItem | null>(null);

  // Loading states
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Custom delete confirmation modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SubmissionItem | null>(null);

  // Error/Toast
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
    fetchCounts();
  }, [activeTab]);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/submissions?type=${activeTab}`);
      if (!res.ok) throw new Error("Failed to load submissions.");
      const data = await res.json();
      setSubmissions(data);
    } catch {
      setError("Could not load submissions. Please reload.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const [volRes, conRes, newsRes] = await Promise.all([
        fetch("/api/admin/submissions?type=volunteer"),
        fetch("/api/admin/submissions?type=contact"),
        fetch("/api/admin/submissions?type=newsletter"),
      ]);

      if (volRes.ok && conRes.ok && newsRes.ok) {
        const volData = await volRes.json();
        const conData = await conRes.json();
        const newsData = await newsRes.json();
        setCounts({
          volunteer: volData.length,
          contact: conData.length,
          newsletter: newsData.length,
        });
      }
    } catch (err) {
      console.error("Failed to load counts:", err);
    }
  };

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = () => {
    setExporting(true);
    try {
      window.open(`/api/admin/submissions/export?type=${activeTab}`, "_blank");
      flash("Export list downloaded successfully.");
    } catch {
      setError("Export failed.");
    } finally {
      setExporting(false);
    }
  };

  const triggerDeleteConfirm = (item: SubmissionItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleteConfirmOpen(false);
    const item = itemToDelete;
    setItemToDelete(null);
    setDeletingId(item.id);
    setError(null);

    try {
      const res = await fetch(`/api/admin/submissions/${activeTab}/${item.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      flash("Submission record deleted.");
      fetchSubmissions();
      fetchCounts();
      if (selectedItem?.id === item.id) {
        setSelectedItem(null);
      }
    } catch {
      setError("Failed to delete record.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const tabs = [
    { id: "volunteer" as const, name: "Volunteer Applications", count: counts.volunteer },
    { id: "contact" as const, name: "Contact Messages", count: counts.contact },
    { id: "newsletter" as const, name: "Newsletter Subscribers", count: counts.newsletter },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Form Submissions</h1>
          <p className="text-muted-foreground mt-1">
            Review volunteer applications, subscriber lists, and messages sent by visitors.
          </p>
        </div>
        {submissions.length > 0 && (
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex w-fit items-center gap-2 bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 select-none cursor-pointer disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Download size={16} />
            )}
            Export List
          </button>
        )}
      </div>

      {/* Toast feedback alerts */}
      {toast && (
        <div className="border border-primary/40 bg-primary/5 p-4 text-sm text-primary font-medium">
          {toast}
        </div>
      )}
      {error && (
        <div className="border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      {/* Tabs Layout */}
      <div className="border-b border-border">
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors flex items-center select-none cursor-pointer ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.name}
              <span className="ml-2 bg-muted text-muted-foreground px-1.5 py-0.5 text-xs font-bold rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content view */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border bg-card/50 text-center">
          <div className="bg-primary/10 text-primary p-3 rounded-full mb-4">
            <Inbox size={24} />
          </div>
          <h3 className="font-heading text-lg font-semibold">No submissions received</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Everything is quiet for now. When users submit forms on the website, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => {
            const hasName = sub.firstName || sub.lastName;
            const displayName = hasName ? `${sub.firstName || ""} ${sub.lastName || ""}`.trim() : sub.email;
            const initials = hasName ? `${sub.firstName?.[0] || ""}${sub.lastName?.[0] || ""}`.toUpperCase() : "";

            return (
              <div
                key={sub.id}
                onClick={() => activeTab !== "newsletter" && setSelectedItem(sub)}
                className={`flex flex-col md:flex-row md:items-center gap-4 p-5 border border-border bg-card hover:bg-muted/30 hover:border-primary/20 hover:shadow-sm transition-all duration-300 ${
                  activeTab !== "newsletter" ? "cursor-pointer" : ""
                }`}
              >
                {/* User Avatar Initials Badge */}
                <div className="flex items-center justify-center size-10 bg-primary/10 border border-primary/20 text-primary font-heading font-bold text-xs uppercase select-none shrink-0 rounded-sm">
                  {initials ? initials : <Mail size={14} />}
                </div>

                {/* Main info row */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading font-bold text-foreground text-sm truncate">
                      {displayName}
                    </span>
                    {activeTab !== "newsletter" && (
                      <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 border border-border select-all">
                        {sub.email}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {sub.mobile && (
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="size-3 text-primary" />
                        {sub.mobile}
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <Calendar className="size-3 text-primary" />
                      {formatDate(sub.createdAt)}
                    </span>
                  </div>
                  {sub.message && (
                    <div className="mt-2 text-xs text-muted-foreground leading-relaxed max-w-3xl line-clamp-1 border-l-2 border-primary/20 pl-2 italic">
                      "{sub.message}"
                    </div>
                  )}
                </div>

                {/* Actions column */}
                <div className="shrink-0 flex items-center gap-2 justify-end mt-2 md:mt-0" onClick={(e) => e.stopPropagation()}>
                  {activeTab !== "newsletter" && (
                    <button
                      onClick={() => setSelectedItem(sub)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-500/10 text-zinc-600 border border-zinc-500/25 hover:bg-zinc-500/20 transition-colors select-none cursor-pointer"
                    >
                      <FileText size={12} className="shrink-0" />
                      View Details
                    </button>
                  )}
                  <button
                    onClick={(e) => triggerDeleteConfirm(sub, e)}
                    disabled={deletingId === sub.id}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer"
                  >
                    {deletingId === sub.id ? (
                      <Loader2 className="animate-spin size-3 shrink-0" />
                    ) : (
                      <Trash2 size={12} className="shrink-0" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/*  Inquiry Detailed Read-Only Drawer Sheet                      */}
      {/* ============================================================ */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg border-l border-border bg-card shadow-2xl h-full flex flex-col justify-between">
            {/* Header */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  {activeTab === "volunteer" ? "Volunteer Application" : "Inquiry Message Details"}
                </h2>
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                  ID: {selectedItem.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Details content body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Meta section */}
              <div className="grid grid-cols-2 gap-4 border border-border bg-muted/10 p-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Submitted Date
                  </p>
                  <p className="text-xs font-semibold text-foreground mt-1 flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-primary" />
                    {formatDate(selectedItem.createdAt).split(",")[0]}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Time Stamp
                  </p>
                  <p className="text-xs font-semibold text-foreground mt-1">
                    {formatDate(selectedItem.createdAt).split(",")[1]}
                  </p>
                </div>
              </div>

              {/* Applicant Fields */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <User className="size-4 text-primary shrink-0" />
                    Full name
                  </p>
                  <p className="text-sm font-heading font-bold text-foreground mt-1 border-b border-border pb-2 pl-6">
                    {selectedItem.firstName} {selectedItem.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Mail className="size-4 text-primary shrink-0" />
                    Email address
                  </p>
                  <p className="text-sm font-mono text-foreground mt-1 border-b border-border pb-2 pl-6">
                    {selectedItem.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Phone className="size-4 text-primary shrink-0" />
                    Mobile contact number
                  </p>
                  <p className="text-sm font-mono text-foreground mt-1 border-b border-border pb-2 pl-6">
                    {selectedItem.mobile || "None provided"}
                  </p>
                </div>
              </div>

              {/* Text content details */}
              {selectedItem.message && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {activeTab === "volunteer" ? "Area of Interest / Application notes" : "Message details"}
                  </p>
                  <div className="border border-border bg-card p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {selectedItem.message}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex justify-between gap-3 shrink-0">
              <button
                onClick={(e) => triggerDeleteConfirm(selectedItem, e)}
                className="bg-destructive/10 text-destructive border border-destructive/20 px-4 py-2 text-xs font-medium hover:bg-destructive hover:text-white transition-colors cursor-pointer select-none"
              >
                Delete Record
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer select-none"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Custom Delete Submission Confirmation Modal                  */}
      {/* ============================================================ */}
      {deleteConfirmOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md border border-border bg-card p-6 md:p-8 shadow-lg">
            <h3 className="font-heading text-lg font-bold text-destructive flex items-center gap-2 select-none">
              <Trash2 size={20} className="shrink-0" />
              Delete Record
            </h3>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed text-pretty">
              Are you sure you want to delete this submission record?
              <br />
              This will permanently delete this record from the database. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setItemToDelete(null);
                }}
                className="border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer select-none"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-destructive text-white px-4 py-2 text-xs font-medium hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer select-none"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
