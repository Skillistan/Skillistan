import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Skillistan',
  description: 'Learn how Skillistan collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 pt-14 pb-16 md:px-6 md:pt-20 md:pb-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer select-none mb-8"
      >
        <ArrowLeft className="size-3.5" />
        Return to Home
      </Link>

      <p className="text-xs font-medium tracking-widest text-primary uppercase">
        Legal Policy
      </p>
      <h1 className="mt-4 font-heading text-4xl leading-tight font-bold tracking-tight text-balance md:text-5xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-xs font-mono text-muted-foreground">
        Last updated: July 2026
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground">
            1. Overview
          </h2>
          <p>
            Skillistan (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), headquartered in Bahria Town Phase 4, Islamabad, Pakistan, is committed to safeguarding your privacy. This Privacy Policy explains how we collect, use, and protect your information when you visit our website, register for events, apply as a volunteer, or subscribe to our newsletter.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground">
            2. Information We Collect
          </h2>
          <p>We may collect personal information that you voluntarily provide to us, including:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Contact Details:</strong> First name, last name, email address, and mobile number when submitting contact forms or applying to volunteer.</li>
            <li><strong>Event Registrations:</strong> Information submitted when registering for Skillistan workshops, bootcamps, or conferences.</li>
            <li><strong>Newsletter Subscriptions:</strong> Your email address when subscribing to receive updates.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground">
            3. How We Use Your Information
          </h2>
          <p>We use the collected information for legitimate organizational purposes, including:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Processing event registrations and providing event details.</li>
            <li>Reviewing and responding to volunteer applications and contact inquiries.</li>
            <li>Sending news, program announcements, and impact recaps to newsletter subscribers.</li>
            <li>Improving our website performance, programs, and user experience.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground">
            4. Data Protection & Sharing
          </h2>
          <p>
            We do not sell, rent, or trade your personal information to third parties. Access to your personal data is restricted strictly to authorized Skillistan personnel.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground">
            5. Contact Us
          </h2>
          <p>
            If you have any questions regarding this Privacy Policy or wish to update or remove your personal details, please contact us at:
          </p>
          <div className="p-4 border border-border bg-card text-xs space-y-1 text-foreground font-mono">
            <p><strong>Email:</strong> contact@skillistan.org</p>
            <p><strong>Phone:</strong> +92 333 4835523</p>
            <p><strong>Address:</strong> Bahria Town Phase 4, Islamabad, Pakistan</p>
          </div>
        </section>
      </div>
    </section>
  )
}
