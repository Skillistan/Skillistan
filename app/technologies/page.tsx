import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

export const metadata = {
  title: "Skillistan Technologies | Coming Soon",
  description:
    "Skillistan Technologies is our upcoming specialized digital studio — engineering web platforms, AI solutions, and cloud infrastructure.",
};

const focusAreas = [
  {
    title: "Custom Web Applications",
    description:
      "High-performance Next.js web applications, responsive web portals, and scalable cloud APIs.",
  },
  {
    title: "AI & Workflow Automation",
    description:
      "Custom AI integrations, data pipelines, and automated workflow solutions built for enterprise growth.",
  },
  {
    title: "Cloud & Infrastructure",
    description:
      "Reliable serverless deployments, database design, and automated CI/CD pipelines.",
  },
  {
    title: "Digital Talent Mentorship",
    description:
      "Practical engineering bootcamps pairing young software talent in Pakistan with global industry standards.",
  },
];

export default function SkillistanTechnologiesPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-14 pb-16 md:px-6 md:pt-20 md:pb-24">
      {/* Top Label */}
      <p className="text-xs font-medium tracking-widest text-primary uppercase">
        Skillistan Technologies
      </p>

      {/* Title & Subtitle */}
      <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-tight font-bold tracking-tight text-balance md:text-6xl">
        Building the future of tech.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
        Skillistan Technologies is our upcoming specialized digital studio — engineering custom web applications, AI tools, and technical acceleration. Launching Q3 2026.
      </p>

      {/* Focus Areas Grid */}
      <div className="mt-14 space-y-6">
        <h2 className="font-heading text-xl font-bold tracking-tight">
          Upcoming Focus Areas
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {focusAreas.map((area) => (
            <div
              key={area.title}
              className="border border-border bg-card p-6 shadow-sm space-y-2"
            >
              <h3 className="font-heading text-base font-bold text-foreground">
                {area.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed text-pretty">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Return to Portal Link */}
      <div className="mt-14 pt-8 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Under active development — Skillistan Pakistan
        </span>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer select-none"
        >
          <Home size={14} />
          Return to Home
          <ArrowRight size={12} />
        </Link>
      </div>
    </section>
  );
}
