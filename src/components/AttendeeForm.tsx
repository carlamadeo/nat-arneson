
import React, { useState } from 'react'

type Props = {
  onSubmit: (attendee: { name: string; email: string }) => void | Promise<void>
  loading?: boolean
}

export default function AttendeeForm({ onSubmit, loading }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)

  const validEmail = email.includes('@') && email.includes('.')
  const valid = name.trim().length > 1 && validEmail

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!valid) return
    await onSubmit({ name: name.trim(), email: email.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-2">
      <div className="grid gap-1">
        <label className="text-sm" htmlFor="name">Name</label>
        <input id="name" value={name} onChange={e=>setName(e.target.value)}
               className="border rounded-xl px-3 py-2 text-sm" placeholder="Ada Lovelace" />
        {touched && name.trim().length <= 1 && <span className="text-xs text-red-600">Name is required</span>}
      </div>
      <div className="grid gap-1">
        <label className="text-sm" htmlFor="email">Email</label>
        <input id="email" value={email} onChange={e=>setEmail(e.target.value)}
               className="border rounded-xl px-3 py-2 text-sm" placeholder="ada@example.com" />
        {touched && !validEmail && <span className="text-xs text-red-600">Enter a valid email</span>}
      </div>
      <button type="submit" disabled={!valid || loading}
              className="bg-black text-white rounded-xl px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Booking…' : 'Confirm booking'}
      </button>
    </form>
  )
}
