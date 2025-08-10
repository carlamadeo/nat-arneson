
import React from 'react'
import type { DurationMinutes } from '@/types'

type Props = { value: DurationMinutes; onChange: (v: DurationMinutes) => void; className?: string }
export default function DurationPicker({ value, onChange, className }: Props) {
  return (
    <div className={"flex items-center gap-2 "+(className??'')}>
      <span className="text-sm">Duration</span>
      <select value={value} onChange={(e)=>onChange(Number(e.target.value) as DurationMinutes)} className="ml-auto border rounded-xl px-3 py-2 text-sm">
        <option value={15}>15 min</option>
        <option value={30}>30 min</option>
        <option value={45}>45 min</option>
        <option value={60}>60 min</option>
      </select>
    </div>
  )
}
