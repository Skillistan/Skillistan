import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, FileText, MapPin, Sparkles } from 'lucide-react'
import db from '@/lib/db'
import { formatDate } from '@/lib/content'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const program = await db.program.findFirst({
    where: {
      OR: [{ slug: slug }, { number: slug }],
    },
  })

  if (!program) {
    return { title: 'Program Not Found | Skillistan' }
  }

  return {
    title: `${program.title} | Skillistan Programs`,
    description: program.tagline || program.description,
  }
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params

  // Find program by slug or number and include linked events (up to 3)
  const program = await db.program.findFirst({
    where: {
      OR: [{ slug: slug }, { number: slug }],
    },
    include: {
      events: {
        where: { status: 'published' },
        orderBy: { eventDate: 'desc' },
        take: 3,
      },
    },
  })

  if (!program) {
    notFound()
  }

  // Fetch recent stories for the sidebar
  const stories = await db.story.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  })

  // Format outcomes list from newline string
  const outcomesList = program.outcomes
    ? program.outcomes.split('\n').filter((item) => item.trim() !== '')
    : [
        '1. Practical hands-on skill development',
        '2. Portfolio & 90-day action plan readiness',
        '3. Certificate & community network access',
      ]

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 md:px-6 md:pt-14 md:pb-24 space-y-12">
      {/* Back link */}
      <div>
        <Link
          href="/programs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer select-none"
        >
          <ArrowLeft className="size-3.5" />
          Back to all programs
        </Link>
      </div>

      {/* Main Program Header & Grid */}
      <div className="grid gap-12 md:grid-cols-[1fr_340px] items-start">
        {/* Left Column: Core Program Details */}
        <div className="space-y-10">
          {/* Header with Dedicated Logo */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {/* Dedicated Logo */}
              <div className="relative size-16 md:size-20 shrink-0 overflow-hidden bg-background border border-border flex items-center justify-center p-2">
                {program.logoUrl ? (
                  <Image
                    src={program.logoUrl}
                    alt={program.title}
                    fill
                    priority
                    sizes="80px"
                    className="object-contain p-1"
                  />
                ) : (
                  <span className="font-heading text-3xl font-bold text-primary">
                    {program.number}
                  </span>
                )}
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
                  Skillistan Core Program #{program.number}
                </span>
                <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-5xl mt-1">
                  {program.title}
                </h1>
              </div>
            </div>

            {program.tagline && (
              <p className="text-base leading-relaxed text-foreground font-medium border-l-2 border-primary pl-4 py-1">
                {program.tagline}
              </p>
            )}
          </div>

          {/* Featured Cover Image */}
          {program.imageUrl && (
            <div className="relative aspect-[16/9] w-full overflow-hidden border border-border">
              <Image
                src={program.imageUrl}
                alt={program.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
              />
            </div>
          )}

          {/* Overview Section */}
          <div className="space-y-4 border-t border-border pt-8">
            <h2 className="font-heading text-xl font-bold tracking-tight">
              Program Overview
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap text-pretty">
              {program.overview || program.description}
            </p>
          </div>

          {/* Key Deliverables & Outcomes */}
          <div className="space-y-4 border-t border-border pt-8">
            <h2 className="font-heading text-xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              Key Deliverables & Outcomes
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 pt-2">
              {outcomesList.map((outcome, idx) => (
                <div
                  key={idx}
                  className="border border-border bg-card p-4 flex items-start gap-3 shadow-sm"
                >
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs text-foreground leading-relaxed font-medium">
                    {outcome}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Associated Events & Bootcamps (Up to 3 selected) */}
          <div className="space-y-6 border-t border-border pt-8">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold tracking-tight flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                Related Bootcamps & Events
              </h2>
              <Link
                href="/events"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                All events
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {program.events.length === 0 ? (
              <div className="border border-dashed border-border bg-card/45 p-8 text-center">
                <p className="font-heading text-sm font-bold">
                  No linked events scheduled right now
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Check back soon or explore our main events directory.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                {program.events.map((ev) => (
                  <Link
                    key={ev.id}
                    href={`/events/${ev.slug}`}
                    className="group border border-border bg-card p-4 space-y-2 hover:border-primary/40 transition-colors flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                        <span>{formatDate(ev.eventDate)}</span>
                      </div>
                      <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {ev.title}
                      </h3>
                    </div>
                    <div className="text-[11px] text-primary font-medium flex items-center gap-1 pt-2">
                      View details
                      <ArrowRight className="size-3" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Sticky Request & Stories Widget */}
        <aside className="space-y-6 md:sticky md:top-24">
          {/* Partnership Request Card */}
          <div className="border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-heading text-base font-bold text-foreground">
              Bring This Program To Your Campus
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We partner with schools, universities, and community centers to deliver localized bootcamps and workshops across Pakistan.
            </p>
            <Link
              href="/contact"
              className="w-full bg-primary text-primary-foreground text-center py-2.5 px-4 text-xs font-bold block hover:opacity-90 transition-opacity select-none cursor-pointer"
            >
              Request Campus Workshop
            </Link>
          </div>

          {/* Recent Field Stories */}
          {stories.length > 0 && (
            <div className="border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <FileText className="size-3.5 text-primary" />
                Recent Field Stories
              </h3>
              <div className="flex flex-col divide-y divide-border">
                {stories.map((st) => (
                  <Link
                    key={st.slug}
                    href={`/stories/${st.slug}`}
                    className="group block py-3 first:pt-0 last:pb-0"
                  >
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {formatDate(st.publishedAt)}
                    </p>
                    <h4 className="text-xs font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mt-0.5">
                      {st.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
