import Image from 'next/image'
import Link from 'next/link'
import { formatDate, type Event } from '@/lib/content'

export function EventCard({ event }: { event: Event }) {
  const isOpen = event.registrationEnabled && event.status === 'published'

  return (
    <article className="group flex flex-col border border-border bg-card transition-colors hover:border-foreground/40">
      {event.imageUrl && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={event.imageUrl || '/placeholder.svg'}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
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
            {formatDate(event.eventDate)} · {event.location}
          </span>
        </div>
        <h3 className="mt-3 font-heading text-xl font-bold text-balance">
          {event.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {event.description}
        </p>
        {isOpen && (
          <Link
            href={`/events#register-${event.slug}`}
            className="mt-4 inline-flex w-fit bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Register now
          </Link>
        )}
      </div>
    </article>
  )
}
