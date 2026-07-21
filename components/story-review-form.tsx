'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function StoryReviewForm({ storyTitle }: { storyTitle: string }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [review, setReview] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!firstName.trim()) errs.firstName = 'First name is required.'
    if (!lastName.trim()) errs.lastName = 'Last name is required.'
    if (!email.trim()) {
      errs.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address.'
    }
    if (!mobile.trim()) {
      errs.mobile = 'Mobile number is required.'
    } else if (!/^\+?[0-9\s\-()]{9,18}$/.test(mobile.trim())) {
      errs.mobile = 'Please enter a valid contact number (e.g. +92 333 4835523).'
    }
    if (!review.trim()) errs.review = 'Review text is required.'
    else if (review.length > 500) errs.review = 'Review must be under 500 characters.'

    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          message: `[Review for Story: ${storyTitle}] ${review.trim()}`,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit review.')

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="border border-primary/40 bg-primary/5 p-6 animate-fade-in" role="status">
        <p className="font-heading font-bold text-primary">Thank you for your review!</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your feedback has been received and sent to our team dashboard. We appreciate your thoughts!
        </p>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="border border-destructive/40 bg-destructive/5 p-4 text-xs text-destructive font-medium">
          {error}
        </div>
      )}

      <fieldset disabled={submitting} className="space-y-4 disabled:opacity-75">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="rev-first" className="text-xs font-medium">First Name *</label>
            <input
              id="rev-first"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
            {fieldErrors.firstName && <p className="text-[10px] text-destructive">{fieldErrors.firstName}</p>}
          </div>
          <div className="space-y-1">
            <label htmlFor="rev-last" className="text-xs font-medium">Last Name *</label>
            <input
              id="rev-last"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
            {fieldErrors.lastName && <p className="text-[10px] text-destructive">{fieldErrors.lastName}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="rev-email" className="text-xs font-medium">Email Address *</label>
            <input
              id="rev-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
            {fieldErrors.email && <p className="text-[10px] text-destructive">{fieldErrors.email}</p>}
          </div>
          <div className="space-y-1">
            <label htmlFor="rev-mobile" className="text-xs font-medium">Mobile Number *</label>
            <input
              id="rev-mobile"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
            {fieldErrors.mobile && <p className="text-[10px] text-destructive">{fieldErrors.mobile}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="rev-text" className="text-xs font-medium">Your Review *</label>
          <textarea
            id="rev-text"
            rows={4}
            maxLength={500}
            placeholder="Share your thoughts about this article..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
          {fieldErrors.review && <p className="text-[10px] text-destructive">{fieldErrors.review}</p>}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        className="w-fit bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer transition-opacity select-none"
      >
        {submitting && <Loader2 className="animate-spin size-3.5" />}
        Submit Review
      </button>
    </form>
  )
}
