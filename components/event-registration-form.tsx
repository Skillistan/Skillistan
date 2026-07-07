'use client'

import { useState } from 'react'
import { TextAreaField, TextField } from '@/components/form-fields'
import type { Event } from '@/lib/content'

// TODO: Wire to POST /api/events/[slug]/registrations once the DB is connected.
export function EventRegistrationForm({ event }: { event: Event }) {
  const [submitted, setSubmitted] = useState(false)
  const prefix = `reg-${event.slug}`

  if (submitted) {
    return (
      <div className="border border-primary/40 bg-primary/5 p-6" role="status">
        <p className="font-heading font-bold">Registration received</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {`Thanks for registering for ${event.title}. We'll email you the details soon.`}
        </p>
      </div>
    )
  }

  return (
    <form
      aria-label={`Register for ${event.title}`}
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id={`${prefix}-first-name`}
          label="First name"
          required
          autoComplete="given-name"
        />
        <TextField
          id={`${prefix}-last-name`}
          label="Last name"
          required
          autoComplete="family-name"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id={`${prefix}-email`}
          label="Email"
          type="email"
          required
          autoComplete="email"
        />
        <TextField
          id={`${prefix}-mobile`}
          label="Mobile number"
          type="tel"
          required
          autoComplete="tel"
        />
      </div>
      <TextAreaField
        id={`${prefix}-message`}
        label="Anything we should know?"
        rows={3}
        placeholder="Optional"
      />
      <button
        type="submit"
        className="mt-1 w-fit bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Register for this event
      </button>
    </form>
  )
}
