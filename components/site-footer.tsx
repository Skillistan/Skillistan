import Image from 'next/image'
import Link from 'next/link'
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react'
import { NewsletterForm } from '@/components/newsletter-form'

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/events', label: 'Events' },
  { href: '/stories', label: 'Stories' },
  { href: '/volunteer', label: 'Volunteer' },
  { href: '/technologies', label: 'Skillistan Technologies' },
  { href: '/contact', label: 'Contact' },
]

export function SiteFooter() {
  return (
    <footer className="overflow-hidden bg-ink text-ink-foreground select-none">
      <div className="mx-auto max-w-6xl px-4 pt-14 md:px-6 md:pt-16">
        {/* Top Row: Brand & Newsletter */}
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-start md:justify-between">
          {/* Brand Info */}
          <div className="space-y-4 max-w-md">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Skillistan Home">
              <Image
                src="/images/logo.svg"
                alt="Skillistan Logo"
                width={32}
                height={30}
                className="h-8 w-auto"
              />
              <span className="font-heading text-xl font-bold tracking-tight text-ink-foreground">
                Skill<span className="text-primary">istan</span>
              </span>
            </Link>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">
              Empowering Youth for Sustainable Growth
            </p>
            
            {/* Location Tag */}
            <p className="flex items-center gap-1.5 text-xs text-ink-foreground/75">
              <MapPin className="size-3.5 shrink-0 text-primary" />
              Bahria Town Phase 4, Islamabad, Pakistan
            </p>

            {/* Quick Contact Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="mailto:contact@skillistan.org"
                title="Email us at contact@skillistan.org"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-ink-foreground/20 bg-ink-foreground/5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors text-ink-foreground cursor-pointer select-none"
              >
                <Mail className="size-3.5" />
                Email
              </a>
              <a
                href="tel:+923334835523"
                title="Call us at +92 333 4835523"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-ink-foreground/20 bg-ink-foreground/5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors text-ink-foreground cursor-pointer select-none"
              >
                <Phone className="size-3.5" />
                Call
              </a>
              <a
                href="https://wa.me/923334835523"
                target="_blank"
                rel="noreferrer"
                title="Message us on WhatsApp"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-ink-foreground/20 bg-ink-foreground/5 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors text-ink-foreground cursor-pointer select-none"
              >
                <MessageSquare className="size-3.5" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-ink-foreground/50">
              Stay in the loop
            </h3>
            <p className="text-xs text-ink-foreground/70 leading-relaxed">
              Updates on bootcamps, workshops, and stories from the field.
            </p>
            <div className="pt-1">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Navigation & Legal Bar */}
        <div className="mt-12 pt-6 pb-6 border-t border-ink-foreground/15 flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="Footer Nav">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-foreground/80 font-medium">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-4 text-xs text-ink-foreground/60">
            <span>© {new Date().getFullYear()} Skillistan</span>
            <span>·</span>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
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
