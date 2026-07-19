'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/public/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Subscription failed.')
      }
      setStatus('done')
      setMessage(data.message || "You're on the list. We'll be in touch.")
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'An error occurred. Please try again.')
    }
  }

  if (status === 'done') {
    return (
      <p className="text-sm text-primary animate-fade-in font-medium" role="status">
        {message}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <form
        noValidate
        className="flex w-full items-stretch gap-2"
        onSubmit={handleSubmit}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          disabled={status === 'loading'}
          className="min-w-0 flex-1 border border-ink-foreground/25 bg-transparent px-3 py-2.5 text-sm text-ink-foreground placeholder:text-ink-foreground/50 focus:border-primary focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="shrink-0 bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer select-none"
        >
          {status === 'loading' && <Loader2 className="animate-spin size-4" />}
          Subscribe
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-rose-500 font-medium">{message}</p>
      )}
    </div>
  )
}
