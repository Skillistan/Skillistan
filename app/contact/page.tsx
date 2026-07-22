import type { Metadata } from 'next'
import { Mail, MapPin, Phone } from 'lucide-react'
import { InquiryForm } from '@/components/inquiry-form'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Skillistan for partnerships, program requests, media, or general questions.',
}

const contactDetails = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@skillistan.org',
    href: 'mailto:contact@skillistan.org',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+92 333 4835523',
    href: 'tel:+923334835523',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Bahria Town Phase 4, Islamabad, Pakistan',
    href: null,
  },
]

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-14 pb-16 md:px-6 md:pt-20 md:pb-24">
      <p className="text-xs font-medium tracking-widest text-primary uppercase">
        Contact
      </p>
      <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-tight font-bold tracking-tight text-balance md:text-6xl">
        {"Let's talk."}
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
        Partnerships, program requests, media inquiries, or a simple hello:
        we read everything and reply as fast as we can.
      </p>

      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
        {/* Contact Details Cards */}
        <div className="flex flex-col gap-6">
          {contactDetails.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 border border-border p-4 bg-card/40 hover:bg-card transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <span className="flex size-12 shrink-0 items-center justify-center bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <item.icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-1 block font-medium transition-colors hover:text-primary select-none cursor-pointer"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 font-medium">{item.value}</p>
                )}
              </div>
            </div>
          ))}
          
          <div className="mt-2 border-t border-border pt-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Looking to volunteer instead? Use the dedicated{' '}
              <a
                href="/volunteer"
                className="font-medium text-primary underline-offset-4 hover:underline select-none cursor-pointer"
              >
                volunteer application
              </a>{' '}
              so the right team sees it first.
            </p>
          </div>
        </div>

        {/* Message Form Box */}
        <div className="border border-border bg-card p-6 md:p-8 shadow-sm">
          <h2 className="mb-6 font-heading text-2xl font-bold tracking-tight">
            Send us a message
          </h2>
          <InquiryForm variant="contact" />
        </div>
      </div>
    </section>
  )
}
