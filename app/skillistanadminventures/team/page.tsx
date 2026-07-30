"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Loader2,
} from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  category: string;
  bio: string | null;
  imageUrl: string | null;
  linkedinUrl: string | null;
  order: number;
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState("leadership");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [order, setOrder] = useState(0);

  // Action feedback states
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertError, setAlertError] = useState<string | null>(null);

  // Custom delete confirmation modal states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team");
      if (!res.ok) throw new Error("Failed to load team members.");
      const data = await res.json();
      setMembers(data);
    } catch (err: any) {
      setAlertError(err.message || "An error occurred fetching members.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingMember(null);
    setName("");
    setRole("");
    setCategory("leadership");
    setBio("");
    setImageUrl(null);
    setLinkedinUrl("");
    setOrder(members.length + 1); // Suggest next order
    setAlertError(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setCategory(member.category);
    setBio(member.bio || "");
    setImageUrl(member.imageUrl);
    setLinkedinUrl(member.linkedinUrl || "");
    setOrder(member.order);
    setAlertError(null);
    setFormOpen(true);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    // Dynamic truncation if switching to a category with a shorter bio limit
    const limit = newCategory === "leadership" ? 250 : newCategory === "employee" ? 200 : 100;
    if (bio.length > limit) {
      setBio(bio.substring(0, limit));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Frontend validation: Size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAlertError("Image file size must be under 5MB.");
      return;
    }

    // Frontend validation: File type
    if (!file.type.startsWith("image/")) {
      setAlertError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    setUploading(true);
    setAlertError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");

      setImageUrl(data.imageUrl);
      setAlertMessage("Image uploaded successfully.");
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err: any) {
      setAlertError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setAlertError(null);

    // Frontend validation
    if (!name.trim() || !role.trim() || !category) {
      setAlertError("Name, role, and category are required.");
      setSubmitting(false);
      return;
    }

    if (name.length > 50) {
      setAlertError("Name cannot exceed 50 characters.");
      setSubmitting(false);
      return;
    }

    if (role.length > 50) {
      setAlertError("Role cannot exceed 50 characters.");
      setSubmitting(false);
      return;
    }

    // Dynamic bio validation check
    const maxBioLength = category === "leadership" ? 250 : category === "employee" ? 200 : 100;
    if (bio.length > maxBioLength) {
      setAlertError(`Biography cannot exceed ${maxBioLength} characters for ${category === "leadership" ? "Senior Management" : category === "employee" ? "Staff & Trainers" : "Internees"}.`);
      setSubmitting(false);
      return;
    }

    // Linkedin URL format check
    let cleanLinkedin = linkedinUrl.trim();
    if (cleanLinkedin !== "") {
      try {
        new URL(cleanLinkedin);
      } catch (err) {
        setAlertError("Please enter a valid LinkedIn URL (including https://).");
        setSubmitting(false);
        return;
      }
    }

    const payload = {
      name: name.trim(),
      role: role.trim(),
      category,
      bio: bio.trim() || null,
      imageUrl,
      linkedinUrl: cleanLinkedin || null,
      order: Number(order) || 0,
    };

    try {
      const url = editingMember
        ? `/api/admin/team/${editingMember.id}`
        : "/api/admin/team";
      const method = editingMember ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed.");

      setAlertMessage(
        editingMember
          ? "Team member updated successfully."
          : "Team member added successfully."
      );
      setTimeout(() => setAlertMessage(null), 3000);

      setFormOpen(false);
      fetchMembers();
    } catch (err: any) {
      setAlertError(err.message || "Failed to save team member.");
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDeleteConfirm = (member: TeamMember) => {
    setMemberToDelete(member);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/team/${memberToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");

      setAlertMessage("Team member deleted successfully.");
      setTimeout(() => setAlertMessage(null), 3000);
      setDeleteConfirmOpen(false);
      setMemberToDelete(null);

      fetchMembers();
    } catch (err: any) {
      setAlertError(err.message || "Failed to delete team member.");
    } finally {
      setDeleting(false);
    }
  };

  const leadership = members.filter((m) => m.category === "leadership");
  const employees = members.filter((m) => m.category === "employee");
  const interns = members.filter((m) => m.category === "intern");

  const InitialsAvatar = ({ name, className }: { name: string; className?: string }) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    return (
      <div className={`flex items-center justify-center bg-primary/10 text-primary font-heading font-bold text-lg select-none ${className || ""}`}>
        {initials}
      </div>
    );
  };

  const LinkedInPreview = ({ href }: { href: string }) => {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors p-1 inline-flex outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 select-none"
        title="View LinkedIn Profile"
      >
        <svg
          className="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      </a>
    );
  };

  const maxBioLength = category === "leadership" ? 250 : category === "employee" ? 200 : 100;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Team & Internees</h1>
          <p className="text-muted-foreground mt-1">
            Manage the people directories displayed on the public About page.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex w-fit items-center gap-2 bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {/* Action Banners */}
      {alertMessage && (
        <div className="border border-primary/40 bg-primary/5 p-4 text-sm text-primary font-medium">
          {alertMessage}
        </div>
      )}
      {alertError && (
        <div className="border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive font-medium">
          {alertError}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : members.length === 0 ? (
        /* Global Empty State */
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border bg-card text-center">
          <div className="bg-primary/10 text-primary p-3 rounded-full mb-4">
            <Users size={24} />
          </div>
          <h3 className="font-heading text-lg font-semibold">No team members found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Add team members, trainers, or internees to populate this management panel and display them on the About page.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-5 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Add First Member
          </button>
        </div>
      ) : (
        /* Categorized Grids */
        <div className="space-y-12">
          {/* Senior Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="font-heading text-lg font-bold text-foreground">Senior Management</h2>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                {leadership.length}
              </span>
            </div>
            {leadership.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-2">No senior management members registered.</p>
            ) : (
              <div className="flex flex-wrap gap-6">
                {leadership.map((member) => (
                  <div
                    key={member.id}
                    className="w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.33%-1rem)] max-w-sm border border-border bg-card p-5 flex flex-col justify-between transition-transform duration-300 hover:shadow-sm"
                  >
                    <div>
                      <div className="flex gap-4 items-start">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border bg-muted shrink-0">
                          {member.imageUrl ? (
                            <Image
                              src={member.imageUrl}
                              alt={member.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <InitialsAvatar name={member.name} className="h-full w-full" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-heading font-bold text-base text-foreground">{member.name}</h4>
                            {member.linkedinUrl && <LinkedInPreview href={member.linkedinUrl} />}
                          </div>
                          <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-0.5">{member.role}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 font-medium">Sort Order: {member.order}</p>
                        </div>
                      </div>
                      {member.bio && (
                        <p className="text-xs text-muted-foreground leading-relaxed mt-4 bg-muted/30 p-2.5 border-l-2 border-primary/40 w-full text-left">
                          {member.bio}
                        </p>
                      )}
                    </div>
                    <div className="mt-5 pt-3 border-t border-border flex justify-end gap-2.5">
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors p-1"
                        aria-label={`Edit ${member.name}`}
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => triggerDeleteConfirm(member)}
                        className="flex items-center gap-1.5 text-xs text-destructive hover:bg-destructive/5 transition-colors p-1"
                        aria-label={`Delete ${member.name}`}
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Staff & Trainers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="font-heading text-lg font-bold text-foreground">Staff & Trainers</h2>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                {employees.length}
              </span>
            </div>
            {employees.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-2">No staff or trainer members registered.</p>
            ) : (
              <div className="flex flex-wrap gap-6">
                {employees.map((member) => (
                  <div
                    key={member.id}
                    className="w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(25%-1.15rem)] max-w-[260px] border border-border bg-card p-4 flex flex-col justify-between transition-transform duration-300 hover:shadow-sm"
                  >
                    <div className="flex flex-col items-center text-center w-full">
                      <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border bg-muted mb-3 shrink-0">
                        {member.imageUrl ? (
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <InitialsAvatar name={member.name} className="h-full w-full" />
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <h4 className="font-heading font-bold text-sm text-foreground">{member.name}</h4>
                        {member.linkedinUrl && <LinkedInPreview href={member.linkedinUrl} />}
                      </div>
                      <p className="text-xs text-primary font-semibold mt-0.5">{member.role}</p>
                      <p className="text-[10px] bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded-full mt-1.5">
                        Order: {member.order}
                      </p>
                      {member.bio && (
                        <p className="text-xs text-muted-foreground leading-relaxed mt-3 bg-muted/30 p-2 border-l-2 border-primary/40 w-full text-left">
                          {member.bio}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-border flex justify-center gap-4">
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => triggerDeleteConfirm(member)}
                        className="flex items-center gap-1.5 text-xs text-destructive hover:bg-destructive/5 transition-colors"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Internees */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="font-heading text-lg font-bold text-foreground">Internees</h2>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                {interns.length}
              </span>
            </div>
            {interns.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-2">No internees registered.</p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {interns.map((member) => (
                  <div
                    key={member.id}
                    className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(20%-0.8rem)] max-w-[180px] border border-border bg-card p-3 flex flex-col justify-between transition-transform duration-300 hover:shadow-sm"
                  >
                    <div className="flex flex-col items-center text-center w-full">
                      <div className="relative h-14 w-14 overflow-hidden rounded-full border border-border bg-muted mb-2 shrink-0">
                        {member.imageUrl ? (
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <InitialsAvatar name={member.name} className="h-full w-full text-xs" />
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        <h4 className="font-heading font-semibold text-xs text-foreground">{member.name}</h4>
                        {member.linkedinUrl && <LinkedInPreview href={member.linkedinUrl} />}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{member.role}</p>
                      {member.bio && (
                        <p className="text-[10px] text-muted-foreground leading-relaxed mt-2 bg-muted/30 p-1.5 border-l border-primary/40 w-full text-left">
                          {member.bio}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 pt-2 border-t border-border flex justify-around">
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        title="Edit member"
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        onClick={() => triggerDeleteConfirm(member)}
                        className="text-destructive hover:bg-destructive/5 transition-colors p-1"
                        title="Delete member"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-over / Modal Form */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg border border-border bg-card p-6 md:p-8 shadow-lg max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setFormOpen(false)}
              className="absolute top-4 right-4 p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <h2 className="font-heading text-xl font-bold tracking-tight mb-6">
              {editingMember ? `Edit Team Member: ${editingMember.name}` : "Add New Team Member"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  maxLength={50}
                  placeholder="e.g. Essa Suleman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-input bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="flex justify-between text-[11px] mt-0.5">
                  <span className={name.length > 45 ? "text-destructive font-medium" : "text-muted-foreground"}>
                    {name.length}/50 characters
                  </span>
                </div>
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="role" className="text-sm font-medium">
                  Role Title <span className="text-primary">*</span>
                </label>
                <input
                  id="role"
                  type="text"
                  required
                  maxLength={50}
                  placeholder="e.g. Founder & Director"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-input bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="flex justify-between text-[11px] mt-0.5">
                  <span className={role.length > 45 ? "text-destructive font-medium" : "text-muted-foreground"}>
                    {role.length}/50 characters
                  </span>
                </div>
              </div>

              {/* Grid Inputs */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category <span className="text-primary">*</span>
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full border border-border bg-card hover:bg-muted/40 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-colors shadow-sm rounded-sm"
                  >
                    <option value="leadership">Senior Management</option>
                    <option value="employee">Staff & Trainers</option>
                    <option value="intern">Internees</option>
                  </select>
                </div>

                {/* Sorting Order */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="order" className="text-sm font-medium">
                    Display Priority Order
                  </label>
                  <input
                    id="order"
                    type="number"
                    min={0}
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value) || 0)}
                    className="w-full border border-input bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Bio (optional, dynamic limit) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="bio" className="text-sm font-medium">
                    Biography (Brief description)
                  </label>
                  <span className="text-[10px] text-primary bg-primary/5 px-2 py-0.5 font-medium rounded-full">
                    {category === "leadership" ? "250 chars max" : category === "employee" ? "200 chars max" : "100 chars max"}
                  </span>
                </div>
                <textarea
                  id="bio"
                  rows={3}
                  maxLength={maxBioLength}
                  placeholder="Short background description..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border border-input bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="flex justify-between text-[11px] mt-0.5">
                  <span className={bio.length > maxBioLength - 10 ? "text-destructive font-medium" : "text-muted-foreground"}>
                    {bio.length}/{maxBioLength} characters
                  </span>
                </div>
              </div>

              {/* LinkedIn Profile URL */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="linkedinUrl" className="text-sm font-medium">
                  LinkedIn Profile URL
                </label>
                <input
                  id="linkedinUrl"
                  type="url"
                  placeholder="e.g. https://linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full border border-input bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Optional. Must be a valid URL starting with https://.
                </p>
              </div>

              {/* Image Upload Integration */}
              <div className="flex flex-col gap-1.5 border border-border p-4 bg-muted/10 rounded-sm">
                <label className="text-sm font-medium">Headshot Image</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center mt-1">
                  {/* Image Preview Container */}
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border bg-muted flex items-center justify-center shrink-0">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt="Preview"
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <Users className="text-muted-foreground/60" size={28} />
                    )}
                  </div>

                  {/* Input Selector / Button */}
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <label
                      htmlFor="image-file"
                      className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
                    >
                      {uploading ? (
                        <Loader2 className="animate-spin text-primary" size={16} />
                      ) : (
                        <Upload size={16} />
                      )}
                      {uploading ? "Uploading..." : "Select Headshot"}
                    </label>
                    <input
                      id="image-file"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      PNG, JPG or WEBP formats. Maximum upload size 5MB.
                    </p>
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl(null)}
                        className="text-xs text-destructive hover:underline block"
                      >
                        Remove headshot image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
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
                  {submitting && <Loader2 className="animate-spin" size={16} />}
                  {submitting ? "Saving..." : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Custom Delete Team Member Confirmation Modal                */}
      {/* ============================================================ */}
      {deleteConfirmOpen && memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md border border-border bg-card p-6 md:p-8 shadow-lg">
            <h3 className="font-heading text-lg font-bold text-destructive flex items-center gap-2 select-none">
              <Trash2 size={20} className="shrink-0" />
              Delete Team Member
            </h3>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed text-pretty">
              Are you sure you want to delete <strong className="text-foreground">{memberToDelete.name}</strong>?
              <br />
              This will permanently remove them from the roster. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setMemberToDelete(null);
                }}
                disabled={deleting}
                className="border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer select-none disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteMember}
                disabled={deleting}
                className="bg-destructive text-white font-bold px-4 py-2 text-xs hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer select-none disabled:opacity-50"
              >
                {deleting && <Loader2 className="animate-spin size-3.5" />}
                {deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
