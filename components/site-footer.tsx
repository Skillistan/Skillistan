import Link from 'next/link'
import { NewsletterForm } from '@/components/newsletter-form'

const footerNav = [
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/events', label: 'Events' },
  { href: '/stories', label: 'Stories' },
  { href: '/volunteer', label: 'Volunteer' },
  { href: '/contact', label: 'Contact' },
]

export function SiteFooter() {
  return (
    <footer className="overflow-hidden bg-ink text-ink-foreground">
      <div className="mx-auto max-w-6xl px-4 pt-16 md:px-6 md:pt-20">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-md">
            <h2 className="font-heading text-2xl font-bold text-balance">
              Growth you have to keep watering.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-foreground/70">
              Occasional updates on programs, events, and stories from the
              field. No spam, ever.
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>

          <div className="flex gap-16">
            <nav aria-label="Footer">
              <h3 className="text-xs font-medium tracking-widest text-ink-foreground/50 uppercase">
                Explore
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {footerNav.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-foreground/80 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h3 className="text-xs font-medium tracking-widest text-ink-foreground/50 uppercase">
                Contact
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm text-ink-foreground/80">
                <li>
                  <a
                    href="mailto:contact@skillistan.org"
                    className="transition-colors hover:text-primary"
                  >
                    contact@skillistan.org
                  </a>
                </li>
                <li>Bahria Town Phase 4, Islamabad, Pakistan</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-1 border-t border-ink-foreground/15 pt-6 pb-4 text-xs text-ink-foreground/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Skillistan. All rights reserved.</p>
          <p>Empowering Youth for Sustainable Growth</p>
        </div>

        {/* Oversized wordmark */}
        <p
          aria-hidden="true"
          className="pointer-events-none -mb-[0.26em] font-heading text-[19vw] leading-none font-bold tracking-tighter whitespace-nowrap text-ink-foreground/10 select-none md:text-[13.5rem]"
        >
          SKILLISTAN
        </p>
      </div>
    </footer>
  )
}
