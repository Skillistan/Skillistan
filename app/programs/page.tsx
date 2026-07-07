import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { programs } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Programs',
  description:
    'Explore Skillistan programs: youth skills development, digital literacy, climate action, leadership, and community workshops.',
}

export default function ProgramsPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-12 md:px-6 md:pt-20 md:pb-16">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">
          Our work
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-tight font-bold tracking-tight text-balance md:text-6xl">
          Programs built for how young people actually grow.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Every Skillistan program is practical, local, and designed to leave
          participants with something they can act on immediately — a skill, a
          plan, or a platform.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-24">
        <div className="flex flex-col">
          {programs.map((program, index) => (
            <article
              key={program.number}
              className="grid gap-6 border-t border-border py-10 last:border-b md:grid-cols-[6rem_1fr] md:gap-10 md:py-14"
            >
              <span
                aria-hidden="true"
                className="font-heading text-5xl font-bold text-primary/30 md:text-6xl"
              >
                {program.number}
              </span>
              <div className="max-w-2xl">
                <h2 className="font-heading text-2xl font-bold text-balance md:text-3xl">
                  {program.title}
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {program.description}
                </p>
                {index === 2 && (
                  <div className="relative mt-8 aspect-[16/8] overflow-hidden">
                    <Image
                      src="/images/sdg-team.jpg"
                      alt="Skillistan team with the 17 SDG blocks at a climate awareness event"
                      fill
                      sizes="(max-width: 768px) 100vw, 672px"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-16 md:flex-row md:items-center md:justify-between md:px-6 md:py-20">
          <h2 className="max-w-xl font-heading text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Want to bring a program to your campus or community?
          </h2>
          <Link
            href="/contact"
            className="shrink-0 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Talk to our team
          </Link>
        </div>
      </section>
    </>
  )
}
