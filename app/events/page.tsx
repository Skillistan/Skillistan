import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import db from '@/lib/db'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Upcoming and past Skillistan events, including bootcamps, workshops, and youth climate conferences across Pakistan.',
}

const formatEventDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function EventsPage() {
  const events = await db.event.findMany({
    where: { status: 'published' },
    orderBy: { eventDate: 'asc' },
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = events.filter((e) => new Date(e.eventDate) >= today)
  const past = events
    .filter((e) => new Date(e.eventDate) < today)
    .reverse()

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-12 md:px-6 md:pt-20 md:pb-16">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">
          Events
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-tight font-bold tracking-tight text-balance md:text-6xl">
          Show up. Skill up.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Bootcamps, workshops, and conferences: free or low-cost, always
          hands-on, and open to students and young professionals.
        </p>
      </section>

      {/* Upcoming Events */}
      <section
        aria-labelledby="upcoming-heading"
        className="border-t border-border"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <SectionHeading
            eyebrow="Get involved"
            title="Upcoming events"
          />

          {upcoming.length === 0 ? (
            <div className="mt-12 border border-dashed border-border bg-card/50 p-12 text-center max-w-lg mx-auto">
              <p className="font-heading text-lg font-bold">
                No upcoming events right now
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We are planning the next batch of programs. Check back soon or
                get in touch to stay in the loop.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                Get in touch
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {upcoming.map((event) => {
                const isOpen = event.registrationEnabled
                return (
                  <article
                    key={event.id}
                    className="group flex flex-col border border-border bg-card transition-colors hover:border-foreground/40"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                      {event.imageUrl ? (
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-primary/8 text-primary select-none">
                          <div className="text-center space-y-1 px-6">
                            <p className="text-[10px] uppercase tracking-widest font-medium opacity-70">
                              Skillistan Event
                            </p>
                            <p className="font-heading text-lg font-bold text-balance">
                              {event.title}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <div className="flex items-center gap-3 text-xs">
                        <span
                          className={
                            isOpen
                              ? 'bg-primary px-2 py-1 font-medium text-primary-foreground'
                              : 'bg-muted px-2 py-1 font-medium text-muted-foreground'
                          }
                        >
                          {isOpen ? 'Registration open' : 'Coming soon'}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <CalendarDays className="size-3" aria-hidden="true" />
                          {formatEventDate(event.eventDate)}
                        </span>
                      </div>
                      <h3 className="mt-3 font-heading text-xl font-bold text-balance">
                        {event.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {event.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="size-3" aria-hidden="true" />
                          {event.location || 'Online'}
                        </span>
                        <Link
                          href={`/events/${event.slug}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
                        >
                          View details
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section
        aria-labelledby="past-heading"
        className="border-t border-border bg-secondary/60"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <SectionHeading
            eyebrow="From the archive"
            title="Completed programs"
          />

          {past.length === 0 ? (
            <p className="mt-10 text-sm text-muted-foreground">
              No past events to show yet.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {past.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group flex flex-col border border-border bg-card transition-colors hover:border-foreground/40"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    {event.imageUrl ? (
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-muted/80 text-muted-foreground select-none">
                        <div className="text-center space-y-1 px-4">
                          <p className="text-[10px] uppercase tracking-widest font-medium opacity-60">
                            Skillistan
                          </p>
                          <p className="font-heading text-sm font-bold text-balance">
                            {event.title}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 md:p-5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                        Past event
                      </span>
                      <span className="text-muted-foreground">
                        {formatEventDate(event.eventDate)}
                      </span>
                    </div>
                    <h3 className="mt-2 font-heading text-base font-bold text-balance underline-offset-4 group-hover:underline">
                      {event.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
