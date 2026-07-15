import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, CalendarDays, MapPin, Clock, CheckCircle } from 'lucide-react'
import db from '@/lib/db'
import { EventRegistrationForm } from '@/components/event-registration-form'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await db.event.findUnique({ where: { slug } })

  if (!event || event.status !== 'published') {
    return { title: 'Event Not Found - Skillistan' }
  }

  return {
    title: `${event.title} - Skillistan`,
    description: event.description
      ? event.description.substring(0, 160)
      : `Join us at Skillistan's event: ${event.title}.`,
  }
}

const formatFullDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params
  const event = await db.event.findUnique({ where: { slug } })

  if (!event || event.status !== 'published') {
    notFound()
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isPast = new Date(event.eventDate) < today

  return (
    <>
      {/* Cover Banner */}
      <div className="relative w-full aspect-[16/7] md:aspect-[16/6] overflow-hidden bg-muted border-b border-border">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center bg-ink text-ink-foreground h-full w-full select-none text-center px-6">
            <p className="text-xs uppercase font-medium tracking-widest text-primary mb-3">
              Skillistan Event
            </p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold max-w-3xl text-balance">
              {event.title}
            </h1>
          </div>
        )}
      </div>

      <article className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
        {/* Back link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All events
        </Link>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
          {isPast ? (
            <span className="bg-muted px-2 py-1 font-medium text-muted-foreground">
              Completed
            </span>
          ) : event.registrationEnabled ? (
            <span className="bg-primary px-2 py-1 font-medium text-primary-foreground">
              Registration open
            </span>
          ) : (
            <span className="bg-muted px-2 py-1 font-medium text-muted-foreground">
              Registration closed
            </span>
          )}
          <span className="text-muted-foreground flex items-center gap-1">
            <CalendarDays className="size-3" aria-hidden="true" />
            {formatFullDate(event.eventDate)}
          </span>
          <span className="text-muted-foreground flex items-center gap-1">
            <Clock className="size-3" aria-hidden="true" />
            {formatTime(event.eventDate)}
          </span>
          <span className="text-muted-foreground flex items-center gap-1">
            <MapPin className="size-3" aria-hidden="true" />
            {event.location || 'Online'}
          </span>
        </div>

        {/* Title (shown when cover has an image, since fallback already shows it) */}
        <h1 className="font-heading text-3xl font-bold tracking-tight text-balance md:text-5xl">
          {event.title}
        </h1>

        {/* Two-column layout: description + registration */}
        <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
          {/* Left: event description */}
          <div className="order-2 md:order-1">
            <p className="text-xs font-medium tracking-widest text-primary uppercase mb-3">
              About this event
            </p>
            <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {event.description}
            </div>
          </div>

          {/* Right: registration card */}
          <div className="order-1 md:order-2">
            <div className="border border-border bg-card p-6 md:p-8 sticky top-24">
              {!isPast && event.registrationEnabled ? (
                <>
                  <h2 className="font-heading text-2xl font-bold tracking-tight mb-2">
                    Register your spot
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Fill in your details below. Seats are limited and we will
                    send confirmation details to your email.
                  </p>
                  <EventRegistrationForm
                    event={{
                      id: event.id,
                      title: event.title,
                      slug: event.slug,
                    }}
                  />
                </>
              ) : isPast ? (
                <div className="py-6 text-center space-y-3">
                  <span className="flex size-12 mx-auto items-center justify-center bg-muted text-muted-foreground">
                    <CheckCircle className="size-6" />
                  </span>
                  <h3 className="font-heading text-lg font-bold">
                    This event has ended
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    This program concluded on{' '}
                    {new Date(event.eventDate).toLocaleDateString()}. Thank you
                    to everyone who participated.
                  </p>
                  <Link
                    href="/events"
                    className="mt-2 inline-block text-sm font-medium text-primary hover:underline underline-offset-4"
                  >
                    Explore upcoming events
                  </Link>
                </div>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <span className="flex size-12 mx-auto items-center justify-center bg-muted text-muted-foreground">
                    <Clock className="size-6" />
                  </span>
                  <h3 className="font-heading text-lg font-bold">
                    Registration is closed
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    Online registration is unavailable for this program.
                    Reach out if you have questions.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-2 inline-block text-sm font-medium text-primary hover:underline underline-offset-4"
                  >
                    Get in touch
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
