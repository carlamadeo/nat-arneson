
import React, { useEffect, useMemo, useState } from "react";
import Calendar from "./components/Calendar";
import DurationPicker from "./components/DurationPicker";
import TimeSlots from "./components/TimeSlots";
import AttendeeForm from "./components/AttendeeForm";
import type { AvailabilityRule, BookingSelection, DurationMinutes, Slot } from "./types";
import { startOfMonth, addMonths, formatDate, toHM } from "./utils/date";

const DEFAULT_AVAILABILITY: AvailabilityRule[] = [
  { weekday: 1, start: "09:00", end: "17:00" },
  { weekday: 2, start: "09:00", end: "17:00" },
  { weekday: 3, start: "09:00", end: "17:00" },
  { weekday: 4, start: "09:00", end: "17:00" },
  { weekday: 5, start: "09:00", end: "15:00" },
];

const API_BASE = (import.meta as any).env?.VITE_API_BASE || "";

export default function App() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [monthCursor, setMonthCursor] = useState<Date>(startOfMonth(new Date()));
  const [selection, setSelection] = useState<BookingSelection>({ date: null, duration: 30 as DurationMinutes, slot: null });
  const [rules] = useState<AvailabilityRule[]>(DEFAULT_AVAILABILITY);
  const [loading, setLoading] = useState(false);
  const [resultLink, setResultLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<{ start: Date; end: Date }[]>([]);
  const [checkingBusy, setCheckingBusy] = useState(false);

  const enabledWeekdays = useMemo(() => Array.from(new Set(rules.map(r => r.weekday))).sort(), [rules]);

  const onPickSlot = (slot: Slot) => {
    setResultLink(null);
    setError(null);
    setSelection(prev => ({ ...prev, slot }));
  };

  async function fetchBusy(date: Date) {
    setCheckingBusy(true);
    setBusy([]);
    try {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      const res = await fetch(`${API_BASE}/api/freebusy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: start.toISOString(), end: end.toISOString() })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const busyRanges = (data?.busy || []).map((b: any) => ({ start: new Date(b.start), end: new Date(b.end) }));
      setBusy(busyRanges);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingBusy(false);
    }
  }

  useEffect(() => {
    if (selection.date) {
      fetchBusy(selection.date);
    } else {
      setBusy([]);
    }
  }, [selection.date, selection.duration]);

  async function bookOnServer(attendee: { name: string; email: string }) {
    if (!selection.slot) return;
    setLoading(true);
    setError(null);
    setResultLink(null);
    try {
      const res = await fetch(`${API_BASE}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: `Meeting with ${attendee.name}`,
          start: selection.slot.start.toISOString(),
          end: selection.slot.end.toISOString(),
          attendees: [{ email: attendee.email, displayName: attendee.name }],
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResultLink(data.htmlLink || null);
    } catch (e: any) {
      setError(e?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-semibold">Select a date</div>
            <div className="text-xs text-neutral-500">Timezone: {tz}</div>
          </div>

          <DurationPicker
            value={selection.duration}
            onChange={(val) => setSelection(prev => ({ ...prev, duration: val, slot: null }))}
            className="mb-4"
          />

          <Calendar
            monthCursor={monthCursor}
            selectedDate={selection.date}
            onSelectDate={(d) => setSelection(prev => ({ ...prev, date: d, slot: null }))}
            onPrevMonth={() => setMonthCursor(addMonths(monthCursor, -1))}
            onNextMonth={() => setMonthCursor(addMonths(monthCursor, 1))}
            enabledWeekdays={enabledWeekdays}
          />
        </div>

        <div className="bg-white rounded-2xl shadow p-4 md:p-6 flex flex-col">
          <div className="mb-4">
            <div className="text-xl font-semibold">
              {selection.date ? formatDate(selection.date, { weekday: "long", month: "long", day: "numeric" }) : "Pick a date"}
            </div>
            {selection.date && (
              <div className="text-xs text-neutral-500">{formatDate(selection.date, { year: "numeric" })}</div>
            )}
          </div>

          {checkingBusy && <div className="text-sm text-neutral-500 mb-2">Checking availability…</div>}
          <TimeSlots
            date={selection.date}
            duration={selection.duration}
            rules={rules}
            selectedSlot={selection.slot}
            onSelectSlot={onPickSlot}
            busy={busy}
            className="flex-1"
          />

          <div className="mt-6 border-t pt-4 flex flex-col gap-4">
            {selection.slot ? (
              <>
                <div className="text-sm">
                  <div className="font-medium">Selected</div>
                  <div>
                    {formatDate(selection.slot.start, { weekday: "long", month: "long", day: "numeric" })}
                    {" • "}
                    {toHM(selection.slot.start)}–{toHM(selection.slot.end)} ({tz})
                  </div>
                </div>
                <AttendeeForm onSubmit={bookOnServer} loading={loading} />
                {resultLink && (
                  <a href={resultLink} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">Open in Google Calendar</a>
                )}
                {error && <div className="text-sm text-red-600">{error}</div>}
              </>
            ) : (
              <div className="text-sm text-neutral-500">Pick a time to continue.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
