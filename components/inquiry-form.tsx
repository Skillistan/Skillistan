'use client'

import { useState } from 'react'
import { TextAreaField, TextField } from '@/components/form-fields'
import { Loader2 } from 'lucide-react'

export function InquiryForm({
  variant,
}: {
  variant: 'volunteer' | 'contact'
}) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Controlled fields state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [message, setMessage] = useState('')

  // Form field errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const isVolunteer = variant === 'volunteer'

  const validate = (): boolean => {
    const errs: Record<string, string> = {}

    if (!firstName.trim()) {
      errs.firstName = 'First name is required.'
    } else if (firstName.length > 50) {
      errs.firstName = 'First name must be under 50 characters.'
    }

    if (!lastName.trim()) {
      errs.lastName = 'Last name is required.'
    } else if (lastName.length > 50) {
      errs.lastName = 'Last name must be under 50 characters.'
    }

    if (!email.trim()) {
      errs.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address.'
    } else if (email.length > 100) {
      errs.email = 'Email must be under 100 characters.'
    }

    if (!mobile.trim()) {
      errs.mobile = 'Mobile number is required.'
    } else if (!/^\+?[0-9\s\-()]{9,18}$/.test(mobile.trim())) {
      errs.mobile = 'Please enter a valid mobile number (e.g. +92 333 4835523).'
    } else if (mobile.length > 20) {
      errs.mobile = 'Mobile number must be under 20 characters.'
    }

    if (!isVolunteer && !message.trim()) {
      errs.message = 'Message is required.'
    } else if (message.length > 1000) {
      errs.message = 'Message must be under 1000 characters.'
    }

    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setError(null)

    try {
      const url = isVolunteer ? '/api/public/volunteer' : '/api/public/contact'
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          message: message.trim() || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit form.')
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="border border-primary/40 bg-primary/5 p-6 animate-fade-in" role="status">
        <p className="font-heading font-bold text-lg text-primary">
          {isVolunteer ? 'Application Received!' : 'Message Sent!'}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {isVolunteer
            ? 'Thank you for applying to volunteer. Our team will review your application and reach out to you via email shortly.'
            : "Thanks for reaching out! We have received your message and we'll get back to you as soon as possible."}
        </p>
      </div>
    )
  }

  return (
    <form
      noValidate
      aria-label={isVolunteer ? 'Volunteer application' : 'Contact form'}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      {error && (
        <div className="border border-destructive/40 bg-destructive/5 p-4 text-xs text-destructive font-medium">
          {error}
        </div>
      )}

      <fieldset disabled={submitting} className="flex flex-col gap-4 disabled:opacity-75">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <TextField
              id={`${variant}-first-name`}
              label="First name"
              required
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {fieldErrors.firstName && (
              <p className="text-xs text-destructive mt-1 font-medium">{fieldErrors.firstName}</p>
            )}
          </div>
          <div>
            <TextField
              id={`${variant}-last-name`}
              label="Last name"
              required
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {fieldErrors.lastName && (
              <p className="text-xs text-destructive mt-1 font-medium">{fieldErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <TextField
              id={`${variant}-email`}
              label="Email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors.email && (
              <p className="text-xs text-destructive mt-1 font-medium">{fieldErrors.email}</p>
            )}
          </div>
          <div>
            <TextField
              id={`${variant}-mobile`}
              label="Mobile number"
              type="tel"
              required
              autoComplete="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            {fieldErrors.mobile && (
              <p className="text-xs text-destructive mt-1 font-medium">{fieldErrors.mobile}</p>
            )}
          </div>
        </div>

        <div>
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {fieldErrors.message && (
            <p className="text-xs text-destructive mt-1 font-medium">{fieldErrors.message}</p>
          )}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 w-fit bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 flex items-center gap-2 select-none cursor-pointer transition-opacity"
      >
        {submitting && <Loader2 className="animate-spin size-4 shrink-0" />}
        {submitting
          ? 'Submitting...'
          : isVolunteer
          ? 'Submit application'
          : 'Send message'}
      </button>
    </form>
  )
}
