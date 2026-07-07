'use client'

import { useState } from 'react'
import { TextAreaField, TextField } from '@/components/form-fields'

// Shared by the Volunteer and Contact pages.
// TODO: Wire to POST /api/volunteers and POST /api/contact once the DB is connected.
export function InquiryForm({
  variant,
}: {
  variant: 'volunteer' | 'contact'
}) {
  const [submitted, setSubmitted] = useState(false)
  const isVolunteer = variant === 'volunteer'

  if (submitted) {
    return (
      <div className="border border-primary/40 bg-primary/5 p-6" role="status">
        <p className="font-heading font-bold">
          {isVolunteer ? 'Application received' : 'Message sent'}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {isVolunteer
            ? 'Thanks for applying. Our volunteer team will reach out to you soon.'
            : "Thanks for reaching out. We'll get back to you as soon as we can."}
        </p>
      </div>
    )
  }

  return (
    <form
      aria-label={isVolunteer ? 'Volunteer application' : 'Contact form'}
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id={`${variant}-first-name`}
          label="First name"
          required
          autoComplete="given-name"
        />
        <TextField
          id={`${variant}-last-name`}
          label="Last name"
          required
          autoComplete="family-name"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id={`${variant}-email`}
          label="Email"
          type="email"
          required
          autoComplete="email"
        />
        <TextField
          id={`${variant}-mobile`}
          label="Mobile number"
          type="tel"
          required
          autoComplete="tel"
        />
      </div>
      <TextAreaField
        id={`${variant}-message`}
        label={isVolunteer ? 'Area of interest' : 'Message'}
        required={!isVolunteer}
        rows={5}
        placeholder={
          isVolunteer
            ? 'e.g. training, event organizing, climate campaigns, design...'
            : 'How can we help?'
        }
      />
      <button
        type="submit"
        className="mt-1 w-fit bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        {isVolunteer ? 'Submit application' : 'Send message'}
      </button>
    </form>
  )
}
