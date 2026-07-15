'use client'

import { useState } from 'react'
import { TextAreaField, TextField } from '@/components/form-fields'
import { Loader2 } from 'lucide-react'

type EventProps = {
  id: string;
  title: string;
  slug: string;
}

export function EventRegistrationForm({ event }: { event: EventProps }) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [message, setMessage] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const prefix = `reg-${event.slug}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)

    // Client-side validations
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim()) {
      setErrorMsg("All fields except the message are required.")
      setSubmitting(false)
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setErrorMsg("Please enter a valid email address.")
      setSubmitting(false)
      return
    }

    // Mobile number length verification
    if (mobile.trim().length < 8) {
      setErrorMsg("Please enter a valid mobile number.")
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch("/api/public/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          message: message.trim() || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to register.")
      }

      setSubmitted(true)
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

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
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      {errorMsg && (
        <div className="border border-destructive/40 bg-destructive/5 p-4 text-xs text-destructive font-medium">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id={`${prefix}-first-name`}
          label="First name"
          required
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          id={`${prefix}-last-name`}
          label="Last name"
          required
          autoComplete="family-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id={`${prefix}-email`}
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id={`${prefix}-mobile`}
          label="Mobile number"
          type="tel"
          required
          autoComplete="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>
      <TextAreaField
        id={`${prefix}-message`}
        label="Anything we should know?"
        rows={3}
        placeholder="Optional"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        disabled={submitting}
        className="mt-1 w-fit bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
      >
        {submitting && <Loader2 className="animate-spin" size={14} />}
        {submitting ? "Registering..." : "Register for this event"}
      </button>
    </form>
  )
}
