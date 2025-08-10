
import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { daysInMonth, formatDate, isSameDay, weekdayShort } from '../utils/date'

type Props = {
  monthCursor: Date
  selectedDate: Date | null
  onSelectDate: (d: Date) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  enabledWeekdays?: number[]
  isDateEnabled?: (d: Date) => boolean
  className?: string
}

function isEnabled(date: Date, enabledWeekdays?: number[], isDateEnabled?: (d: Date) => boolean) {
  if (enabledWeekdays && !enabledWeekdays.includes(date.getDay())) return false
  if (isDateEnabled && !isDateEnabled(date)) return false
  return true
}

export default function Calendar({ monthCursor, selectedDate, onSelectDate, onPrevMonth, onNextMonth, enabledWeekdays, isDateEnabled, className }: Props) {
  const y = monthCursor.getFullYear()
  const m = monthCursor.getMonth()
  const total = daysInMonth(y, m)
  const days: Date[] = Array.from({ length: total }, (_, i) => new Date(y, m, i + 1))
  const first = new Date(y, m, 1).getDay()
  const leading: (Date | null)[] = Array.from({ length: first }, () => null)
  const cells: (Date | null)[] = [...leading, ...days]
  const labels = weekdayShort()

  return (
    <div className={"bg-white rounded-2xl shadow p-4 md:p-6 "+(className??'')}>
      <div className="flex items-center justify-between mb-4">
        <button className="p-2 rounded-xl hover:bg-neutral-100" onClick={onPrevMonth} aria-label="Previous month"><ChevronLeft/></button>
        <div className="text-center"><div className="text-xl font-semibold">{formatDate(monthCursor, { month: 'long', year: 'numeric' })}</div></div>
        <button className="p-2 rounded-xl hover:bg-neutral-100" onClick={onNextMonth} aria-label="Next month"><ChevronRight/></button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs font-medium text-neutral-500">{labels.map((w,i)=>(<div key={i} className="py-2">{w}</div>))}</div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, idx) => {
          if (cell === null) return <div key={idx}/>;
          const today = new Date()
          const isToday = isSameDay(cell, today)
          const selectable = isEnabled(cell, enabledWeekdays, isDateEnabled)
          const selected = selectedDate && isSameDay(cell, selectedDate)
          return (
            <button key={idx} onClick={() => selectable && onSelectDate(cell)}
              className={"aspect-square rounded-xl text-sm flex items-center justify-center border "+(selectable? (selected?"bg-black text-white border-black":"hover:bg-neutral-100 border-neutral-200"):"bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed")}
              aria-disabled={!selectable} aria-pressed={!!selected}>
              <span className="relative">{cell.getDate()}{isToday && !selected && (<span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] text-blue-600">•</span>)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
