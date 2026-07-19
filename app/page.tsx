import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { EventCard } from '@/components/event-card'
import { StoryCard } from '@/components/story-card'
import {
  getUpcomingEvents,
  impactStats,
  programs,
  stories,
} from '@/lib/content'

const tickerItems = [
  'Youth Skills',
  'Digital Literacy',
  'Climate Action',
  'Leadership',
  'Community',
  'Sustainability',
]

export default function HomePage() {
  const upcomingEvents = getUpcomingEvents().slice(0, 2)
  const recentStories = stories.slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-16 md:px-6 md:pt-20 md:pb-24">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">
          Youth-led · Bahria Town Phase 4, Islamabad
        </p>
        <h1 className="mt-4 font-heading text-5xl leading-[0.95] font-bold tracking-tight text-balance md:text-8xl">
          Skills grow.
          <br />
          <span className="text-primary">People grow.</span>
        </h1>
        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
            Skillistan equips young people across Pakistan with practical
            skills, digital literacy, and climate leadership — so growth is
            something they build, not wait for.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/programs"
              className="bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Explore programs
            </Link>
            <Link
              href="/volunteer"
              className="inline-flex items-center gap-1 border border-foreground px-5 py-3 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
            >
              Become a volunteer
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="relative mt-12 aspect-[16/8] w-full overflow-hidden md:mt-16">
          <Image
            src="/images/group-photo.jpg"
            alt="Skillistan training cohort holding certificates on the steps of a partner campus"
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover object-[50%_35%]"
          />
        </div>
      </section>

      {/* Ticker */}
      <div
        className="overflow-hidden border-y border-border bg-background py-4"
        aria-hidden="true"
      >
        <div className="animate-marquee flex w-max gap-8">
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map(
            (item, i) => (
              <span
                key={i}
                className="flex items-center gap-8 font-heading text-sm font-medium tracking-widest whitespace-nowrap uppercase"
              >
                {item}
                <span className="text-primary">✦</span>
              </span>
            ),
          )}
        </div>
      </div>

      {/* Impact */}
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <h2 className="max-w-2xl font-heading text-3xl font-bold tracking-tight text-balance md:text-5xl">
            Youth empowerment, measured in people — not promises.
          </h2>
          <dl className="mt-12 grid grid-cols-2 gap-px bg-ink-foreground/15 md:grid-cols-4">
            {impactStats.map((stat) => (
              <div key={stat.label} className="bg-ink p-6 md:p-8">
                <dd className="font-heading text-4xl font-bold text-primary md:text-5xl">
                  {stat.value}
                </dd>
                <dt className="mt-2 text-sm text-ink-foreground/70">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Programs */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <SectionHeading
          eyebrow="What we do"
          title="Five areas. One mission."
          linkHref="/programs"
          linkLabel="All programs"
        />
        <div className="mt-10">
          {programs.map((program) => (
            <div
              key={program.number}
              className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 border-t border-border py-6 last:border-b md:grid-cols-[6rem_1fr_1.2fr] md:gap-x-10 md:py-8"
            >
              <span className="font-heading text-sm font-medium text-primary">
                {program.number}
              </span>
              <h3 className="font-heading text-xl font-bold text-balance transition-colors group-hover:text-primary md:text-2xl">
                {program.title}
              </h3>
              <p className="col-start-2 text-sm leading-relaxed text-muted-foreground md:col-start-3">
                {program.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Events */}
      <section className="border-t border-border bg-secondary/60">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <SectionHeading
            eyebrow="Get involved"
            title="Upcoming events"
            linkHref="/events"
            linkLabel="All events"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <SectionHeading
          eyebrow="From the field"
          title="Recent stories"
          linkHref="/stories"
          linkLabel="All stories"
        />
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {recentStories.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:px-6 md:py-24">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/sdg-team.jpg"
              alt="Skillistan volunteers holding the Skillistan sign behind blocks of the 17 Sustainable Development Goals"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-medium tracking-widest text-primary uppercase">
              Join us
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-balance md:text-5xl">
              The next cohort needs people like you.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground text-pretty">
              Volunteer as a trainer, organizer, or campaigner — or partner
              with us to bring programs to your campus or community.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/volunteer"
                className="bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Apply to volunteer
              </Link>
              <Link
                href="/contact"
                className="border border-foreground px-5 py-3 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
              >
                Partner with us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
