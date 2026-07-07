'use client'

import { useState } from 'react'

// TODO: Wire to POST /api/newsletter once the database is connected.
export function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'done'>('idle')

  if (status === 'done') {
    return (
      <p className="text-sm text-primary" role="status">
        {"You're on the list. We'll be in touch."}
      </p>
    )
  }

  return (
    <form
      className="flex w-full max-w-sm items-stretch gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        setStatus('done')
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        required
        placeholder="you@example.com"
        className="min-w-0 flex-1 border border-ink-foreground/25 bg-transparent px-3 py-2.5 text-sm text-ink-foreground placeholder:text-ink-foreground/50 focus:border-primary focus:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Subscribe
      </button>
    </form>
  )
}
