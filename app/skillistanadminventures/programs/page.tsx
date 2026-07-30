"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  ExternalLink,
  Calendar,
  Check,
  ChevronDown,
  ImageIcon,
} from "lucide-react";

type RelatedEvent = {
  id: string;
  title: string;
  slug: string;
  eventDate?: string;
  location?: string;
};

type ProgramType = {
  id: string;
  number: string;
  title: string;
  slug?: string;
  logoUrl?: string | null;
  tagline?: string | null;
  overview?: string | null;
  outcomes?: string | null;
  description: string;
  imageUrl: string | null;
  createdAt: string;
  events?: RelatedEvent[];
};

type EventSimple = {
  id: string;
  title: string;
  slug: string;
  eventDate?: string;
};

const PRESET_LOGOS = [
  { label: "AI Skills Hub", path: "/images/logos/ai-skills-hub.png" },
  { label: "17 Tribes", path: "/images/logos/17-tribes.png" },
  { label: "Mastering SDGs", path: "/images/logos/mastering-sdgs.png" },
  { label: "Climate Cafe", path: "/images/logos/climate-cafe.png" },
  { label: "CLD Network", path: "/images/logos/cld-network.png" },
  { label: "COP Delegate Lab", path: "/images/logos/cop-delegate-lab.png" },
  { label: "Summer Internship", path: "/images/logos/skillistan-summer-internship.png" },
  { label: "Corporate Solutions", path: "/images/logos/corporate-solutions.png" },
  { label: "AI 4 SDGs", path: "/images/logos/ai-4-sdgs.png" },
  { label: "Community Bootcamp (CBC)", path: "/images/logos/cbc.png" },
  { label: "Development Dialogues", path: "/images/logos/development-dialogues.png" },
  { label: "SDG Impact Leadership", path: "/images/logos/sdg-impact-leadership.png" },
  { label: "Skillistan Ambassador", path: "/images/logos/skillistan-ambassador.png" },
  { label: "Skillistan Technologies", path: "/images/logos/skillistan-technologies.png" },
  { label: "Skillistan Main", path: "/images/logos/skillistan.png" },
];

