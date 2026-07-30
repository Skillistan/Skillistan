"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Upload,
  ExternalLink,
  Sparkles,
} from "lucide-react";

type ProgramType = {
  id: string;
  number: string;
  title: string;
  slug?: string;
  tagline?: string | null;
  overview?: string | null;
  outcomes?: string | null;
  description: string;
  imageUrl: string | null;
  createdAt: string;
};

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

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramType | null>(null);

  // Form states
  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [overview, setOverview] = useState("");
  const [outcomes, setOutcomes] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Feedback states
  const [uploading, setUploading] = useState(false);
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
    setNumber("");
    setTitle("");
    setSlug("");
    setTagline("");
    setOverview("");
    setOutcomes("");
    setDescription("");
    setImageUrl(null);
    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  };

  const openEdit = (prog: ProgramType) => {
    setEditingProgram(prog);
    setNumber(prog.number);
    setTitle(prog.title);
    setSlug(prog.slug || slugify(prog.title));
    setTagline(prog.tagline || "");
    setOverview(prog.overview || "");
    setOutcomes(prog.outcomes || "");
    setDescription(prog.description);
    setImageUrl(prog.imageUrl);
    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!number.trim()) {
      errors.number = "Program number is required.";
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

    const payload = {
      number: number.trim(),
      title: title.trim(),
      slug: slug.trim(),
      tagline: tagline.trim() || null,
      overview: overview.trim() || null,
      outcomes: outcomes.trim() || null,
      description: description.trim(),
      imageUrl,
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFormError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image upload failed.");

      setImageUrl(data.url);
    } catch (err: any) {
      setFormError(err.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

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
            Manage public programs, overview descriptions, outcomes, and cover photos.
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
            Get started by adding your first program category.
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
                <span className="font-heading text-3xl font-bold text-primary/40 select-none">
                  {prog.number}
                </span>
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
                      title="View public page"
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

      {/* Modal Form Overlay */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl border border-border bg-card p-6 md:p-8 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <h2 className="font-heading text-lg font-bold">
                {editingProgram ? "Edit Program" : "Add New Program"}
              </h2>
              <button
                onClick={() => setFormOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 border border-destructive/30 bg-destructive/10 text-destructive text-xs font-medium">
                {formError}
              </div>
            )}

            <form noValidate onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Program Number */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="pr-number" className="text-xs font-bold text-foreground">
                      Program Number *
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
                    placeholder="e.g. Youth Skills Development"
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

              {/* Tagline */}
              <div>
                <label htmlFor="pr-tagline" className="text-xs font-bold text-foreground block mb-1">
                  Tagline / Subtitle (Optional)
                </label>
                <input
                  id="pr-tagline"
                  type="text"
                  placeholder="e.g. Practical, employment-focused training bridging classrooms and modern careers."
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

              {/* Extended Overview (Dedicated Page) */}
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
                  placeholder={"1. Complete Upwork & Freelance Profile Readiness\n2. Professional Work Portfolio Creation\n3. Client Communication & Negotiation"}
                  value={outcomes}
                  onChange={(e) => setOutcomes(e.target.value)}
                  className="w-full border border-border bg-card p-3 text-xs font-mono text-foreground focus:border-primary focus:outline-none resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Program Cover Image
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:border file:border-border file:bg-card file:text-xs file:font-semibold hover:file:bg-muted"
                  />
                  {uploading && <Loader2 className="animate-spin size-4 text-primary" />}
                </div>
                {imageUrl && (
                  <div className="relative mt-2 aspect-[16/8] w-48 overflow-hidden border border-border">
                    <Image
                      src={imageUrl}
                      alt="Cover Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  disabled={submitting}
                  className="border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5 cursor-pointer select-none"
                >
                  {submitting && <Loader2 className="animate-spin size-3.5" />}
                  {submitting ? "Saving..." : editingProgram ? "Save Changes" : "Create Program"}
                </button>
              </div>
            </form>
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
              Are you sure you want to delete <strong className="text-foreground">{programToDelete.title} ({programToDelete.number})</strong>?
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
