import Image from 'next/image'
import type { Metadata } from 'next'
import { InquiryForm } from '@/components/inquiry-form'

export const metadata: Metadata = {
  title: 'Volunteer',
  description:
    'Apply to volunteer with Skillistan: train, organize, and campaign alongside a youth-led team working on skills and sustainability in Pakistan.',
}

const roles = [
  {
    title: 'Trainers & mentors',
    description:
      'Lead sessions on digital skills, freelancing, communication, or your own area of expertise.',
  },
  {
    title: 'Event organizers',
    description:
      'Help plan and run bootcamps, workshops, and conferences, including logistics, registration, and on-the-day coordination.',
  },
  {
    title: 'Climate campaigners',
    description:
      'Drive SDG awareness campaigns, tree drives, and youth climate initiatives in your community.',
  },
  {
    title: 'Media & design',
    description:
      'Photography, social media, design, and storytelling that helps our work travel further.',
  },
]

const expectations = [
  'A few hours a week, flexible around your studies or work',
  'Reliable communication with your team lead',
  'At least one active program or event per quarter',
  'A certificate and reference letter for consistent volunteers',
]

export default function VolunteerPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-12 md:px-6 md:pt-20 md:pb-16">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">
          Volunteer
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-tight font-bold tracking-tight text-balance md:text-6xl">
          Do work that outlasts the event.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Skillistan is powered by volunteers: students and young
          professionals who train, organize, and campaign in their own
          communities. Join them.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 md:grid-cols-2 md:px-6 md:pb-24">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight border-b border-border pb-3">
            What volunteers do
          </h2>
          <div className="mt-6 flex flex-col gap-4">
            {roles.map((role) => (
              <div
                key={role.title}
                className="border border-border p-4 bg-card/30 hover:bg-card hover:-translate-y-0.5 transition-all duration-300"
              >
                <h3 className="font-heading text-lg font-bold text-primary">
                  {role.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {role.description}
                </p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 font-heading text-2xl font-bold tracking-tight border-b border-border pb-3">
            What we expect
          </h2>
          <ul className="mt-6 flex flex-col gap-3">
            {expectations.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed items-start">
                <span aria-hidden="true" className="mt-0.5 text-primary font-bold">
                  ✦
                </span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>

          <div className="relative mt-12 aspect-[4/3] overflow-hidden border border-border">
            <Image
              src="/images/plant-gift.jpg"
              alt="A Skillistan guest of honor receiving a potted plant at a youth conference"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Application Form Box (Sticky) */}
        <div className="h-fit border border-border bg-card p-6 md:sticky md:top-24 md:p-8 shadow-sm">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            Apply now
          </h2>
          <p className="mt-2 mb-6 text-sm leading-relaxed text-muted-foreground">
            Tell us a little about yourself. Applications are reviewed on a
            rolling basis.
          </p>
          <InquiryForm variant="volunteer" />
        </div>
      </section>
    </>
  )
}
