
import React from 'react'
import type { AvailabilityRule, DurationMinutes, Slot } from '@/types'
import { addMinutes, formatDate, inFuture, setHM } from '../utils/date'

type BusyRange = { start: Date; end: Date }

type Props = {
  date: Date | null
  duration: DurationMinutes
  rules: AvailabilityRule[]
  selectedSlot: Slot | null
  onSelectSlot: (s: Slot) => void
  busy?: BusyRange[]
  className?: string
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd
}

function generateSlots(date: Date, duration: DurationMinutes, rules: AvailabilityRule[]): Slot[] {
  const rule = rules.find(r => r.weekday === date.getDay())
  if (!rule) return []
  const start = setHM(date, rule.start)
  const end = setHM(date, rule.end)
  const slots: Slot[] = []
  for (let t = new Date(start); addMinutes(t, duration) <= end; t = addMinutes(t, duration)) {
    const s = new Date(t)
    const e = addMinutes(s, duration)
    if (inFuture(s)) slots.push({ start: s, end: e })
  }
  return slots
}

export default function TimeSlots({ date, duration, rules, selectedSlot, onSelectSlot, busy = [], className }: Props) {
  if (!date) return <div className={className}>Choose a date to see available times.</div>
  const slots = generateSlots(date, duration, rules)
  if (slots.length === 0) return <div className={className}>No slots available for this day.</div>

  return (
    <div className={"grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[420px] overflow-auto pr-1 "+(className??'')}>
      {slots.map((s,i)=> {
        const isBusy = busy.some(b => overlaps(s.start, s.end, b.start, b.end))
        const isSelected = selectedSlot && selectedSlot.start.getTime() === s.start.getTime()
        return (
          <button key={i} onClick={() => !isBusy && onSelectSlot(s)}
            className={
              "border rounded-xl px-3 py-2 text-sm " +
              (isBusy ? "bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed"
                      : "hover:bg-neutral-50 " + (isSelected ? "border-black" : "border-neutral-200"))
            }
            disabled={isBusy}
            aria-disabled={isBusy}
          >
            {formatDate(s.start,{hour:'2-digit', minute:'2-digit'})}
          </button>
        )
      })}
    </div>
  )
}
