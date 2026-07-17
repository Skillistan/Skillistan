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
} from "lucide-react";

type ProgramType = {
  id: string;
  number: string;
  title: string;
  description: string;
  imageUrl: string | null;
  createdAt: string;
};

const TITLE_MAX = 80;
const NUMBER_MAX = 5;
const DESCRIPTION_MAX = 1000;

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

  const openCreate = () => {
    setEditingProgram(null);
    setNumber("");
    setTitle("");
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
    setDescription(prog.description);
    setImageUrl(prog.imageUrl);
    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFormError("Program cover image must be under 5 MB.");
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
      flash("Program cover uploaded.");
    } catch (err: any) {
      setFormError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!number.trim()) {
      errors.number = "Program number is required.";
    } else if (number.trim().length > NUMBER_MAX) {
      errors.number = `Number must be ${NUMBER_MAX} characters or fewer.`;
    }

    if (!title.trim()) {
      errors.title = "Title is required.";
    } else if (title.trim().length > TITLE_MAX) {
      errors.title = `Title must be ${TITLE_MAX} characters or fewer.`;
    }

    if (!description.trim()) {
      errors.description = "Description is required.";
    } else if (description.trim().length > DESCRIPTION_MAX) {
      errors.description = `Description must be ${DESCRIPTION_MAX} characters or fewer.`;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setFormError(null);

    const payload = {
      number: number.trim(),
      title: title.trim(),
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
      if (!res.ok) throw new Error(data.error || "Save failed.");
      flash(editingProgram ? "Program updated." : "Program created.");
      setFormOpen(false);
      fetchPrograms();
    } catch (err: any) {
      setFormError(err.message || "Failed to save program details.");
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
    setDeleteConfirmOpen(false);
    const prog = programToDelete;
    setProgramToDelete(null);
    setDeletingId(prog.id);
    try {
      const res = await fetch(`/api/admin/programs/${prog.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      flash("Program deleted.");
      fetchPrograms();
    } catch {
      setFormError("Failed to delete program.");
    } finally {
      setDeletingId(null);
    }
  };

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const maxOption = editingProgram ? programs.length : programs.length + 1;
  const optionCount = Math.max(1, maxOption);
  const numberOptions = Array.from({ length: optionCount }, (_, i) => {
    const val = i + 1;
    return val < 10 ? `0${val}` : `${val}`;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Programs
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure dynamic program titles, index ordering numbers, description blocks, and cover images.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex w-fit items-center gap-2 bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 select-none cursor-pointer"
        >
          <Plus size={16} />
          New Program
        </button>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className="border border-primary/40 bg-primary/5 p-4 text-sm text-primary font-medium">
          {toast}
        </div>
      )}
      {formError && (
        <div className="border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive font-medium">
          {formError}
        </div>
      )}

      {/* Content List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : programs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border bg-card/50 text-center">
          <span className="flex size-12 items-center justify-center bg-primary/10 text-primary mb-4">
            <FileText size={22} />
          </span>
          <h3 className="font-heading text-lg font-semibold">No programs configured</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Click "New Program" to configure your first dynamic program entry block.
          </p>
        </div>
      ) : (
        <div className="space-y-0 border border-border divide-y divide-border bg-card">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="flex flex-col md:flex-row md:items-center gap-4 p-5 md:p-6 transition-colors hover:bg-muted/30"
            >
              {/* Thumbnail / Number Badge */}
              <div className="relative w-12 h-12 bg-muted border border-border shrink-0 select-none overflow-hidden flex items-center justify-center">
                {prog.imageUrl ? (
                  <Image
                    src={prog.imageUrl}
                    alt={prog.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <span className="font-heading font-bold text-primary text-lg">
                    {prog.number}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-heading text-base font-bold text-foreground truncate">
                  {prog.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed whitespace-pre-wrap max-w-3xl">
                  {prog.description}
                </p>
              </div>

              {/* Actions stacked vertically */}
              <div className="flex flex-col gap-2 shrink-0 w-full md:w-28 md:items-stretch mt-3 md:mt-0">
                <button
                  onClick={() => openEdit(prog)}
                  disabled={deletingId === prog.id}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-500/10 text-zinc-600 border border-zinc-500/25 hover:bg-zinc-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer"
                >
                  <Pencil size={12} className="shrink-0" />
                  Edit
                </button>
                <button
                  onClick={() => triggerDeleteConfirm(prog)}
                  disabled={deletingId === prog.id}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer"
                >
                  {deletingId === prog.id ? (
                    <Loader2 className="animate-spin size-3 shrink-0" />
                  ) : (
                    <Trash2 size={12} className="shrink-0" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/*  Create / Edit Modal Form                                    */}
      {/* ============================================================ */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl border border-border bg-card shadow-lg max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold tracking-tight">
                  {editingProgram ? "Edit Program" : "Create Program"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update the description block and banner displayed on the public Programs page.
                </p>
              </div>
              <button
                onClick={() => setFormOpen(false)}
                className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
                {/* Number & Title Row */}
                <div className="grid gap-4 sm:grid-cols-4">
                  {/* Number field */}
                  <div className="space-y-1.5 sm:col-span-1">
                    <label htmlFor="prog-number" className="text-sm font-medium block mb-1">
                      Number <span className="text-primary">*</span>
                    </label>
                    <select
                      id="prog-number"
                      required
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full border border-border bg-card hover:bg-muted/40 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono text-center cursor-pointer transition-colors shadow-sm rounded-sm"
                    >
                      <option value="" disabled className="bg-card text-muted-foreground">Select</option>
                      {numberOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-card text-foreground font-mono">
                          {opt}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.number && (
                      <p className="text-xs text-destructive">{fieldErrors.number}</p>
                    )}
                  </div>

                  {/* Title field */}
                  <div className="space-y-1.5 sm:col-span-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="prog-title" className="text-sm font-medium">
                        Program title <span className="text-primary">*</span>
                      </label>
                      <CharCounter current={title.length} max={TITLE_MAX} />
                    </div>
                    <input
                      id="prog-title"
                      type="text"
                      required
                      maxLength={TITLE_MAX}
                      placeholder="e.g. Climate Action & Sustainability"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {fieldErrors.title && (
                      <p className="text-xs text-destructive">{fieldErrors.title}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="prog-desc" className="text-sm font-medium">
                      Description <span className="text-primary">*</span>
                    </label>
                    <CharCounter current={description.length} max={DESCRIPTION_MAX} />
                  </div>
                  <textarea
                    id="prog-desc"
                    rows={5}
                    required
                    maxLength={DESCRIPTION_MAX}
                    placeholder="Details about program structure, target audience, and expected outcomes…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed text-xs animate-none"
                  />
                  {fieldErrors.description && (
                    <p className="text-xs text-destructive">{fieldErrors.description}</p>
                  )}
                </div>

                {/* Cover banner upload */}
                <div className="space-y-3 border border-border p-4 bg-muted/10">
                  <label className="text-sm font-medium">
                    Program image <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
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
                        htmlFor="prog-banner"
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
                        id="prog-banner"
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
                          className="text-xs text-destructive hover:underline disabled:opacity-50 cursor-pointer"
                        >
                          Remove image
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  disabled={submitting}
                  className="border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {submitting && <Loader2 className="animate-spin" size={14} />}
                  {submitting ? "Saving…" : editingProgram ? "Update Program" : "Create Program"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Custom Delete Program Confirmation Modal                   */}
      {/* ============================================================ */}
      {deleteConfirmOpen && programToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md border border-border bg-card p-6 md:p-8 shadow-lg">
            <h3 className="font-heading text-lg font-bold text-destructive flex items-center gap-2">
              <Trash2 size={20} className="shrink-0" />
              Delete Program
            </h3>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed text-pretty">
              Are you sure you want to delete program <span className="font-bold text-foreground">"{programToDelete.number} - {programToDelete.title}"</span>?
              <br />
              This will remove the program block permanently from the public site. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setProgramToDelete(null);
                }}
                className="border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProgram}
                className="bg-destructive text-destructive-foreground px-4 py-2 text-xs font-medium hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer"
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
