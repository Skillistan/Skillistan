"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Loader2,
  Users,
  Download,
  Clock,
  MapPin,
  Eye,
  EyeOff,
  Globe,
  FileText,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type EventRegistration = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  message: string | null;
  createdAt: string;
};

type EventType = {
  id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  location: string;
  imageUrl: string | null;
  registrationEnabled: boolean;
  status: string;
  createdAt: string;
  _count?: { registrations: number };
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

const formatListDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatListTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

const toLocalDatetimeValue = (iso: string) => {
  const d = new Date(iso);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
};

const statusLabel: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

const TITLE_MAX = 80;
const LOCATION_MAX = 100;
const DESCRIPTION_MAX = 1000;

/* ------------------------------------------------------------------ */
/*  Reusable tiny components                                           */
/* ------------------------------------------------------------------ */

const Badge = ({
  children,
  variant = "muted",
}: {
  children: React.ReactNode;
  variant?: "primary" | "muted" | "success" | "warn";
}) => {
  const styles: Record<string, string> = {
    primary: "bg-primary text-primary-foreground font-bold shadow-sm",
    muted: "bg-zinc-600 text-white font-bold shadow-sm",
    success: "bg-emerald-600 text-white font-bold shadow-sm",
    warn: "bg-amber-500 text-white font-bold shadow-sm",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

const CharCounter = ({
  current,
  max,
}: {
  current: number;
  max: number;
}) => (
  <span
    className={`text-[10px] tabular-nums ${
      current > max
        ? "text-destructive font-bold"
        : current > max * 0.85
        ? "text-amber-600"
        : "text-muted-foreground"
    }`}
  >
    {current}/{max}
  </span>
);

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");

  // Modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [status, setStatus] = useState("draft");

  // Derived slug (never editable)
  const derivedSlug = (() => {
    const base = slugify(title);
    const datePart = eventDate ? eventDate.split("T")[0] : "";
    return base + (datePart ? `-${datePart}` : "");
  })();

  // Registrations drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerEvent, setDrawerEvent] = useState<EventType | null>(null);
  const [registrants, setRegistrants] = useState<EventRegistration[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Feedback
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Loading states for actions in the list
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Custom confirmation modal states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventType | null>(null);
  const [regDeleteConfirmOpen, setRegDeleteConfirmOpen] = useState(false);
  const [regToDelete, setRegToDelete] = useState<EventRegistration | null>(null);

  /* ---- data fetching ---- */

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events");
      if (!res.ok) throw new Error("Failed to load events.");
      setEvents(await res.json());
    } catch {
      setFormError("Could not load events. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrants = async (id: string) => {
    setLoadingRegs(true);
    setRegError(null);
    try {
      const res = await fetch(`/api/admin/events/${id}/registrations`);
      if (!res.ok) throw new Error();
      setRegistrants(await res.json());
    } catch {
      setRegError("Failed to load registrations.");
    } finally {
      setLoadingRegs(false);
    }
  };

  /* ---- modal openers ---- */

  const openCreate = () => {
    setEditingEvent(null);
    setTitle("");
    setDescription("");
    setEventDate("");
    setLocation("");
    setImageUrl(null);
    setRegistrationEnabled(true);
    setStatus("draft");
    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  };

  const openEdit = (ev: EventType) => {
    setEditingEvent(ev);
    setTitle(ev.title);
    setDescription(ev.description);
    setEventDate(toLocalDatetimeValue(ev.eventDate));
    setLocation(ev.location);
    setImageUrl(ev.imageUrl);
    setRegistrationEnabled(ev.registrationEnabled);
    setStatus(ev.status);
    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  };

  const openRegistrants = (ev: EventType) => {
    setDrawerEvent(ev);
    setRegistrants([]);
    setDrawerOpen(true);
    fetchRegistrants(ev.id);
  };

  /* ---- image upload ---- */

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image must be under 5 MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file.");
      return;
    }
    setUploading(true);
    setFormError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setImageUrl(data.imageUrl);
      flash("Banner uploaded.");
    } catch (err: any) {
      setFormError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  /* ---- form submission ---- */

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = "Title is required.";
    else if (title.trim().length > TITLE_MAX)
      errors.title = `Title must be ${TITLE_MAX} characters or fewer.`;
    if (!eventDate) errors.eventDate = "Event date and time are required.";
    if (location.trim().length > LOCATION_MAX)
      errors.location = `Location must be ${LOCATION_MAX} characters or fewer.`;
    if (description.trim().length > DESCRIPTION_MAX)
      errors.description = `Description must be ${DESCRIPTION_MAX} characters or fewer.`;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setFormError(null);

    // Use existing slug when editing, derived slug when creating
    const slug = editingEvent ? editingEvent.slug : derivedSlug;

    const payload = {
      title: title.trim(),
      slug,
      description: description.trim(),
      eventDate: new Date(eventDate).toISOString(),
      location: location.trim(),
      imageUrl,
      registrationEnabled,
      status,
    };

    try {
      const url = editingEvent
        ? `/api/admin/events/${editingEvent.id}`
        : "/api/admin/events";
      const method = editingEvent ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed.");
      flash(editingEvent ? "Event updated." : "Event created.");
      setFormOpen(false);
      fetchEvents();
    } catch (err: any) {
      setFormError(err.message || "Could not save event.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- actions ---- */

  const triggerDeleteConfirm = (ev: EventType) => {
    setEventToDelete(ev);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;
    setDeleteConfirmOpen(false);
    const ev = eventToDelete;
    setEventToDelete(null);
    setDeletingId(ev.id);
    try {
      const res = await fetch(`/api/admin/events/${ev.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      flash("Event deleted.");
      fetchEvents();
    } catch {
      setFormError("Failed to delete event.");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleRegistration = async (ev: EventType) => {
    setTogglingId(ev.id);
    try {
      const res = await fetch(`/api/admin/events/${ev.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...ev,
          registrationEnabled: !ev.registrationEnabled,
        }),
      });
      if (!res.ok) throw new Error();
      fetchEvents();
    } catch {
      setFormError("Failed to toggle registration.");
    } finally {
      setTogglingId(null);
    }
  };

  const triggerCancelRegConfirm = (reg: EventRegistration) => {
    setRegToDelete(reg);
    setRegDeleteConfirmOpen(true);
  };

  const confirmCancelRegistration = async () => {
    if (!regToDelete) return;
    setRegDeleteConfirmOpen(false);
    const reg = regToDelete;
    setRegToDelete(null);
    try {
      const res = await fetch(
        `/api/admin/events/registrations/${reg.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      if (drawerEvent) {
        fetchRegistrants(drawerEvent.id);
        fetchEvents();
      }
    } catch {
      setRegError("Failed to cancel registration.");
    }
  };

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  /* ---- derived lists ---- */

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const upcoming = events.filter((e) => new Date(e.eventDate) >= now);
  const past = events.filter((e) => new Date(e.eventDate) < now);
  const list = activeTab === "active" ? upcoming : past;

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Events
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage workshops, bootcamps, and community programs.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex w-fit items-center gap-2 bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          New Event
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {(["active", "past"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "active"
              ? `Upcoming (${upcoming.length})`
              : `Past (${past.length})`}
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="border border-primary/40 bg-primary/5 p-4 text-sm text-primary font-medium">
          {toast}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border bg-card/50 text-center">
          <span className="flex size-12 items-center justify-center bg-primary/10 text-primary mb-4">
            <Calendar size={22} />
          </span>
          <h3 className="font-heading text-lg font-semibold">
            {activeTab === "active"
              ? "No upcoming events"
              : "No past events recorded"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {activeTab === "active"
              ? 'Click "New Event" to create your first workshop or bootcamp.'
              : "Events whose dates have passed will appear here automatically."}
          </p>
        </div>
      ) : (
        <div className="space-y-0 border border-border divide-y divide-border bg-card">
          {list.map((ev) => {
            const regCount = ev._count?.registrations || 0;
            const isPast = new Date(ev.eventDate) < now;
            return (
              <div
                key={ev.id}
                className="flex flex-col md:flex-row md:items-center gap-4 p-5 md:p-6 transition-colors hover:bg-muted/30"
              >
                {/* Thumbnail */}
                <div className="relative w-full md:w-40 aspect-[16/9] md:aspect-[16/10] overflow-hidden bg-muted border border-border shrink-0">
                  {ev.imageUrl ? (
                    <Image
                      src={ev.imageUrl}
                      alt={ev.title}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-primary/5 text-primary select-none px-2">
                      <Calendar className="size-6 opacity-40" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        ev.status === "published"
                          ? "success"
                          : ev.status === "archived"
                          ? "muted"
                          : "warn"
                      }
                    >
                      {statusLabel[ev.status] || ev.status}
                    </Badge>
                    {!isPast && (
                      <Badge
                        variant={ev.registrationEnabled ? "primary" : "muted"}
                      >
                        {ev.registrationEnabled ? "Registration Open" : "Registration Closed"}
                      </Badge>
                    )}
                    <button
                      onClick={() => openRegistrants(ev)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 hover:bg-emerald-500/20 transition-colors select-none cursor-pointer"
                      title="Click to view registrations drawer"
                    >
                      <Users size={10} className="shrink-0" />
                      {regCount} Registration{regCount !== 1 ? "s" : ""}
                    </button>
                  </div>

                  <h3 className="font-heading text-base font-bold text-foreground truncate mt-1">
                    {ev.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-primary" />
                      {formatListDate(ev.eventDate)} ·{" "}
                      {formatListTime(ev.eventDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-primary" />
                      {ev.location || "Online"}
                    </span>
                  </div>

                  {ev.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed max-w-2xl">
                      {ev.description}
                    </p>
                  )}

                  <p className="text-[10px] text-muted-foreground font-mono">
                    /events/{ev.slug}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0 w-full md:w-36 md:items-stretch mt-3 md:mt-0">
                  {!isPast && (
                    <button
                      onClick={() => toggleRegistration(ev)}
                      disabled={togglingId === ev.id || deletingId === ev.id}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-zinc-500/10 text-zinc-600 border border-zinc-500/25 hover:bg-zinc-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer"
                    >
                      {togglingId === ev.id ? (
                        <Loader2 className="animate-spin size-3 shrink-0" />
                      ) : ev.registrationEnabled ? (
                        <EyeOff size={13} className="shrink-0" />
                      ) : (
                        <Eye size={13} className="shrink-0" />
                      )}
                      {ev.registrationEnabled ? "Close Reg" : "Open Reg"}
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(ev)}
                    disabled={togglingId === ev.id || deletingId === ev.id}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-zinc-500/10 text-zinc-600 border border-zinc-500/25 hover:bg-zinc-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer"
                  >
                    <Pencil size={13} className="shrink-0" />
                    Edit
                  </button>
                  <button
                    onClick={() => triggerDeleteConfirm(ev)}
                    disabled={togglingId === ev.id || deletingId === ev.id}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer"
                  >
                    {deletingId === ev.id ? (
                      <Loader2 className="animate-spin size-3 shrink-0" />
                    ) : (
                      <Trash2 size={13} className="shrink-0" />
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
      {/*  Create / Edit Modal                                          */}
      {/* ============================================================ */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl border border-border bg-card shadow-lg max-h-[92vh] overflow-y-auto">
            {/* Modal header */}
            <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold tracking-tight">
                  {editingEvent ? "Edit Event" : "Create Event"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {editingEvent
                    ? "Update the event details below."
                    : "Fill in the details for your new event."}
                </p>
              </div>
              <button
                onClick={() => setFormOpen(false)}
                className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {formError && (
                <div className="border border-destructive/40 bg-destructive/5 p-4 text-xs text-destructive font-medium">
                  {formError}
                </div>
              )}

              <fieldset disabled={submitting} className="space-y-6 disabled:opacity-75">
                {/* Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="ev-title"
                      className="text-sm font-medium"
                    >
                      Event title <span className="text-primary">*</span>
                    </label>
                    <CharCounter current={title.length} max={TITLE_MAX} />
                  </div>
                  <input
                    id="ev-title"
                    type="text"
                    required
                    maxLength={TITLE_MAX}
                    placeholder="e.g. Digital Freelancing Bootcamp"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {fieldErrors.title && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.title}
                    </p>
                  )}
                </div>

                {/* Date & Location */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ev-date"
                      className="text-sm font-medium"
                    >
                      Date & time <span className="text-primary">*</span>
                    </label>
                    <input
                      id="ev-date"
                      type="datetime-local"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {fieldErrors.eventDate && (
                      <p className="text-xs text-destructive">
                        {fieldErrors.eventDate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="ev-location"
                        className="text-sm font-medium"
                      >
                        Location
                      </label>
                      <CharCounter
                        current={location.length}
                        max={LOCATION_MAX}
                      />
                    </div>
                    <input
                      id="ev-location"
                      type="text"
                      maxLength={LOCATION_MAX}
                      placeholder="e.g. Bahria Town Phase 4, Islamabad / Online (Zoom)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {fieldErrors.location && (
                      <p className="text-xs text-destructive">
                        {fieldErrors.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="ev-desc"
                      className="text-sm font-medium"
                    >
                      Description
                    </label>
                    <CharCounter
                      current={description.length}
                      max={DESCRIPTION_MAX}
                    />
                  </div>
                  <textarea
                    id="ev-desc"
                    rows={5}
                    maxLength={DESCRIPTION_MAX}
                    placeholder="Event overview, schedule outline, and what attendees will learn…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                  />
                  {fieldErrors.description && (
                    <p className="text-xs text-destructive">
                      {fieldErrors.description}
                    </p>
                  )}
                </div>

                {/* Cover banner upload */}
                <div className="space-y-3 border border-border p-4 bg-muted/10">
                  <label className="text-sm font-medium">
                    Cover banner
                  </label>
                  <div className="flex gap-4 items-start">
                    {/* Preview */}
                    <div className="relative aspect-[16/9] w-28 overflow-hidden border border-border bg-muted shrink-0 flex items-center justify-center">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt="Banner preview"
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      ) : (
                        <FileText className="text-muted-foreground/40 size-6" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <label
                        htmlFor="ev-banner"
                        className={`inline-flex items-center gap-2 border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors ${
                          uploading || submitting ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"
                        }`}
                      >
                        {uploading ? (
                          <Loader2
                            className="animate-spin text-primary"
                            size={14}
                          />
                        ) : (
                          <Upload size={14} />
                        )}
                        {uploading ? "Uploading…" : "Choose image"}
                      </label>
                      <input
                        id="ev-banner"
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading || submitting}
                        className="hidden"
                      />
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Recommended: 1200×675 px (16:9). Max 5 MB.
                      </p>
                      {imageUrl && (
                        <button
                          type="button"
                          onClick={() => setImageUrl(null)}
                          disabled={uploading || submitting}
                          className="text-xs text-destructive hover:underline disabled:opacity-50"
                        >
                          Remove image
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status & registration */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="ev-status"
                      className="text-sm font-medium"
                    >
                      Publication status
                    </label>
                    <select
                      id="ev-status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full border border-border bg-card hover:bg-muted/40 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-colors shadow-sm rounded-sm"
                    >
                      <option value="draft">Draft — admin only</option>
                      <option value="published">Published — visible on site</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={registrationEnabled}
                        onChange={(e) =>
                          setRegistrationEnabled(e.target.checked)
                        }
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium">
                        Enable registration form
                      </span>
                    </label>
                  </div>
                </div>
              </fieldset>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  disabled={submitting}
                  className="border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && (
                    <Loader2 className="animate-spin" size={14} />
                  )}
                  {submitting
                    ? "Saving…"
                    : editingEvent
                    ? "Update Event"
                    : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Registrations Drawer                                         */}
      {/* ============================================================ */}
      {drawerOpen && drawerEvent && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-card border-l border-border shadow-xl flex flex-col">
            {/* Drawer header */}
            <div className="px-6 py-5 border-b border-border flex items-start justify-between shrink-0">
              <div className="min-w-0">
                <p className="text-[10px] text-primary uppercase font-bold tracking-widest">
                  Registrations
                </p>
                <h2 className="font-heading text-lg font-bold text-foreground truncate mt-1">
                  {drawerEvent.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {formatListDate(drawerEvent.eventDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {drawerEvent.location || "Online"}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Export bar */}
            {registrants.length > 0 && (
              <div className="px-6 py-3 border-b border-border bg-muted/20 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {registrants.length} registrant
                  {registrants.length !== 1 ? "s" : ""}
                </p>
                <a
                  href={`/api/admin/events/${drawerEvent.id}/registrations/export`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs bg-primary px-3 py-1.5 font-medium text-primary-foreground hover:opacity-90 transition-opacity outline-none focus:outline-none"
                >
                  <Download size={12} />
                  Export CSV
                </a>
              </div>
            )}

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {regError && (
                <div className="border border-destructive/40 bg-destructive/5 p-4 text-xs text-destructive font-medium mb-4">
                  {regError}
                </div>
              )}

              {loadingRegs ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2
                    className="animate-spin text-primary"
                    size={24}
                  />
                </div>
              ) : registrants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="flex size-12 items-center justify-center bg-muted text-muted-foreground mb-3">
                    <Users size={20} />
                  </span>
                  <h4 className="font-heading text-sm font-semibold">
                    No registrations yet
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Visitor submissions will appear here once they register
                    through the public event page.
                  </p>
                </div>
              ) : (
                <div className="border border-border overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted text-muted-foreground uppercase tracking-wider text-[10px] border-b border-border">
                      <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Mobile</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {registrants.map((r) => (
                        <tr
                          key={r.id}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <td className="p-3 font-medium text-foreground whitespace-nowrap">
                            {r.firstName} {r.lastName}
                          </td>
                          <td className="p-3 font-mono">{r.email}</td>
                          <td className="p-3 font-mono">{r.mobile}</td>
                          <td className="p-3 text-muted-foreground">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => triggerCancelRegConfirm(r)}
                              className="text-[10px] text-destructive hover:underline font-medium focus:outline-none cursor-pointer"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Custom Delete Event Confirmation Modal                      */}
      {/* ============================================================ */}
      {deleteConfirmOpen && eventToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md border border-border bg-card p-6 md:p-8 shadow-lg">
            <h3 className="font-heading text-lg font-bold text-destructive flex items-center gap-2">
              <Trash2 size={20} className="shrink-0" />
              Delete Event
            </h3>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed text-pretty">
              Are you sure you want to delete <span className="font-bold text-foreground">"{eventToDelete.title}"</span>?
              <br />
              This will permanently remove the event and all of its registrants. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setEventToDelete(null);
                }}
                className="border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteEvent}
                className="bg-destructive text-white px-4 py-2 text-xs font-medium hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Custom Cancel Registration Confirmation Modal               */}
      {/* ============================================================ */}
      {regDeleteConfirmOpen && regToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md border border-border bg-card p-6 md:p-8 shadow-lg">
            <h3 className="font-heading text-lg font-bold text-destructive flex items-center gap-2">
              <X size={20} className="shrink-0" />
              Cancel Registration
            </h3>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed text-pretty">
              Are you sure you want to cancel the registration for{" "}
              <span className="font-bold text-foreground">
                {regToDelete.firstName} {regToDelete.lastName} ({regToDelete.email})
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setRegDeleteConfirmOpen(false);
                  setRegToDelete(null);
                }}
                className="border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Keep Registration
              </button>
              <button
                onClick={confirmCancelRegistration}
                className="bg-destructive text-destructive-foreground px-4 py-2 text-xs font-medium hover:opacity-95 transition-opacity cursor-pointer"
              >
                Cancel Spot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
