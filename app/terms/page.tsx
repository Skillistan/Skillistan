import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | Skillistan',
  description: 'Terms and conditions governing the use of Skillistan website and programs.',
}

export default function TermsOfServicePage() {
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
        Terms of Service
      </h1>
      <p className="mt-3 text-xs font-mono text-muted-foreground">
        Last updated: July 2026
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the Skillistan website (skillistan.org), registering for our events, or participating in our programs, you agree to comply with and be bound by these Terms of Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground">
            2. Program Participation & Conduct
          </h2>
          <p>
            Skillistan programs, workshops, and volunteer initiatives are designed to foster respectful, inclusive, and empowering learning environments. Participants and volunteers are expected to interact professionally and respectfully with peers, trainers, and organizers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground">
            3. Intellectual Property
          </h2>
          <p>
            All original content, logos, branding, graphics, and course materials published on the Skillistan platform are the intellectual property of Skillistan unless otherwise specified. Uncredited commercial reproduction is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground">
            4. Disclaimer & Governing Law
          </h2>
          <p>
            Skillistan operates as a youth-led empowerment initiative headquartered in Islamabad, Pakistan. These terms shall be governed by and construed in accordance with the laws of Pakistan.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold text-foreground">
            5. Contact Information
          </h2>
          <p>
            For any questions or inquiries regarding these Terms of Service, please reach out to us:
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
