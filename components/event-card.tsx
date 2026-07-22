import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import { formatDate } from '@/lib/content'

type EventCardProps = {
  slug: string
  title: string
  description: string
  eventDate: string | Date
  location: string
  imageUrl: string | null
  registrationEnabled: boolean
  status: string
}

export function EventCard({ event }: { event: EventCardProps }) {
  const isOpen = event.registrationEnabled && event.status === 'published'

  return (
    <article className="group flex flex-col border border-border bg-card transition-colors hover:border-foreground/40 overflow-hidden">
      {/* Cover Header Container (Always 16/9 for balanced grid alignment) */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted border-b border-border">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          /* Styled Fallback Cover Banner */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/15 via-muted to-muted/80 text-foreground select-none">
            <div className="size-10 border border-primary/30 bg-primary/10 text-primary flex items-center justify-center mb-2">
              <CalendarDays className="size-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
              Skillistan Event
            </span>
            <p className="mt-1 font-heading text-sm font-bold text-center line-clamp-1 text-balance">
              {event.title}
            </p>
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
            {isOpen ? 'Registration open' : 'Past event'}
          </span>
          <span className="text-muted-foreground">
            {formatDate(event.eventDate)} · {event.location || 'Online'}
          </span>
        </div>
        <h3 className="mt-3 font-heading text-xl font-bold text-balance">
          {event.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {event.description}
        </p>
        <Link
          href={`/events/${event.slug}`}
          className="mt-4 inline-flex w-fit bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground select-none cursor-pointer"
        >
          {isOpen ? 'Register now' : 'View details'}
        </Link>
      </div>
    </article>
  )
}
