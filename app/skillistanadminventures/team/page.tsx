import { Users, Plus } from "lucide-react";

export default function AdminTeamPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Team & Internees</h1>
          <p className="text-muted-foreground mt-1">
            Manage your leadership, employees, and internees shown on the About page.
          </p>
        </div>
        <button className="flex w-fit items-center gap-2 bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {/* Placeholder / Empty State */}
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border bg-card/50 text-center">
        <div className="bg-primary/10 text-primary p-3 rounded-full mb-4">
          <Users size={24} />
        </div>
        <h3 className="font-heading text-lg font-semibold">No team members found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          No team members or internees are currently loaded. Add people here to populate your About page.
        </p>
      </div>
    </div>
  );
}
