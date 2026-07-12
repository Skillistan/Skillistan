export default function AdminDashboardPage() {
  const stats = [
    { name: "Active Events", value: "0", description: "Upcoming workshops & drives" },
    { name: "Published Stories", value: "0", description: "News and blog articles" },
    { name: "Team Members", value: "0", description: "Staff and internees" },
    { name: "Forms & Submissions", value: "0", description: "Applications, subscriptions & mail" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back to the Skillistan portal. Here is a summary of your system data.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
            <p className="mt-2 font-heading text-4xl font-bold text-primary">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Action Guides / Recents Placeholder */}
      <div className="border border-border bg-card p-6 shadow-sm">
        <h2 className="font-heading text-xl font-bold text-foreground">Getting Started</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Use the left sidebar navigation to manage all the database content dynamically. You will be able to:
        </p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc list-inside">
          <li>Create new events and toggle their public registration forms.</li>
          <li>Write, edit, and publish stories and blog posts.</li>
          <li>Update leadership details, employees, and internees on the About page.</li>
          <li>Configure program titles and descriptions.</li>
          <li>Monitor volunteer applications, inquiries, and subscriber lists.</li>
        </ul>
      </div>
    </div>
  );
}
