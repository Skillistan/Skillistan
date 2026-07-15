import React from 'react'

const inputClasses =
  'w-full border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

export function TextField({
  id,
  label,
  type = 'text',
  required = false,
  placeholder,
  autoComplete,
  value,
  onChange,
}: {
  id: string
  label: string
  type?: string
  required?: boolean
  placeholder?: string
  autoComplete?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && (
          <span aria-hidden="true" className="text-primary">
            {' *'}
          </span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className={inputClasses}
      />
    </div>
  )
}

export function TextAreaField({
  id,
  label,
  required = false,
  placeholder,
  rows = 4,
  value,
  onChange,
}: {
  id: string
  label: string
  required?: boolean
  placeholder?: string
  rows?: number
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && (
          <span aria-hidden="true" className="text-primary">
            {' *'}
          </span>
        )}
      </label>
      <textarea
        id={id}
        name={id}
        required={required}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
        className={inputClasses}
      />
    </div>
  )
}
