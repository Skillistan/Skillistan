import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import db from '@/lib/db'
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
      'Young people are organizers, trainers, and decision-makers in everything we do, not just an audience to be spoken at.',
  },
  {
    title: 'Local first',
    description:
      'We build with schools, universities, and communities in Khyber Pakhtunkhwa, in the languages and contexts our participants actually live in.',
  },
  {
    title: 'Growth is sustainable',
    description:
      'From climate action to career skills, we only invest in growth that can be maintained by people, and by the planet.',
  },
]

// Helper component for initials avatar if no imageUrl is present
const InitialsAvatar = ({ name, className }: { name: string; className?: string }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
  return (
    <div className={`flex items-center justify-center bg-primary/10 text-primary font-heading font-bold text-lg select-none ${className || ''}`}>
      {initials}
    </div>
  )
}

export default async function AboutPage() {
  // Query team members from the database
  const teamMembers = await db.teamMember.findMany({
    orderBy: { order: 'asc' },
  })

  const leadership = teamMembers.filter((m) => m.category === 'leadership')
  const employees = teamMembers.filter((m) => m.category === 'employee')
  const interns = teamMembers.filter((m) => m.category === 'intern')
  const hasTeam = teamMembers.length > 0

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
              Pakistan are not short on talent, they are short on access.
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
              If a program does not leave young people more capable and the
              community more resilient, we do not run it.
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
              into progress for themselves, their communities, and the
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

      {/* Team Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24 border-t border-border">
        <p className="text-xs font-medium tracking-widest text-primary uppercase text-center">
          Our Team
        </p>
        <h2 className="mt-2 text-center font-heading text-3xl font-bold tracking-tight text-balance md:text-5xl">
          Empowering Youth for Sustainable Growth
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          Meet the team leads, staff, and partners working together to build tech bootcamps, climate drives, and vocational programs.
        </p>

        {!hasTeam ? (
          <div className="mt-12 text-center py-16 border border-dashed border-border bg-card/45 max-w-md mx-auto p-6">
            <p className="font-heading font-bold text-lg">Our Team is Growing</p>
            <p className="text-sm text-muted-foreground mt-2">
              We are currently setting up our team registry. Please check back soon to meet our founders, trainers, and coordinators!
            </p>
          </div>
        ) : (
          <div className="mt-16 space-y-20">
            {/* Leadership Grid */}
            {leadership.length > 0 && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground text-center">Senior Management</h3>
                  <div className="mx-auto mt-1.5 h-0.5 w-12 bg-primary"></div>
                </div>
                <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
                  {leadership.map((member) => (
                    <div key={member.id} className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.33%-1.5rem)] max-w-sm border border-border bg-card p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                      <div className="relative mb-4 shrink-0">
                        <div className="relative h-32 w-32 overflow-hidden rounded-full border border-border bg-muted">
                          {member.imageUrl ? (
                            <Image
                              src={member.imageUrl}
                              alt={member.name}
                              fill
                              sizes="128px"
                              className="object-cover"
                            />
                          ) : (
                            <InitialsAvatar name={member.name} className="h-full w-full" />
                          )}
                        </div>
                        {member.linkedinUrl && (
                          <a
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-0 right-1 bg-background text-muted-foreground hover:text-primary border border-border p-1.5 rounded-full shadow-sm hover:scale-105 transition-transform duration-200 outline-none select-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                            aria-label="LinkedIn profile"
                          >
                            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                            </svg>
                          </a>
                        )}
                      </div>
                      <h4 className="font-heading text-lg font-bold text-foreground">{member.name}</h4>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-1">{member.role}</p>
                      {member.bio && (
                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground border-t border-border/60 pt-3">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Employees Grid */}
            {employees.length > 0 && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground text-center">Staff & Trainers</h3>
                  <div className="mx-auto mt-1.5 h-0.5 w-12 bg-primary"></div>
                </div>
                <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
                  {employees.map((member) => (
                    <div key={member.id} className="w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(25%-1.15rem)] max-w-[240px] border border-border bg-card p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                      <div className="relative mb-3 shrink-0">
                        <div className="relative h-24 w-24 overflow-hidden rounded-full border border-border bg-muted">
                          {member.imageUrl ? (
                            <Image
                              src={member.imageUrl}
                              alt={member.name}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          ) : (
                            <InitialsAvatar name={member.name} className="h-full w-full" />
                          )}
                        </div>
                        {member.linkedinUrl && (
                          <a
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-0 right-0 bg-background text-muted-foreground hover:text-primary border border-border p-1 rounded-full shadow-sm hover:scale-105 transition-transform duration-200 outline-none select-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                            aria-label="LinkedIn profile"
                          >
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                            </svg>
                          </a>
                        )}
                      </div>
                      <h4 className="font-heading text-base font-bold text-foreground">{member.name}</h4>
                      <p className="text-xs text-primary font-medium mt-0.5">{member.role}</p>
                      {member.bio && (
                        <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground border-t border-border/50 pt-2.5 w-full">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interns Grid */}
            {interns.length > 0 && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground text-center">Internees</h3>
                  <div className="mx-auto mt-1.5 h-0.5 w-12 bg-primary"></div>
                </div>
                <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                  {interns.map((member) => (
                    <div key={member.id} className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(20%-0.8rem)] max-w-[180px] border border-border bg-card p-4 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
                      <div className="relative mb-2 shrink-0">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border bg-muted">
                          {member.imageUrl ? (
                            <Image
                              src={member.imageUrl}
                              alt={member.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <InitialsAvatar name={member.name} className="h-full w-full text-sm" />
                          )}
                        </div>
                        {member.linkedinUrl && (
                          <a
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute -bottom-0.5 -right-0.5 bg-background text-muted-foreground hover:text-primary border border-border p-0.5 rounded-full shadow-sm hover:scale-105 transition-transform duration-200 outline-none select-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                            aria-label="LinkedIn profile"
                          >
                            <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                            </svg>
                          </a>
                        )}
                      </div>
                      <h4 className="font-heading text-sm font-semibold text-foreground">{member.name}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{member.role}</p>
                      {member.bio && (
                        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground border-t border-border/50 pt-2 w-full">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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
          Whether you want to volunteer, partner, or simply learn more, we
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