const TITLE_MAX = 80;
const NUMBER_MAX = 5;
const DESCRIPTION_MAX = 1000;
const OVERVIEW_MAX = 1500;

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const CharCounter = ({ current, max }: { current: number; max: number }) => (
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

/* Custom Reusable Dropdown Component for Event Selection */
function CustomEventDropdown({
  label,
  value,
  onChange,
  options,
  placeholder = "-- Select Event --",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: EventSimple[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o) => o.id === value);

  return (
    <div className="relative space-y-1">
      <label className="text-[10px] font-mono uppercase text-muted-foreground block font-semibold">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary hover:border-foreground/40 transition-colors select-none cursor-pointer"
      >
        <span className={selectedOption ? "font-medium text-foreground truncate" : "text-muted-foreground truncate"}>
          {selectedOption ? selectedOption.title : placeholder}
        </span>
        <ChevronDown size={14} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-1 z-50 border border-border bg-card shadow-xl max-h-48 overflow-y-auto animate-in fade-in-50 zoom-in-95">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-xs text-muted-foreground hover:bg-muted font-mono border-b border-border/50 flex items-center justify-between cursor-pointer"
            >
              <span>-- None / Clear --</span>
              {!value && <Check size={12} className="text-primary" />}
            </button>
            {options.length === 0 ? (
              <div className="px-3 py-3 text-xs text-muted-foreground italic text-center">
                No additional active events available
              </div>
            ) : (
              options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChange(opt.id);
                    setOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-primary/10 transition-colors cursor-pointer ${
                    value === opt.id ? "bg-primary/15 font-bold text-primary" : "text-foreground"
                  }`}
                >
                  <span className="truncate pr-2">{opt.title}</span>
                  {value === opt.id && <Check size={12} className="shrink-0 text-primary" />}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [activeEvents, setActiveEvents] = useState<EventSimple[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramType | null>(null);

  // Form states
  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [tagline, setTagline] = useState("");
  const [overview, setOverview] = useState("");
  const [outcomes, setOutcomes] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // 3 Priority Event States
  const [priorityEvent1, setPriorityEvent1] = useState<string>("");
  const [priorityEvent2, setPriorityEvent2] = useState<string>("");
  const [priorityEvent3, setPriorityEvent3] = useState<string>("");

  // Feedback states
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Loading states for actions in the list
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Custom confirmation modal states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<ProgramType | null>(null);

  useEffect(() => {
    fetchPrograms();
    fetchActiveEvents();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/programs");
      if (!res.ok) throw new Error("Failed to load programs.");
      setPrograms(await res.json());
    } catch {
      setFormError("Could not load programs. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveEvents = async () => {
    try {
      const res = await fetch("/api/admin/events");
      if (res.ok) {
        const data = await res.json();
        // Only keep currently published / active events
        const publishedOnly = data
          .filter((e: any) => e.status === "published")
          .map((e: any) => ({
            id: e.id,
            title: e.title,
            slug: e.slug,
            eventDate: e.eventDate,
          }));
        setActiveEvents(publishedOnly);
      }
    } catch (err) {
      console.error("Failed to load active events:", err);
    }
  };

  const isSlugDuplicate = (generatedSlug: string) => {
    if (!generatedSlug.trim()) return false;
    return programs.some(
      (p) => (p.slug === generatedSlug || p.number === generatedSlug) && p.id !== editingProgram?.id
    );
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setSlug(slugify(newTitle));
  };

  const openCreate = () => {
    setEditingProgram(null);
    setNumber(String(programs.length + 1).padStart(2, "0"));
    setTitle("");
    setSlug("");
    setLogoUrl("/images/logos/ai-skills-hub.png");
    setTagline("");
    setOverview("");
    setOutcomes("");
    setDescription("");
    setImageUrl(null);

    setPriorityEvent1("");
    setPriorityEvent2("");
    setPriorityEvent3("");

    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  };

  const openEdit = (prog: ProgramType) => {
    setEditingProgram(prog);
    setNumber(prog.number);
    setTitle(prog.title);
    setSlug(prog.slug || slugify(prog.title));
    setLogoUrl(prog.logoUrl || null);
    setTagline(prog.tagline || "");
    setOverview(prog.overview || "");
    setOutcomes(prog.outcomes || "");
    setDescription(prog.description);
    setImageUrl(prog.imageUrl);

    // Pre-populate linked priority events (up to 3)
    const linkedEventIds = prog.events?.map((e) => e.id) || [];
    setPriorityEvent1(linkedEventIds[0] || "");
    setPriorityEvent2(linkedEventIds[1] || "");
    setPriorityEvent3(linkedEventIds[2] || "");

    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!number.trim()) {
      errors.number = "Program index is required.";
    } else if (number.length > NUMBER_MAX) {
      errors.number = `Max ${NUMBER_MAX} characters allowed.`;
    }

    if (!title.trim()) {
      errors.title = "Title is required.";
    } else if (title.length > TITLE_MAX) {
      errors.title = `Title cannot exceed ${TITLE_MAX} characters.`;
    }

    if (!slug.trim()) {
      errors.slug = "Slug cannot be empty. Please enter a valid title.";
    } else if (isSlugDuplicate(slug)) {
      errors.slug = "A program with this title or slug already exists.";
    }

    if (!description.trim()) {
      errors.description = "Description is required.";
    } else if (description.length > DESCRIPTION_MAX) {
      errors.description = `Description cannot exceed ${DESCRIPTION_MAX} characters.`;
    }

    if (overview.length > OVERVIEW_MAX) {
      errors.overview = `Overview cannot exceed ${OVERVIEW_MAX} characters.`;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) return;

    setSubmitting(true);

    const eventIds = [priorityEvent1, priorityEvent2, priorityEvent3].filter((id) => id.trim() !== "");

    const payload = {
      number: number.trim(),
      title: title.trim(),
      slug: slug.trim(),
      logoUrl: logoUrl || null,
      tagline: tagline.trim() || null,
      overview: overview.trim() || null,
      outcomes: outcomes.trim() || null,
      description: description.trim(),
      imageUrl: imageUrl || null,
      eventIds,
    };

    try {
      const url = editingProgram
        ? `/api/admin/programs/${editingProgram.id}`
        : "/api/admin/programs";
      const method = editingProgram ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Action failed.");
      }

      setToast(
        editingProgram
          ? "Program updated successfully."
          : "Program created successfully."
      );
      setTimeout(() => setToast(null), 3000);

      setFormOpen(false);
      fetchPrograms();
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDeleteConfirm = (prog: ProgramType) => {
    setProgramToDelete(prog);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteProgram = async () => {
    if (!programToDelete) return;

    setDeletingId(programToDelete.id);
    setFormError(null);
    setDeleteConfirmOpen(false);

    try {
      const res = await fetch(`/api/admin/programs/${programToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");

      setToast("Program deleted successfully.");
      setTimeout(() => setToast(null), 3000);
      setProgramToDelete(null);

      fetchPrograms();
    } catch (err: any) {
      setFormError(err.message || "Failed to delete program.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setFormError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cover image upload failed.");

      // Fixed key: use data.imageUrl returned by /api/admin/upload
      setImageUrl(data.imageUrl);
    } catch (err: any) {
      setFormError(err.message || "Cover image upload failed.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setFormError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Logo upload failed.");

      // Fixed key: use data.imageUrl returned by /api/admin/upload
      setLogoUrl(data.imageUrl);
    } catch (err: any) {
      setFormError(err.message || "Logo upload failed.");
    } finally {
      setUploadingLogo(false);
    }
  };

  // Compute unique filtered options for each priority slot
  const p1Options = activeEvents.filter((e) => e.id !== priorityEvent2 && e.id !== priorityEvent3);
  const p2Options = activeEvents.filter((e) => e.id !== priorityEvent1 && e.id !== priorityEvent3);
  const p3Options = activeEvents.filter((e) => e.id !== priorityEvent1 && e.id !== priorityEvent2);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-2.5 text-xs font-semibold shadow-lg animate-fade-in select-none">
          {toast}
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Programs Directory
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage flagship programs, dedicated logos, related priority events, overviews, and cover photos.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-1.5 bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity select-none cursor-pointer"
        >
          <Plus size={14} />
          New Program
        </button>
      </div>

      {/* Main Error */}
      {formError && !formOpen && (
        <div className="p-3 border border-destructive/30 bg-destructive/10 text-destructive text-xs font-medium">
          {formError}
        </div>
      )}

      {/* Table / Cards List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-xs font-mono">
          <Loader2 className="animate-spin size-4 mr-2 text-primary" />
          Loading programs catalog...
        </div>
      ) : programs.length === 0 ? (
        <div className="border border-dashed border-border bg-card/45 p-12 text-center max-w-lg mx-auto">
          <p className="font-heading text-sm font-bold">No programs found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Get started by adding your first flagship program.
          </p>
          <button
            onClick={openCreate}
            className="mt-4 inline-flex items-center gap-1 bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 select-none cursor-pointer"
          >
            <Plus size={12} />
            Add First Program
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="border border-border bg-card p-5 shadow-sm hover:border-border/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                {/* Program Logo Icon */}
                <div className="relative size-12 shrink-0 overflow-hidden bg-background border border-border flex items-center justify-center p-1.5">
                  {prog.logoUrl ? (
                    <Image
                      src={prog.logoUrl}
                      alt={prog.title}
                      fill
                      className="object-contain p-1"
                    />
                  ) : (
                    <span className="font-heading text-lg font-bold text-primary">
                      {prog.number}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base font-bold text-foreground">
                      {prog.title}
                    </h3>
                    <a
                      href={`/programs/${prog.slug || prog.number}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="View public program page"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  {prog.tagline && (
                    <p className="text-xs font-mono text-primary font-medium">
                      {prog.tagline}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl">
                    {prog.description}
                  </p>
                  {prog.events && prog.events.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">
                        Linked Priority Events:
                      </span>
                      {prog.events.map((ev, idx) => (
                        <span key={ev.id} className="text-[10px] bg-primary/10 border border-primary/20 px-2 py-0.5 font-medium text-foreground">
                          P{idx + 1}: {ev.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => openEdit(prog)}
                  className="border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer select-none flex items-center gap-1"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  onClick={() => triggerDeleteConfirm(prog)}
                  disabled={deletingId === prog.id}
                  className="border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive hover:text-white transition-colors cursor-pointer select-none disabled:opacity-50 flex items-center gap-1"
                >
                  {deletingId === prog.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fully Responsive & Scrollable Admin Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl border border-border bg-card shadow-2xl my-auto max-h-[88vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-5 md:p-6 shrink-0 bg-card">
              <div>
                <h2 className="font-heading text-lg font-bold">
                  {editingProgram ? "Edit Program & Logo" : "Add New Program"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure program details, dedicated logo, cover photo, and 3 priority active events.
                </p>
              </div>
              <button
                onClick={() => setFormOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body (Subtle Minimal Scrollbar) */}
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[72vh] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full">
              {formError && (
                <div className="p-3 border border-destructive/30 bg-destructive/10 text-destructive text-xs font-medium">
                  {formError}
                </div>
              )}

              <form id="program-form" noValidate onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Program Number / Index */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="pr-number" className="text-xs font-bold text-foreground">
                        Index Number *
                      </label>
                      <CharCounter current={number.length} max={NUMBER_MAX} />
                    </div>
                    <input
                      id="pr-number"
                      type="text"
                      required
                      maxLength={NUMBER_MAX}
                      placeholder="e.g. 01, 02"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                    {fieldErrors.number && (
                      <p className="text-[11px] text-destructive mt-1 font-medium">
                        {fieldErrors.number}
                      </p>
                    )}
                  </div>

                  {/* Program Title */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="pr-title" className="text-xs font-bold text-foreground">
                        Program Title *
                      </label>
                      <CharCounter current={title.length} max={TITLE_MAX} />
                    </div>
                    <input
                      id="pr-title"
                      type="text"
                      required
                      maxLength={TITLE_MAX}
                      placeholder="e.g. AI Skills Hub"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                    {fieldErrors.title && (
                      <p className="text-[11px] text-destructive mt-1 font-medium">
                        {fieldErrors.title}
                      </p>
                    )}
                  </div>
                </div>

                {/* Read-only URL Slug */}
                <div>
                  <label htmlFor="pr-slug" className="text-xs font-bold text-foreground block mb-1">
                    URL Slug (Read-only)
                  </label>
                  <input
                    id="pr-slug"
                    type="text"
                    readOnly
                    value={slug}
                    placeholder="Auto-generated from title..."
                    className="w-full border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground font-mono select-none cursor-not-allowed"
                  />
                  {isSlugDuplicate(slug) && (
                    <p className="text-xs text-destructive font-semibold mt-1">
                      A program with this title/slug already exists. Please enter a unique title.
                    </p>
                  )}
                  {fieldErrors.slug && (
                    <p className="text-[11px] text-destructive mt-1 font-medium">
                      {fieldErrors.slug}
                    </p>
                  )}
                </div>

                {/* Dedicated Program Logo Selector */}
                <div className="border border-border bg-muted/20 p-4 space-y-3">
                  <label className="text-xs font-bold text-foreground block">
                    Dedicated Program Logo *
                  </label>
                  
                  {/* Preset Logos Selector Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {PRESET_LOGOS.map((logo) => {
                      const isSelected = logoUrl === logo.path;
                      return (
                        <button
                          key={logo.path}
                          type="button"
                          onClick={() => setLogoUrl(logo.path)}
                          className={`relative aspect-square border p-1.5 flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/10 ring-1 ring-primary"
                              : "border-border bg-card hover:border-foreground/40"
                          }`}
                          title={logo.label}
                        >
                          <div className="relative size-7 overflow-hidden">
                            <Image src={logo.path} alt={logo.label} fill className="object-contain" />
                          </div>
                          <span className="text-[9px] font-mono line-clamp-1 mt-1 text-muted-foreground text-center">
                            {logo.label}
                          </span>
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-primary text-primary-foreground size-3.5 flex items-center justify-center rounded-full">
                              <Check size={9} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Or Custom Upload */}
                  <div className="pt-2 border-t border-border flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">Or upload custom logo:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="text-xs text-muted-foreground file:mr-2 file:py-1 file:px-2.5 file:border file:border-border file:bg-card file:text-[11px] file:font-semibold hover:file:bg-muted"
                    />
                    {uploadingLogo && <Loader2 className="animate-spin size-4 text-primary shrink-0" />}
                  </div>
                </div>

                {/* Tagline */}
                <div>
                  <label htmlFor="pr-tagline" className="text-xs font-bold text-foreground block mb-1">
                    Tagline / Subtitle (Optional)
                  </label>
                  <input
                    id="pr-tagline"
                    type="text"
                    placeholder="e.g. Empowering youth with cutting-edge artificial intelligence tools."
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Short Listing Description */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="pr-desc" className="text-xs font-bold text-foreground">
                      Short Listing Description *
                    </label>
                    <CharCounter current={description.length} max={DESCRIPTION_MAX} />
                  </div>
                  <textarea
                    id="pr-desc"
                    required
                    rows={3}
                    maxLength={DESCRIPTION_MAX}
                    placeholder="Brief 2-3 sentence overview displayed on main catalog grid..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none resize-none"
                  />
                  {fieldErrors.description && (
                    <p className="text-[11px] text-destructive mt-1 font-medium">
                      {fieldErrors.description}
                    </p>
                  )}
                </div>

                {/* Extended Overview */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="pr-overview" className="text-xs font-bold text-foreground">
                      Extended Overview (Dedicated Page)
                    </label>
                    <CharCounter current={overview.length} max={OVERVIEW_MAX} />
                  </div>
                  <textarea
                    id="pr-overview"
                    rows={4}
                    maxLength={OVERVIEW_MAX}
                    placeholder="Detailed background text shown on dedicated program page..."
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    className="w-full border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                {/* Key Deliverables & Outcomes */}
                <div>
                  <label htmlFor="pr-outcomes" className="text-xs font-bold text-foreground block mb-1">
                    Key Outcomes & Deliverables (One item per line)
                  </label>
                  <textarea
                    id="pr-outcomes"
                    rows={3}
                    placeholder={"1. Generative AI & Prompt Engineering Mastery\n2. AI-Driven Workflow Automation\n3. Portfolio of Practical AI Projects"}
                    value={outcomes}
                    onChange={(e) => setOutcomes(e.target.value)}
                    className="w-full border border-border bg-card p-3 text-xs font-mono text-foreground focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                {/* Priority Events Custom Dropdowns (Active Published Events Only) */}
                <div className="border border-border bg-card p-4 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-primary" />
                      Priority Related Events (Active Events Only)
                    </label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Select up to 3 currently active events to showcase on this program&apos;s detail page. Events selected in 1st priority cannot be duplicated in 2nd or 3rd priority.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {/* Priority 1 */}
                    <CustomEventDropdown
                      label="1st Priority Event"
                      value={priorityEvent1}
                      onChange={setPriorityEvent1}
                      options={p1Options}
                      placeholder="-- Select 1st Priority --"
                    />

                    {/* Priority 2 */}
                    <CustomEventDropdown
                      label="2nd Priority Event"
                      value={priorityEvent2}
                      onChange={setPriorityEvent2}
                      options={p2Options}
                      placeholder="-- Select 2nd Priority --"
                    />

                    {/* Priority 3 */}
                    <CustomEventDropdown
                      label="3rd Priority Event"
                      value={priorityEvent3}
                      onChange={setPriorityEvent3}
                      options={p3Options}
                      placeholder="-- Select 3rd Priority --"
                    />
                  </div>
                </div>

                {/* Program Cover Image Upload & Change Fix */}
                <div className="border border-border bg-card p-4 space-y-3">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <ImageIcon className="size-3.5 text-primary" />
                    Program Banner / Cover Photo
                  </label>

                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={uploadingCover}
                      className="text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:border file:border-border file:bg-card file:text-xs file:font-semibold hover:file:bg-muted cursor-pointer"
                    />
                    {uploadingCover && <Loader2 className="animate-spin size-4 text-primary shrink-0" />}
                  </div>

                  {imageUrl ? (
                    <div className="relative mt-2 aspect-[16/8] w-full max-w-sm overflow-hidden border border-border group">
                      <Image
                        src={imageUrl}
                        alt="Cover Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl(null)}
                        className="absolute top-2 right-2 bg-destructive text-white px-2 py-1 text-[10px] font-bold shadow hover:opacity-90 select-none cursor-pointer"
                      >
                        Remove Cover Photo
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground italic">
                      No cover photo attached. Default program placeholder will be used.
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border p-4 md:px-6 shrink-0 bg-card">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                disabled={submitting}
                className="border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50 select-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="program-form"
                disabled={submitting || uploadingCover || uploadingLogo}
                className="bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5 cursor-pointer select-none"
              >
                {submitting && <Loader2 className="animate-spin size-3.5" />}
                {submitting ? "Saving..." : editingProgram ? "Save Changes" : "Create Program"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Program Confirmation Modal */}
      {deleteConfirmOpen && programToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md border border-border bg-card p-6 md:p-8 shadow-lg">
            <h3 className="font-heading text-lg font-bold text-destructive flex items-center gap-2 select-none">
              <Trash2 size={20} className="shrink-0" />
              Delete Program
            </h3>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed text-pretty">
              Are you sure you want to delete <strong className="text-foreground">{programToDelete.title}</strong>?
              <br />
              This will permanently remove it from the database. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setProgramToDelete(null);
                }}
                className="border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer select-none"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProgram}
                className="bg-destructive text-white font-bold px-4 py-2 text-xs hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer select-none"
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
