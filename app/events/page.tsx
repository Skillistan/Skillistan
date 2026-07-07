import Image from 'next/image'
import type { Metadata } from 'next'
import { EventCard } from '@/components/event-card'
import { EventRegistrationForm } from '@/components/event-registration-form'
import { formatDate, getPastEvents, getUpcomingEvents } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Upcoming and past Skillistan events — bootcamps, workshops, and youth climate conferences across Pakistan.',
}

export default function EventsPage() {
  const upcoming = getUpcomingEvents()
  const past = getPastEvents()

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-12 md:px-6 md:pt-20 md:pb-16">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">
          Events
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-tight font-bold tracking-tight text-balance md:text-6xl">
          Show up. Skill up.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Bootcamps, workshops, and conferences — free or low-cost, always
          hands-on, and open to students and young professionals.
        </p>
      </section>

      {/* Upcoming with registration */}
      <section
        aria-labelledby="upcoming-heading"
        className="mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-24"
      >
        <h2
          id="upcoming-heading"
          className="font-heading text-2xl font-bold tracking-tight md:text-3xl"
        >
          Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <div className="mt-8 border border-dashed border-border p-10 text-center">
            <p className="font-heading text-lg font-bold">
              No upcoming events right now
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Subscribe to the newsletter below and be the first to know when
              registration opens.
            </p>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-12">
            {upcoming.map((event) => (
              <article
                key={event.slug}
                id={`register-${event.slug}`}
                className="grid gap-8 border border-border bg-card p-5 scroll-mt-24 md:grid-cols-2 md:p-8"
              >
                <div>
                  {event.imageUrl && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={event.imageUrl || '/placeholder.svg'}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="mt-5 text-xs font-medium tracking-widest text-primary uppercase">
                    {formatDate(event.eventDate)} · {event.location}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-bold text-balance md:text-3xl">
                    {event.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {event.description}
                  </p>
                </div>
                <div className="md:border-l md:border-border md:pl-8">
                  <h4 className="mb-4 font-heading text-lg font-bold">
                    Register your spot
                  </h4>
                  <EventRegistrationForm event={event} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Past events */}
      <section
        aria-labelledby="past-heading"
        className="border-t border-border bg-secondary/60"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <h2
            id="past-heading"
            className="font-heading text-2xl font-bold tracking-tight md:text-3xl"
          >
            Past events
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {past.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
