import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function SectionHeading({
  eyebrow,
  title,
  linkHref,
  linkLabel,
}: {
  eyebrow: string
  title: string
  linkHref?: string
  linkLabel?: string
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <p className="text-xs font-medium tracking-widest text-primary uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-balance md:text-4xl">
          {title}
        </h2>
      </div>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:text-primary hover:underline sm:inline-flex"
        >
          {linkLabel}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
