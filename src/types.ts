
export type Slot = { start: Date; end: Date }
export type AvailabilityRule = { weekday: number; start: string; end: string }
export type DurationMinutes = 15 | 30 | 45 | 60
export type BookingSelection = { date: Date | null; duration: DurationMinutes; slot: Slot | null }
