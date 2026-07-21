import Link from 'next/link'
import { ArrowRight, Home, Compass, BookOpen, Mail } from 'lucide-react'

export const metadata = {
  title: '404 — Page Not Found | Skillistan',
  description: 'The page you are looking for does not exist on Skillistan.',
}

const quickLinks = [
  {
    icon: Compass,
    label: 'Explore Programs',
    description: 'Browse our digital literacy, freelancing, and climate skills programs.',
    href: '/programs',
  },
  {
    icon: BookOpen,
    label: 'Read Stories',
    description: 'Catch up on our latest news, event recaps, and community updates.',
    href: '/stories',
  },
  {
    icon: Mail,
    label: 'Contact Us',
    description: 'Reach out to our team for partnerships, questions, or media requests.',
    href: '/contact',
  },
]

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-14 pb-16 md:px-6 md:pt-20 md:pb-24 select-none">
      {/* Hero area */}
      <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:gap-16 items-center">
        {/* Left — text content */}
        <div>
          <p className="text-xs font-medium tracking-widest text-primary uppercase">
            Error 404
          </p>
          <h1 className="mt-4 font-heading text-4xl leading-tight font-bold tracking-tight text-balance md:text-6xl">
            Page not found.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
            The link you followed may be broken or the page may have been moved.
            Don&apos;t worry — let&apos;s get you back on track.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Home className="size-3.5" />
              Back to Home
            </Link>
            <Link
              href="/volunteer"
              className="inline-flex items-center gap-2 border border-border bg-card px-5 py-3 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Join as a Volunteer
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Right — large decorative 404 */}
        <div className="relative flex items-center justify-center" aria-hidden="true">
          <span className="font-heading text-[10rem] sm:text-[14rem] md:text-[16rem] font-black leading-none text-primary/[0.06] tracking-tighter">
            404
          </span>
          {/* Floating accent dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-16 md:size-20 border-2 border-primary/20 rounded-full flex items-center justify-center">
            <div className="size-3 md:size-4 bg-primary rounded-full" />
          </div>
        </div>
      </div>

      {/* Quick-link cards */}
      <div className="mt-16 md:mt-20">
        <h2 className="font-heading text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-6">
          Maybe you were looking for
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group border border-border bg-card p-6 flex flex-col gap-4 hover:border-primary/20 hover:shadow-sm transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-center size-10 bg-primary/10 border border-primary/20 text-primary">
                <item.icon className="size-4" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                  {item.label}
                  <ArrowRight className="size-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed text-pretty">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
