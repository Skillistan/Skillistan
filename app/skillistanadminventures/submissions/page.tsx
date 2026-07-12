import { Inbox } from "lucide-react";

export default function AdminSubmissionsPage() {
  const tabs = [
    { name: "Volunteer Applications", count: 0 },
    { name: "Contact Messages", count: 0 },
    { name: "Newsletter Subscribers", count: 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Form Submissions</h1>
        <p className="text-muted-foreground mt-1">
          Review applications, subscriber lists, and messages sent by visitors.
        </p>
      </div>

      {/* Tabs Layout */}
      <div className="border-b border-border">
        <nav className="flex gap-6">
          {tabs.map((tab, idx) => (
            <button
              key={tab.name}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                idx === 0
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className="ml-2 bg-primary/10 text-primary px-1.5 py-0.5 text-xs rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Placeholder / Empty State */}
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border bg-card/50 text-center">
        <div className="bg-primary/10 text-primary p-3 rounded-full mb-4">
          <Inbox size={24} />
        </div>
        <h3 className="font-heading text-lg font-semibold">No submissions received</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Everything is quiet for now. When users submit forms on the website, they will appear here.
        </p>
      </div>
    </div>
  );
}
