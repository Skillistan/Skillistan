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

function formatTenure(startDate: Date | null, endDate: Date | null) {
  if (!startDate) return null

  const startMonth = startDate.toLocaleString('en-US', { month: 'short' })
  const startYear = startDate.getFullYear()
  const startStr = `${startMonth} ${startYear}`

  const end = endDate || new Date()
  const endMonth = end.toLocaleString('en-US', { month: 'short' })
  const endYear = end.getFullYear()
  const endStr = `${endMonth} ${endYear}`

  const totalMonths = (endYear - startYear) * 12 + (end.getMonth() - startDate.getMonth())
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  let duration = ''
  if (years > 0 && months > 0) {
    duration = `${years}yr ${months}mo`
  } else if (years > 0) {
    duration = `${years}yr`
  } else if (months > 0) {
    duration = `${months}mo`
  } else {
    duration = '1mo' // Fallback for very new
  }

  return {
    period: endDate ? `${startStr} - ${endStr}` : `Since ${startStr}`,
    duration,
    active: !endDate,
  }
}

const InitialsAvatar = ({ name, className }: { name: string; className?: string }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
  return (
    <div className={`flex items-center justify-center bg-primary/8 text-primary font-heading font-bold select-none ${className || ''}`}>
      {initials}
    </div>
  )
}

export default async function AboutPage() {
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
                <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                  {leadership.map((member) => {
                    const tenure = formatTenure(member.startDate, member.endDate)
                    return (
                      <div key={member.id} className="group border border-border bg-card overflow-hidden transition-all duration-300 hover:border-foreground/40 hover:shadow-lg">
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          {member.imageUrl ? (
                            <Image
                              src={member.imageUrl}
                              alt={member.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <InitialsAvatar name={member.name} className="w-full h-full text-4xl" />
                          )}
                          {member.linkedinUrl && (
                            <a
                              href={member.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm border border-border p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                              aria-label="LinkedIn profile"
                            >
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                              </svg>
                            </a>
                          )}
                        </div>
                        <div className="p-5 space-y-2.5">
                          <h4 className="font-heading text-lg font-bold text-foreground">{member.name}</h4>
                          <p className="font-mono text-[11px] text-primary uppercase tracking-wider font-semibold">{member.role}</p>
                          {tenure && (
                            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5">
                              {tenure.active && <span className="size-1.5 rounded-full bg-primary shrink-0" />}
                              <span>{tenure.period}</span>
                              <span className="opacity-60">•</span>
                              <span>{tenure.duration}</span>
                            </div>
                          )}
                          {member.bio && (
                            <p className="text-xs leading-relaxed text-muted-foreground border-t border-border/60 pt-3 mt-3 italic">
                              &ldquo;{member.bio}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
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
                <div className="grid gap-5 grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto">
                  {employees.map((member) => {
                    const tenure = formatTenure(member.startDate, member.endDate)
                    return (
                      <div key={member.id} className="group border border-border bg-card overflow-hidden transition-all duration-300 hover:border-foreground/40 hover:shadow-lg">
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          {member.imageUrl ? (
                            <Image
                              src={member.imageUrl}
                              alt={member.name}
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <InitialsAvatar name={member.name} className="w-full h-full text-2xl" />
                          )}
                          {member.linkedinUrl && (
                            <a
                              href={member.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm border border-border p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                              aria-label="LinkedIn profile"
                            >
                              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                              </svg>
                            </a>
                          )}
                        </div>
                        <div className="p-4 space-y-1.5">
                          <h4 className="font-heading text-base font-bold text-foreground">{member.name}</h4>
                          <p className="text-xs text-primary font-medium">{member.role}</p>
                          {tenure && (
                            <p className="text-[10px] font-mono text-muted-foreground">
                              {tenure.period} ({tenure.duration})
                            </p>
                          )}
                          {member.bio && (
                            <p className="text-xs leading-relaxed text-muted-foreground border-t border-border/50 pt-2.5 mt-2.5 italic">
                              &ldquo;{member.bio}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
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
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
                  {interns.map((member) => {
                    const tenure = formatTenure(member.startDate, member.endDate)
                    return (
                      <div key={member.id} className="group flex items-start gap-4 border border-border bg-card p-4 transition-all duration-300 hover:border-foreground/40 hover:shadow-sm">
                        <div className="relative size-14 shrink-0 overflow-hidden bg-muted border border-border">
                          {member.imageUrl ? (
                            <Image
                              src={member.imageUrl}
                              alt={member.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <InitialsAvatar name={member.name} className="w-full h-full text-sm" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading text-sm font-bold text-foreground truncate">{member.name}</h4>
                            {member.linkedinUrl && (
                              <a
                                href={member.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                                aria-label="LinkedIn profile"
                              >
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                </svg>
                              </a>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                          {tenure && (
                            <p className="text-[10px] font-mono text-muted-foreground mt-1">
                              {tenure.period} ({tenure.duration})
                            </p>
                          )}
                          {member.bio && (
                            <p className="text-[11px] leading-relaxed text-muted-foreground mt-2 border-t border-border/50 pt-2 italic">
                              &ldquo;{member.bio}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
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
