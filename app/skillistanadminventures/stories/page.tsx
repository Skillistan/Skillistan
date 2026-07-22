"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  X,
  Image as ImageIcon,
  Calendar,
  Eye,
  CheckCircle,
} from "lucide-react";

type StoryType = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string | null;
  status: string; // "draft" | "published" | "archived"
  publishedAt: string | null;
  createdAt: string;
};

const TITLE_MAX = 100;
const EXCERPT_MAX = 300;
const CONTENT_MAX = 5000;

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

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<StoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<StoryType | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("draft");

  // Loaders
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Deletion Modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<StoryType | null>(null);

  // Validation/Errors
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stories");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStories(data);
    } catch {
      flash("Failed to fetch stories list.");
    } finally {
      setLoading(false);
    }
  };

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const isSlugDuplicate = (generatedSlug: string) => {
    if (!generatedSlug.trim()) return false;
    return stories.some(
      (s) => s.slug === generatedSlug && s.id !== editingStory?.id
    );
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generated = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(generated);
  };

  const openCreate = () => {
    setEditingStory(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setFeaturedImageUrl(null);
    setStatus("draft");
    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  };

  const openEdit = (story: StoryType) => {
    setEditingStory(story);
    setTitle(story.title);
    setSlug(story.slug);
    setExcerpt(story.excerpt || "");
    setContent(story.content);
    setFeaturedImageUrl(story.featuredImageUrl);
    setStatus(story.status);
    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setFeaturedImageUrl(data.url);
      flash("Cover image uploaded successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Title is required.";
    else if (title.length > TITLE_MAX) errs.title = `Title must be under ${TITLE_MAX} characters.`;
    else if (isSlugDuplicate(slug)) errs.title = "A story with this title/slug already exists. Please make the title unique.";

    if (!slug.trim()) errs.slug = "Slug URL is required.";
    else if (!/^[a-z0-9-]+$/.test(slug)) errs.slug = "Slug must contain only lowercase letters, numbers, and dashes.";

    if (excerpt.length > EXCERPT_MAX) errs.excerpt = `Excerpt must be under ${EXCERPT_MAX} characters.`;

    if (!content.trim()) errs.content = "Content is required.";
    else if (content.length > CONTENT_MAX) errs.content = `Content must be under ${CONTENT_MAX} characters.`;

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setFormError(null);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      featuredImageUrl,
      status,
    };

    try {
      const url = editingStory ? `/api/admin/stories/${editingStory.id}` : "/api/admin/stories";
      const method = editingStory ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save story.");
      
      flash(editingStory ? "Story updated successfully." : "Story created successfully.");
      setFormOpen(false);
      fetchStories();
    } catch (err: any) {
      setFormError(err.message || "Failed to save article details.");
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDeleteConfirm = (story: StoryType) => {
    setStoryToDelete(story);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteStory = async () => {
    if (!storyToDelete) return;
    setDeleteConfirmOpen(false);
    const story = storyToDelete;
    setStoryToDelete(null);
    setDeletingId(story.id);

    try {
      const res = await fetch(`/api/admin/stories/${story.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      flash("Story deleted.");
      fetchStories();
    } catch {
      flash("Failed to delete story.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDateLabel = (iso: string | null) => {
    if (!iso) return "Not published";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Stories & Blog</h1>
          <p className="text-muted-foreground mt-1">
            Manage your articles, news updates, and campaign recaps.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex w-fit items-center gap-2 bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 select-none cursor-pointer"
        >
          <Plus size={16} />
          Write Story
        </button>
      </div>

      {toast && (
        <div className="border border-primary/40 bg-primary/5 p-4 text-sm text-primary font-medium">
          {toast}
        </div>
      )}

      {/* Main Grid View */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border bg-card/50 text-center">
          <div className="bg-primary/10 text-primary p-3 rounded-full mb-4">
            <BookOpen size={24} />
          </div>
          <h3 className="font-heading text-lg font-semibold">No stories found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            You haven&apos;t written any stories yet. Draft your first article to share updates with the world.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <article
              key={story.id}
              className="group border border-border bg-card p-5 flex flex-col justify-between hover:border-primary/20 hover:shadow-sm transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Article Cover Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden border border-border bg-muted">
                  {story.featuredImageUrl ? (
                    <Image
                      src={story.featuredImageUrl}
                      alt={story.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  {/* Status badge Overlay */}
                  <span
                    className={`absolute top-3 right-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 select-none border border-transparent shadow-sm ${
                      story.status === "published"
                        ? "bg-emerald-600 text-white"
                        : story.status === "archived"
                        ? "bg-zinc-600 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {story.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                    <Calendar size={12} className="text-primary" />
                    {formatDateLabel(story.publishedAt)}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground line-clamp-2 leading-tight">
                    {story.title}
                  </h3>
                  {story.excerpt && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {story.excerpt}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between border-t border-border mt-5 pt-4">
                <a
                  href={`/stories/${story.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-primary select-none cursor-pointer transition-colors"
                >
                  <Eye size={12} />
                  Preview
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(story)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-zinc-500/10 text-zinc-600 border border-zinc-500/25 hover:bg-zinc-500/20 select-none cursor-pointer transition-colors"
                  >
                    <Edit3 size={10} />
                    Edit
                  </button>
                  <button
                    onClick={() => triggerDeleteConfirm(story)}
                    disabled={deletingId === story.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white select-none cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {deletingId === story.id ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <Trash2 size={10} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/*  Create / Edit Drawer Overlay                                */}
      {/* ============================================================ */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl border border-border bg-card shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold tracking-tight">
                  {editingStory ? "Edit Story" : "Write New Story"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Draft news updates, community campaign notes, or event recaps.
                </p>
              </div>
              <button
                onClick={() => setFormOpen(false)}
                className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="border border-destructive/40 bg-destructive/5 p-4 text-xs text-destructive font-medium">
                  {formError}
                </div>
              )}

              <fieldset disabled={submitting} className="space-y-5 disabled:opacity-75">
                {/* Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="st-title" className="text-sm font-medium">
                      Article Title <span className="text-primary">*</span>
                    </label>
                    <CharCounter current={title.length} max={TITLE_MAX} />
                  </div>
                  <input
                    id="st-title"
                    type="text"
                    required
                    maxLength={TITLE_MAX}
                    placeholder="e.g. Skillistan recognized at LCOY Khyber Pakhtunkhwa"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {isSlugDuplicate(slug) && (
                    <p className="text-xs text-destructive font-semibold mt-1">
                      A story with this title/slug already exists. Please enter a unique title.
                    </p>
                  )}
                  {fieldErrors.title && (
                    <p className="text-xs text-destructive">{fieldErrors.title}</p>
                  )}
                </div>

                {/* Slug (Read-only on edit) */}
                <div className="space-y-1.5">
                  <label htmlFor="st-slug" className="text-sm font-medium block">
                    Slug URL <span className="text-[10px] text-muted-foreground font-normal">(Read Only)</span>
                  </label>
                  <input
                    id="st-slug"
                    type="text"
                    required
                    readOnly={true}
                    placeholder="Enter title above to generate slug..."
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono opacity-60 bg-muted/20 rounded-sm"
                  />
                  {!title.trim() && (
                    <p className="text-xs text-amber-600 font-medium">
                      Please enter a title above to generate the slug URL.
                    </p>
                  )}
                  {fieldErrors.slug && (
                    <p className="text-xs text-destructive">{fieldErrors.slug}</p>
                  )}
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="st-excerpt" className="text-sm font-medium">
                      Brief Excerpt
                    </label>
                    <CharCounter current={excerpt.length} max={EXCERPT_MAX} />
                  </div>
                  <textarea
                    id="st-excerpt"
                    maxLength={EXCERPT_MAX}
                    placeholder="A short teaser summary to display on card grids..."
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {fieldErrors.excerpt && (
                    <p className="text-xs text-destructive">{fieldErrors.excerpt}</p>
                  )}
                </div>

                {/* Image upload row */}
                <div className="grid gap-4 sm:grid-cols-[1fr_2fr] items-center">
                  <div className="relative aspect-[16/9] w-full overflow-hidden border border-border bg-muted flex items-center justify-center text-muted-foreground/30">
                    {featuredImageUrl ? (
                      <Image
                        src={featuredImageUrl}
                        alt="Featured cover preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon size={24} />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium block">
                      Featured Cover Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="block w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:border file:border-border file:bg-card file:text-foreground file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-muted select-none cursor-pointer"
                    />
                    {uploading && (
                      <p className="text-xs text-primary flex items-center gap-1 mt-1 font-medium">
                        <Loader2 className="animate-spin size-3" />
                        Uploading to Cloudinary...
                      </p>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="st-content" className="text-sm font-medium">
                      Article Content <span className="text-primary">*</span>
                    </label>
                    <CharCounter current={content.length} max={CONTENT_MAX} />
                  </div>
                  <textarea
                    id="st-content"
                    required
                    maxLength={CONTENT_MAX}
                    placeholder="Write article details here..."
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-serif leading-relaxed"
                  />
                  {fieldErrors.content && (
                    <p className="text-xs text-destructive">{fieldErrors.content}</p>
                  )}
                </div>

                {/* Status selector */}
                <div className="space-y-1.5 max-w-xs">
                  <label htmlFor="st-status" className="text-sm font-medium block">
                    Publishing Status <span className="text-primary">*</span>
                  </label>
                  <select
                    id="st-status"
                    required
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-border bg-card hover:bg-muted/40 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-colors shadow-sm rounded-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </fieldset>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer select-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity select-none cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="animate-spin size-4" />}
                  {submitting ? "Saving..." : editingStory ? "Save Changes" : "Create Story"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Custom Deletion Confirmation Modal                          */}
      {/* ============================================================ */}
      {deleteConfirmOpen && storyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md border border-border bg-card p-6 md:p-8 shadow-lg">
            <h3 className="font-heading text-lg font-bold text-destructive flex items-center gap-2 select-none">
              <Trash2 size={20} className="shrink-0" />
              Delete Story
            </h3>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed text-pretty">
              Are you sure you want to delete this article?
              <br />
              This will permanently delete this story from the database. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setStoryToDelete(null);
                }}
                className="border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer select-none"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteStory}
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
