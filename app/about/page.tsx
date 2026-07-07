import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { impactStats } from '@/lib/content'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Skillistan is a youth-led organization empowering young people in Pakistan through skills development, digital literacy, and climate leadership.',
}

const beliefs = [
  {
    title: 'Skills over ceremonies',
    description:
      'A certificate is a beginning, not an ending. Every program ends with a concrete next step participants can act on within ninety days.',
  },
  {
    title: 'Youth lead, not attend',
    description:
      'Young people are organizers, trainers, and decision-makers in everything we do — not just an audience to be spoken at.',
  },
  {
    title: 'Local first',
    description:
      'We build with schools, universities, and communities in Khyber Pakhtunkhwa, in the languages and contexts our participants actually live in.',
  },
  {
    title: 'Growth is sustainable',
    description:
      'From climate action to career skills, we only invest in growth that can be maintained — by people, and by the planet.',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-12 md:px-6 md:pt-20">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">
          About Skillistan
        </p>
        <h1 className="mt-4 max-w-4xl font-heading text-4xl leading-tight font-bold tracking-tight text-balance md:text-6xl">
          A youth-led movement for skills, sustainability, and leadership.
        </h1>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/lcoy-award.jpg"
              alt="Skillistan representatives receiving a recognition award at the Local Conference of Youth in Khyber Pakhtunkhwa"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-5 leading-relaxed text-muted-foreground">
            <p>
              Skillistan began with a simple observation: young people in
              Pakistan are not short on talent — they are short on access.
              Access to practical training, to digital tools, to platforms
              where their voices count.
            </p>
            <p>
              We work to close that gap. Through skills bootcamps, digital
              literacy programs, climate conferences like LCOY Khyber
              Pakhtunkhwa, and campus partnerships, we have reached thousands
              of students and young professionals across the province and
              beyond.
            </p>
            <p>
              Our tagline is our test for everything we do:{' '}
              <strong className="text-foreground">
                Empowering Youth for Sustainable Growth.
              </strong>{' '}
              If a program does not leave young people more capable — and the
              community more resilient — we do not run it.
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-6xl gap-px bg-ink-foreground/15 px-0 md:grid-cols-2">
          <div className="bg-ink px-4 py-12 md:p-14">
            <p className="text-xs font-medium tracking-widest text-primary uppercase">
              Mission
            </p>
            <p className="mt-4 font-heading text-2xl leading-snug font-bold text-balance md:text-3xl">
              Equip young people with the skills, confidence, and platforms
              they need to build sustainable livelihoods and lead their
              communities.
            </p>
          </div>
          <div className="bg-ink px-4 py-12 md:p-14">
            <p className="text-xs font-medium tracking-widest text-primary uppercase">
              Vision
            </p>
            <p className="mt-4 font-heading text-2xl leading-snug font-bold text-balance md:text-3xl">
              A Pakistan where every young person can turn their potential
              into progress — for themselves, their communities, and the
              planet.
            </p>
          </div>
        </div>
      </section>

      {/* Beliefs */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">
          What we believe
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-balance md:text-4xl">
          Four principles behind every program
        </h2>
        <div className="mt-10 grid gap-px bg-border sm:grid-cols-2">
          {beliefs.map((belief) => (
            <div key={belief.title} className="bg-background p-6 md:p-8">
              <h3 className="font-heading text-xl font-bold">{belief.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {belief.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact summary */}
      <section className="border-t border-border bg-secondary/60">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <h2 className="max-w-sm font-heading text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Impact so far
            </h2>
            <dl className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-4">
              {impactStats.map((stat) => (
                <div key={stat.label}>
                  <dd className="font-heading text-3xl font-bold text-primary md:text-4xl">
                    {stat.value}
                  </dd>
                  <dt className="mt-1.5 text-sm text-muted-foreground">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center md:px-6 md:py-24">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-balance md:text-5xl">
          Want to build this with us?
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
          Whether you want to volunteer, partner, or simply learn more — we
          would love to hear from you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/volunteer"
            className="bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Volunteer with us
          </Link>
          <Link
            href="/contact"
            className="border border-foreground px-5 py-3 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  )
}
